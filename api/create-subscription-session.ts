import Stripe from 'stripe';
import { auth } from '../src/lib/firebase';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, userId, email, mode = 'subscription' } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: mode,
      success_url: `${process.env.APP_URL || 'https://activosoffmarket.es'}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_URL || 'https://activosoffmarket.es'}/pro`,
      customer_email: email,
      client_reference_id: userId,
      metadata: {
        userId: userId
      }
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating subscription session:', error);
    return res.status(500).json({ error: error.message });
  }
}
