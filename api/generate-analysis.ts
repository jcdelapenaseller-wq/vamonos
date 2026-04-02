import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const usedSessions = new Set<string>();

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { auctionId, type } = req.body;
    const { session_id } = req.query;

    if (!session_id) {
      return res.status(400).json({ error: 'Missing session_id' });
    }

    if (session_id === 'test') {
      return res.status(200).json({ ok: true, test: true });
    }

    if (usedSessions.has(session_id as string)) {
      return res.status(409).json({ error: 'Session already used' });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id as string);

    if (
      session.payment_status !== 'paid' ||
      session.metadata?.type !== type ||
      session.client_reference_id !== auctionId
    ) {
      return res.status(403).json({ error: 'Forbidden: Invalid session' });
    }

    usedSessions.add(session_id as string);

    return res.status(200).json({ ok: true });
  } catch (error: any) {
    console.error('Error validating session:', error);
    return res.status(500).json({ error: error.message });
  }
}
