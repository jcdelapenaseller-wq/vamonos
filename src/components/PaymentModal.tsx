import React from 'react';
import { X, FileText, TrendingUp } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'analysis' | 'cargas';
  auctionId: string;
  autoCheckout?: 'cargas' | 'completo' | null;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, type, auctionId, autoCheckout }) => {
  const { plan } = useUser();
  const [isLoading, setIsLoading] = React.useState<string | null>(null);

  const handleCheckout = async (checkoutType: 'cargas' | 'completo') => {
    if (isLoading) return;
    try {
      setIsLoading(checkoutType);
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
      setIsLoading(null);
    }
  };

  React.useEffect(() => {
    if (isOpen && autoCheckout && !isLoading) {
      handleCheckout(autoCheckout);
    }
  }, [autoCheckout, isOpen]);

  if (!isOpen) return null;

  const getPrice = (targetType: 'analysis' | 'cargas') => {
    if (targetType === 'cargas') return '2,99€';
    switch (plan) {
      case 'pro': return '0,99€';
      case 'basic': return '2,99€';
      default: return '4,99€';
    }
  };

  const diff = Math.round(4.99 - 2.99);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10">
          <X size={24} />
        </button>

        <div className="p-8 md:p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-3">
              {autoCheckout ? 'Redirigiendo a Stripe...' : 'La decisión inteligente'}
            </h2>
            <p className="text-slate-500 text-lg">
              {autoCheckout ? 'Estamos preparando tu sesión de pago seguro.' : 'El análisis completo estima puja y rentabilidad.'}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* Option 1: Cargas */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900">Análisis de cargas</h3>
                <p className="text-slate-500 text-sm">Detecta riesgos ocultos</p>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-900 text-lg mb-2">{getPrice('cargas')}</div>
                <button 
                  onClick={() => handleCheckout('cargas')}
                  disabled={isLoading === 'cargas'}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-white transition-all disabled:opacity-50 text-sm"
                >
                  {isLoading === 'cargas' ? '...' : 'Continuar básico'}
                </button>
              </div>
            </div>

            <div className="text-center font-bold text-slate-400 text-sm my-2">────────  O MEJOR  ────────</div>

            {/* Option 2: Full Analysis (Upsell) */}
            <div className="relative p-6 rounded-2xl border-2 border-slate-900 bg-white shadow-md flex items-center justify-between">
              <div className="absolute -top-3 left-6 bg-amber-400 text-slate-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                ✨ Recomendado
              </div>
              
              <div>
                <h3 className="font-bold text-slate-900">Informe completo</h3>
                <p className="text-slate-500 text-sm">Calcula con más ventaja</p>
              </div>
              <div className="text-right">
                <div className="text-slate-400 text-xs font-bold mb-1">Por sólo +{diff}€</div>
                <div className="font-bold text-slate-900 text-lg mb-2">{getPrice('analysis')}</div>
                <button 
                  onClick={() => handleCheckout('completo')}
                  disabled={isLoading === 'completo'}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg disabled:opacity-50 text-sm"
                >
                  {isLoading === 'completo' ? '...' : 'Obtener análisis completo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
