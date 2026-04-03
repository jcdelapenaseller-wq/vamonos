import Stripe from 'stripe';
import { db } from '../src/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    if (!db) {
      return res.status(500).json({ error: 'Database not initialized' });
    }

    // Retrieve user from Firestore
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userSnap.data();
    const stripeCustomerId = userData.stripeCustomerId;

    if (!stripeCustomerId) {
      return res.status(400).json({ error: 'No Stripe customer ID found for this user' });
    }

    // Create Stripe billing portal session
    const returnUrl = `${process.env.APP_URL || 'https://activosoffmarket.es'}/mi-cuenta`;
    
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: returnUrl,
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating billing portal session:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
