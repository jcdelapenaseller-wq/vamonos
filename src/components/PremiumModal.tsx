import React from 'react';
import { X } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  slug?: string;
}

const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, slug }) => {
  if (!isOpen) return null;

  const handlePayment = () => {
    const currentUrl = new URL(window.location.href);
    if (slug) {
      currentUrl.pathname = `/subasta/${slug}`;
    }
    currentUrl.searchParams.set('analysis', 'unlocked');
    
    window.location.href = `https://buy.stripe.com/aFa14p7avcGl6dLa8MdjO04?client_reference_id=${slug || 'unknown'}&redirect_url=${encodeURIComponent(currentUrl.toString())}`;
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-3xl p-8 max-w-lg w-full relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={24} />
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">
            TEST MODAL NUEVO
          </h2>
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">
            La decisión inteligente
          </h2>
          <p className="text-slate-600">
            El análisis completo estima rentabilidad y mercado
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          {/* Card 1: Análisis cargas */}
          <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50">
            <h3 className="font-bold text-slate-900">Análisis cargas</h3>
            <p className="text-sm text-slate-600 mb-4">Detecta riesgos ocultos</p>
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-slate-900">2,99€</span>
              <button 
                onClick={handlePayment}
                className="px-4 py-2 bg-slate-200 text-slate-800 rounded-xl font-bold text-sm hover:bg-slate-300 transition-all"
              >
                Continuar básico
              </button>
            </div>
          </div>

          <div className="text-center text-sm font-medium text-slate-400 my-1">
            O mejor
          </div>

          {/* Card 2: Informe completo */}
          <div className="border-2 border-slate-900 rounded-2xl p-6 bg-slate-900/5 shadow-lg relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
              ✨ Recomendado
            </div>
            <h3 className="font-bold text-slate-900">Informe completo</h3>
            <p className="text-sm text-slate-600 mb-4">Añade análisis de rentabilidad vs mercado</p>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-slate-900">4,99€</span>
                <span className="text-xs font-bold text-emerald-600 ml-2 block">Solo +2,00€</span>
              </div>
              <button 
                onClick={handlePayment}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
              >
                Obtener análisis completo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal;
