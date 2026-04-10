import Stripe from 'stripe';
import admin from 'firebase-admin';
import { Readable } from 'stream';

// Helper to read raw body for Vercel serverless
async function buffer(readable: Readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  },
};

// Lazy initialization of Firebase Admin
const initAdmin = () => {
  if (admin.apps.length === 0) {
    admin.initializeApp({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID
    });
  }
  return admin.firestore();
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

const PRICE_TO_PLAN: Record<string, string> = {
  "price_1TGOT7REW0EzPhwIhbngXF2k": "basic",
  "price_1TGObwREW0EzPhwIhEiJ3c11": "basic",
  "price_1TGOZmREW0EzPhwIa3xk5SXr": "basic",
  "price_1TGOjpREW0EzPhwIqh0xNXer": "pro",
  "price_1TGOfWREW0EzPhwIQxyxgMO3": "pro",
  "price_1TGOexREW0EzPhwINiCkV6zn": "pro"
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'];
  let event: Stripe.Event;

  try {
    const rawBody = await buffer(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const email = session.customer_details?.email;

        if (email) {
          const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
          const priceId = lineItems.data[0].price?.id;
          
          if (session.mode === 'subscription') {
            const plan = priceId ? PRICE_TO_PLAN[priceId] : undefined;
            await syncStripeData(email, customerId, subscriptionId, 'active', plan);
          } else if (session.mode === 'payment') {
            // Handle one-time payment fulfillment here if needed in the future
            console.log(`One-time payment completed for price: ${priceId}`);
          }
        }
        break;
      }
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const subscriptionId = subscription.id;
        const status = subscription.status;

        // Get customer email from Stripe
        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        if (customer.email) {
          await syncStripeData(customer.email, customerId, subscriptionId, status);
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        if (customer.email) {
          await syncStripeData(customer.email, customerId, subscription.id, 'canceled');
        }
        break;
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function syncStripeData(email: string, customerId: string, subscriptionId: string, status: string, plan?: string) {
  const db = initAdmin();

  const usersRef = db.collection('users');
  const querySnapshot = await usersRef.where('email', '==', email).get();

  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0];
    const userRef = userDoc.ref;
    
    const updateData: any = {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      stripeStatus: status
    };

    if (plan) {
      updateData.plan = plan;
    }
    
    await userRef.update(updateData);
    
    console.log(`Synced Stripe data for user: ${email}`);
  } else {
    console.warn(`No user found in Firestore with email: ${email}`);
  }
}

