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
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
    if (projectId) {
      admin.initializeApp({
        projectId: projectId
      });
    } else {
      admin.initializeApp();
    }
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
        const userId = session.client_reference_id || session.metadata?.userId;

        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        const priceId = lineItems.data[0]?.price?.id;
        
        if (session.mode === 'subscription') {
          const plan = priceId ? PRICE_TO_PLAN[priceId] : undefined;
          const resolvedUserId = await syncStripeData(userId, email, customerId, subscriptionId, 'active', plan);

          if (resolvedUserId && plan) {
            const notifId = `plan_activated_${session.id}`;
            const db = initAdmin();
            await db.collection('notifications_queue').doc(notifId).set({
              userId: resolvedUserId,
              type: 'plan_activated',
              plan: plan,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
              sent: false
            });
          }
        } else if (session.mode === 'payment') {
          // Handle one-time payment fulfillment here if needed in the future
          console.log(`One-time payment completed for price: ${priceId}`);
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
        const resolvedUserId = await syncStripeData(null, customer.email, customerId, subscriptionId, status);

        if (resolvedUserId && event.type === 'customer.subscription.updated' && subscription.cancel_at_period_end === true) {
          const notifId = `plan_canceled_${event.id}`;
          const db = initAdmin();
          await db.collection('notifications_queue').doc(notifId).set({
            userId: resolvedUserId,
            type: 'plan_canceled',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            sent: false
          });
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        
        const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer;
        const resolvedUserId = await syncStripeData(null, customer.email, customerId, subscription.id, 'canceled');

        if (resolvedUserId) {
          const notifId = `plan_canceled_${event.id}`;
          const db = initAdmin();
          await db.collection('notifications_queue').doc(notifId).set({
            userId: resolvedUserId,
            type: 'plan_canceled',
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            sent: false
          });
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

async function syncStripeData(userId: string | null | undefined, email: string | null | undefined, customerId: string, subscriptionId: string, status: string, plan?: string) {
  const db = initAdmin();

  const usersRef = db.collection('users');
  let userDoc: any;

  if (userId) {
    const doc = await usersRef.doc(userId).get();
    if (doc.exists) {
      userDoc = doc;
    } else {
      console.warn(`User ID ${userId} from Stripe session not found in Firestore.`);
    }
  }

  if (!userDoc && customerId) {
    const querySnapshot = await usersRef.where('stripeCustomerId', '==', customerId).get();
    if (!querySnapshot.empty) {
      userDoc = querySnapshot.docs[0];
    }
  }

  if (!userDoc && email) {
    const querySnapshot = await usersRef.where('email', '==', email).get();
    if (!querySnapshot.empty) {
      userDoc = querySnapshot.docs[0];
    }
  }

  if (userDoc) {
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
    
    console.log(`Synced Stripe data for user: ${userDoc.id} (email: ${email}, status: ${status}, plan: ${plan || 'untouched'})`);
    return userDoc.id;
  } else {
    console.warn(`Could not sync Stripe data. No user found with userId: ${userId}, customerId: ${customerId}, or email: ${email}`);
    return null;
  }
}

