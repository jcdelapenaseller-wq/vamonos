import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🔔 [CHECKOUT] Body recibido:', req.body);
    const { type, auctionId, returnUrl } = req.body;

    const price = type === 'cargas' 
      ? process.env.STRIPE_PRICE_CARGAS 
      : process.env.STRIPE_PRICE_COMPLETO;

    console.log('🔔 [CHECKOUT] Price seleccionado:', price);
    console.log('🔔 [CHECKOUT] STRIPE_SECRET_KEY existe:', !!process.env.STRIPE_SECRET_KEY);
    console.log("STRIPE KEY:", process.env.STRIPE_SECRET_KEY?.slice(0,10));
    console.log("Stripe import OK");

    if (!price) {
      return res.status(500).json({ error: 'Price ID not configured' });
    }

    // Construir success_url de forma segura por si returnUrl ya tiene query params
    const successUrlObj = new URL(returnUrl);
    successUrlObj.searchParams.set('analysis', type);
    const success_url = successUrlObj.toString();

    console.log('🔔 [CHECKOUT] Justo antes de crear sesión');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: success_url,
      cancel_url: returnUrl,
      client_reference_id: auctionId,
    });

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('❌ [CHECKOUT ERROR] Error catch completo:', error);
    return res.status(500).json({ error: error.message });
  }
}
