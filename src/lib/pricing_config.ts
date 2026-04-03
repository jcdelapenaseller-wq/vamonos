export const PRICING_CONFIG = {
  subscriptions: {
    basic: {
      monthly: { priceId: 'price_BASIC_MONTHLY_ID', price: 6.90 },
      quarterly: { priceId: 'price_BASIC_QUARTERLY_ID', price: 18.90 },
      yearly: { priceId: 'price_BASIC_YEARLY_ID', price: 59.00 },
    },
    pro: {
      monthly: { priceId: 'price_PRO_MONTHLY_ID', price: 13.90 },
      quarterly: { priceId: 'price_PRO_QUARTERLY_ID', price: 39.90 },
      yearly: { priceId: 'price_PRO_YEARLY_ID', price: 108.40 }, // 13.90 * 12 * 0.65
    },
  },
  oneTime: {
    dossier: { priceId: 'price_DOSSIER_ID', price: 3.99 },
    cargas: { priceId: 'price_CARGAS_ID', price: 2.99 },
    verificacion: { email: 'contacto@activosoffmarket.es' },
  }
};
