export type PlanTier = 'basic' | 'pro';
export type BillingCycle = 'monthly' | 'quarterly' | 'yearly';

const PAYMENT_LINKS: Record<PlanTier, Record<BillingCycle, string>> = {
  basic: {
    monthly: 'https://buy.stripe.com/28E3cxeCXdKpfOlep2djO05',
    quarterly: 'https://buy.stripe.com/00w4gB3Yj9u96dL80EdjO07',
    yearly: 'https://buy.stripe.com/9B600l0M79u9cC9cgUdjO06',
  },
  pro: {
    monthly: 'https://buy.stripe.com/fZu4gB0M7fSxeKh6WAdjO0b',
    quarterly: 'https://buy.stripe.com/9B6dRbfH1cGl1Xv6WAdjO0a',
    yearly: 'https://buy.stripe.com/00w6oJcuPdKpgSpbcQdjO09',
  }
};

export const startCheckout = async (plan: PlanTier | string, cycle: BillingCycle | string, priceId?: string, user?: { id: string, email: string }, mode: 'subscription' | 'payment' = 'subscription') => {
  if (priceId && user) {
    console.log(`Creating Stripe session for ${plan} (${cycle}) with priceId: ${priceId}, mode: ${mode}`);
    try {
      const response = await fetch('/api/create-subscription-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId: user.id, email: user.email, mode })
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      throw new Error(data.error || 'No URL returned from session creation');
    } catch (error) {
      console.error('Error starting checkout:', error);
      throw error;
    }
  }

  const paymentLink = PAYMENT_LINKS[plan as PlanTier]?.[cycle as BillingCycle];
  if (paymentLink) {
    console.log(`Redirecting to Stripe Payment Link for ${plan} (${cycle})`);
    window.location.href = paymentLink;
  } else {
    console.error('No payment link or priceId provided');
  }
};
