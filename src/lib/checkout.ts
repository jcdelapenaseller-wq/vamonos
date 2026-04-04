export const handleCheckout = async (
  checkoutType: 'cargas' | 'completo',
  auctionId: string,
  setIsLoading?: (type: string | null) => void
) => {
  try {
    if (setIsLoading) setIsLoading(checkoutType);
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: checkoutType,
        auctionId,
        returnUrl: window.location.href
      })
    });
    const data = await response.json();
    if (data.url) {
      (window.top ?? window).location.href = data.url;
    }
  } catch (error) {
    console.error('Error al crear checkout:', error);
  } finally {
    if (setIsLoading) setIsLoading(null);
  }
};
