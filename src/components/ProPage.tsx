import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Star, CheckCircle, ArrowRight, FileText, Search, Home, Lock, Zap, CalendarX, Unlock, ChevronDown, ChevronUp, ShieldCheck, X } from 'lucide-react';
import { trackConversion } from '../utils/tracking';
import { motion } from 'motion/react';
import { useUser } from '../contexts/UserContext';
import { toast } from 'sonner';
import { startCheckout, BillingCycle as StripeBillingCycle } from '../lib/billing';
import { ROUTES } from '../constants/routes';
import { PRICING } from '../lib/pricing';

type BillingCycle = 'mensual' | 'trimestral' | 'anual';

const ProPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('anual');
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'pro'>('basic');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isOcupacionModalOpen, setIsOcupacionModalOpen] = useState(false);
  const { user, isLoading, updatePlan, plan: currentPlan } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    trackConversion('espana', 'pro_page_view', 'arrival');
  }, []);

  const handleActivate = async (planToActivate: 'basic' | 'pro') => {
    if (currentPlan === planToActivate) return;

    if (isLoading) return;

    if (!user) {
      navigate(`${ROUTES.LOGIN}?from=feature&redirect=${window.location.pathname}`);
      return;
    }

    try {
      const PRICES = {
        basic: {
          monthly: 'price_1TGOT7REW0EzPhwIhbngXF2k',
          quarterly: 'price_1TGObwREW0EzPhwIhEiJ3c11',
          yearly: 'price_1TGOZmREW0EzPhwIa3xk5SXr',
        },
        pro: {
          monthly: 'price_1TGOjpREW0EzPhwIqh0xNXer',
          quarterly: 'price_1TGOfWREW0EzPhwIQxyxgMO3',
          yearly: 'price_1TGOexREW0EzPhwINiCkV6zn',
        }
      };

      const cycleMap: Record<BillingCycle, 'monthly' | 'quarterly' | 'yearly'> = {
        'mensual': 'monthly',
        'trimestral': 'quarterly',
        'anual': 'yearly'
      };

      const stripeCycle = cycleMap[billingCycle];
      const priceId = PRICES[planToActivate][stripeCycle];
        
      await startCheckout(planToActivate, stripeCycle, priceId, { id: user.id, email: user.email });
    } catch (error) {
      console.error(error);
      toast.error('Error al iniciar el proceso de pago');
    }
  };

  const getPrice = (plan: 'basic' | 'pro') => {
    const planKey = plan.toUpperCase() as keyof typeof PRICING;
    const prices = PRICING[planKey].prices;
    
    if (billingCycle === 'mensual') {
      return `${prices.monthly.toFixed(2).replace('.', ',')}€/mes`;
    }
    
    if (billingCycle === 'trimestral') {
      const monthlyEq = (prices.quarterly / 3).toFixed(1).replace('.', ',');
      return `${monthlyEq}€/mes`;
    }
    
    // Anual
    const monthlyEq = (prices.yearly / 12).toFixed(1).replace('.', ',');
    return `${monthlyEq}€/mes`;
  };

  const getTotalPrice = (plan: 'basic' | 'pro') => {
    const planKey = plan.toUpperCase() as keyof typeof PRICING;
    const prices = PRICING[planKey].prices;
    
    if (billingCycle === 'mensual') return null;
    
    if (billingCycle === 'trimestral') {
      return `${prices.quarterly.toFixed(1).replace('.', ',')}€ cada 3 meses`;
    }
    
    // Anual
    return `${prices.yearly.toFixed(0)}€ al año`;
  };
  const getPeriodLabel = () => {
    if (billingCycle === 'mensual') return '';
    if (billingCycle === 'trimestral') return 'facturado trimestralmente';
    return 'facturado anualmente';
  };

  const annualSavings = Math.max(
    Math.round(((PRICING.BASIC.prices.monthly * 12 - PRICING.BASIC.prices.yearly) / (PRICING.BASIC.prices.monthly * 12)) * 100),
    Math.round(((PRICING.PRO.prices.monthly * 12 - PRICING.PRO.prices.yearly) / (PRICING.PRO.prices.monthly * 12)) * 100)
  );

  const getSavingsData = (plan: 'basic' | 'pro') => {
    if (billingCycle === 'mensual') return null;

    const planKey = plan.toUpperCase() as keyof typeof PRICING;
    const prices = PRICING[planKey].prices;
    
    const basePrice = prices.monthly;
    const currentPrice = billingCycle === 'trimestral' ? prices.quarterly : prices.yearly;
    const months = billingCycle === 'trimestral' ? 3 : 12;

    const monthlyEq = (currentPrice / months).toFixed(2).replace('.', ',');
    const normalTotal = basePrice * months;
    const savingsPercent = Math.round(((normalTotal - currentPrice) / normalTotal) * 100);

    return { monthlyEq, savingsPercent };
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 pb-32 md:pb-20">
      <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
        {currentPlan === 'free' && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
            <CheckCircle size={14} />
            Empieza con 1 análisis gratis incluido
          </div>
        )}
        <h1 className="text-2xl md:text-5xl font-serif font-bold text-slate-900 mb-4">
          Todo lo que necesitas para analizar una subasta con seguridad
        </h1>
        <p className="text-sm md:text-base text-slate-500 mb-10 whitespace-nowrap">
          Empieza gratis · Mejora cuando lo necesites
        </p>

        {/* Toggle */}
        <div className="flex w-full overflow-x-auto items-center p-1 bg-slate-100 rounded-full border border-slate-200 mb-8">
          <button
            onClick={() => setBillingCycle('mensual')}
            className={`px-4 md:px-6 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
              billingCycle === 'mensual'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Mensual
          </button>
          <button
            onClick={() => setBillingCycle('trimestral')}
            className={`px-4 md:px-6 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
              billingCycle === 'trimestral'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Trimestral
          </button>
          <button
            onClick={() => setBillingCycle('anual')}
            className={`px-4 md:px-6 py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap ${
              billingCycle === 'anual'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Anual
            <span className="bg-emerald-100 text-emerald-700 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold">
              -{annualSavings}%
            </span>
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-4 hidden">
          Elige anual y ahorra hasta un 35%
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto mb-12 md:mb-24">
        {/* GRATIS */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 md:p-8 flex flex-col">
          <div className="flex justify-center mb-3 min-h-[32px]">
          </div>
          <div className="flex flex-col gap-2 min-h-[140px]">
            <h3 className="text-xl font-bold text-slate-900">FREE</h3>
            <p className="text-slate-600 text-sm">Explora el mercado sin coste.</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-slate-900">0€</span>
            </div>
            <div className="min-h-[28px] mb-5 opacity-0">placeholder</div>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            {[
              'Acceso a fichas analizadas',
              '5 favoritos',
              '1 alerta básica',
              'Notas personales',
              'Datos Catastro + ubicación',
              '1 análisis de cargas gratis',
              'Checklist profesional de subastas'
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700">
                <CheckCircle size={18} className="text-slate-400 shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <button className="w-full py-3.5 px-6 rounded-xl bg-slate-100 text-slate-900 font-bold hover:bg-slate-200 transition-colors">
            Explorar gratis
          </button>
          <div className="h-4"></div>
        </div>

        {/* BASIC */}
        <div 
          className={`bg-white rounded-3xl border shadow-sm p-6 md:p-8 flex flex-col cursor-pointer transition-all ${selectedPlan === 'basic' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200'}`}
          onClick={() => setSelectedPlan('basic')}
        >
          <div className="flex justify-center mt-1 mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm bg-amber-50 text-amber-700 border-amber-200 transition-all duration-200 hover:scale-105 hover:-translate-y-[1px] hover:bg-amber-100">
              <Star size={12} className="text-amber-600" />
              Más Popular
            </div>
            {currentPlan === 'basic' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm bg-emerald-50 text-emerald-700 border-emerald-200 ml-2 transition-all duration-200 hover:scale-105 hover:-translate-y-[1px]">
                <CheckCircle size={12} className="text-emerald-600" />
                Plan actual
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 min-h-[140px]">
            <h3 className="text-xl font-bold text-slate-900">BASIC</h3>
            <p className="text-slate-600 text-sm">Para los que buscan oportunidades.</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-slate-900">{getPrice('basic')}</span>
            </div>
            <div className="flex items-center gap-2 mt-2 mb-6">
              <span className="text-xs text-slate-500">{getTotalPrice('basic')}</span>
              {billingCycle !== 'mensual' && (
                <span className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded font-medium text-xs">Ahorras {getSavingsData('basic')?.savingsPercent}%</span>
              )}
            </div>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-start gap-3 text-slate-700 font-medium">
              <CheckCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <span className="text-sm">Todo lo de FREE +</span>
            </li>
            {[
              'Favoritos ilimitados',
              '3 alertas personalizadas inteligentes',
              'Botón directo a subasta oficial BOE',
              'Street View del entorno del inmueble',
              'Comparativa real precio mercado',
              'Calculadora PRO (PMR)',
              '3 análisis de cargas al mes'
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-700">
                <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            <button 
              onClick={(e) => { e.stopPropagation(); handleActivate('basic'); }}
              disabled={currentPlan === 'basic'}
              className={`w-full py-3.5 px-6 rounded-xl font-bold transition-colors ${
                currentPlan === 'basic' 
                  ? 'bg-slate-100 text-slate-400 cursor-default' 
                  : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
              }`}
            >
              {currentPlan === 'basic' ? 'Plan actual' : 'Activar plan BASIC'}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">
              Sin compromiso · Cancela cuando quieras
            </p>
          </div>
        </div>

        {/* PRO */}
        <div 
          className={`bg-slate-900 rounded-3xl border shadow-xl p-6 md:p-8 flex flex-col cursor-pointer transition-all ${selectedPlan === 'pro' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-800'} transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10`}
          onClick={() => setSelectedPlan('pro')}
        >
          <div className="flex justify-center mt-1 mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm bg-amber-50 text-amber-700 border-amber-200 transition-all duration-200 hover:scale-105 hover:-translate-y-[1px] hover:bg-amber-100">
              <Star size={12} className="text-amber-600" />
              Recomendado
            </div>
            {currentPlan === 'pro' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border backdrop-blur-sm bg-emerald-50 text-emerald-700 border-emerald-200 ml-2 transition-all duration-200 hover:scale-105 hover:-translate-y-[1px]">
                <CheckCircle size={12} className="text-emerald-600" />
                Plan actual
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 min-h-[140px]">
            <h3 className="text-xl font-bold text-white">PRO</h3>
            <p className="text-slate-400 text-sm">Para los que buscan máxima ventaja.</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-white">{getPrice('pro')}</span>
            </div>
            <div className="flex items-center gap-2 mt-2 mb-6">
              <span className="text-xs text-slate-400">{getTotalPrice('pro')}</span>
              {billingCycle !== 'mensual' && (
                <span className="text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded font-medium text-xs">Ahorras {getSavingsData('pro')?.savingsPercent}%</span>
              )}
            </div>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            {[
              'Todo lo de BASIC +',
              '5 alertas personalizadas inteligentes',
              '5 análisis de cargas al mes',
              '20% descuento en consultoría',
              'Soporte prioritario mismo día'
            ].map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300">
                <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            <button 
              onClick={(e) => { e.stopPropagation(); handleActivate('pro'); }}
              disabled={currentPlan === 'pro'}
              className={`w-full py-3.5 px-6 rounded-xl font-bold transition-colors shadow-lg ${
                currentPlan === 'pro'
                  ? 'bg-slate-800 text-slate-400 cursor-default shadow-none'
                  : 'bg-amber-500 text-white hover:bg-amber-600 shadow-amber-500/20'
              }`}
            >
              {currentPlan === 'pro' ? 'Plan actual' : 'Activar plan PRO'}
            </button>
            <p className="text-xs text-gray-400 text-center mt-3">
              Sin compromiso · Cancela cuando quieras
            </p>
          </div>
        </div>
      </div>

      {/* Reassurance Block */}
      <div className="max-w-6xl mx-auto mb-8 md:mb-16 px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 py-8 border-y border-slate-100">
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <CalendarX size={20} />
            </div>
            <span className="text-sm font-bold text-slate-700">Cancela cuando quieras</span>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <ShieldCheck size={20} />
            </div>
            <span className="text-sm font-bold text-slate-700">Pago seguro con Stripe</span>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
              <Zap size={20} />
            </div>
            <span className="text-sm font-bold text-slate-700">Acceso inmediato</span>
          </div>
          <div className="flex items-center gap-4 justify-center md:justify-start">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 shrink-0">
              <Unlock size={20} />
            </div>
            <span className="text-sm font-bold text-slate-700">Sin permanencia</span>
          </div>
        </div>
      </div>

      {/* Google Reviews */}
      <div className="max-w-6xl mx-auto mb-12 md:mb-24 px-4 text-center flex items-center justify-center gap-3">
        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5" />
        <div className="flex items-center gap-1">
          <div className="text-amber-400 text-xl">★★★★★</div>
          <div className="text-lg font-bold text-slate-900">4.8</div>
        </div>
        <p className="text-sm text-slate-500">
          Más de 5.000 inversores ya analizan subastas con Activos OffMarket
        </p>
      </div>

      {/* FAQ Billing Block */}
      <div className="max-w-3xl mx-auto mb-12 md:mb-24 px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-2">Preguntas sobre facturación</h2>
          <p className="text-slate-500 text-sm">Todo lo que necesitas saber sobre tu suscripción.</p>
        </div>
        
        <div className="space-y-3">
          {[
            {
              q: "¿Puedo cancelar cuando quiera?",
              a: "Sí, puedes cancelar tu suscripción en cualquier momento desde el apartado \"Gestionar suscripción\" en tu perfil de usuario. Sin preguntas ni complicaciones."
            },
            {
              q: "¿Cuándo se renueva mi suscripción?",
              a: "La suscripción se renueva automáticamente al final de cada periodo (mensual, trimestral o anual) utilizando el método de pago que hayas configurado."
            },
            {
              q: "¿Pierdo el acceso si cancelo?",
              a: "No. Si cancelas, mantendrás el acceso a todas las funciones de tu plan hasta que finalice el periodo que ya has pagado."
            },
            {
              q: "¿Puedo cambiar de plan más adelante?",
              a: "Sí, puedes subir o bajar de plan en cualquier momento. Los cambios se prorratearán automáticamente en tu próxima factura a través del portal de Stripe."
            }
          ].map((faq, i) => (
            <div key={i} className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
              <button 
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-slate-900 text-sm">{faq.q}</span>
                {openFaq === i ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
              </button>
              {openFaq === i && (
                <div className="px-6 pb-4 text-slate-600 text-sm leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Servicios sin suscripción */}
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">
            Servicios sin suscripción
          </h2>
          <p className="text-slate-600">
            Paga solo por lo que necesitas, cuando lo necesitas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Dossier */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-colors flex flex-col">
            <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center mb-4 text-slate-700">
              <FileText size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Dossier inversión</h3>
            <p className="text-slate-600 text-sm mb-4">
              Informe completo en PDF con todos los datos de la subasta listos para analizar.
            </p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200 mb-4">
              <span className="font-bold text-slate-900">3,99€</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Pago único</span>
            </div>
            <button 
              onClick={() => navigate(ROUTES.ANALIZAR_SUBASTA)}
              className="w-full py-3 px-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 group"
            >
              Generar dossier
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Análisis cargas */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-colors flex flex-col">
            <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center mb-4 text-slate-700">
              <Search size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Análisis cargas</h3>
            <p className="text-slate-600 text-sm mb-4">
              Estudio detallado de la certificación de cargas para detectar riesgos ocultos.
            </p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200 mb-4">
              <span className="font-bold text-slate-900">2,99€</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Pago único</span>
            </div>
            <button 
              onClick={() => navigate(ROUTES.ANALIZAR_SUBASTA)}
              className="w-full py-3 px-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 group"
            >
              Analizar cargas
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Verificación ocupación */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-slate-300 transition-colors flex flex-col">
            <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center mb-4 text-slate-700">
              <Home size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Verificación ocupación</h3>
            <p className="text-slate-600 text-sm mb-4">
              Comprobación in situ del estado de ocupación del inmueble por profesionales.
            </p>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-200 mb-4">
              <span className="font-bold text-slate-900">Desde 99€</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Bajo presupuesto</span>
            </div>
            <button 
              onClick={() => setIsOcupacionModalOpen(true)}
              className="w-full py-3 px-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 group"
            >
              Solicitar verificación
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Sticky CTA Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-8px_15px_-3px_rgba(0,0,0,0.1)] z-50">
        <button 
          onClick={() => handleActivate(selectedPlan)}
          disabled={currentPlan === selectedPlan}
          className={`w-full py-3.5 px-6 rounded-xl font-bold text-white transition-colors shadow-lg ${
            currentPlan === selectedPlan
              ? 'bg-slate-300 shadow-none cursor-default'
              : selectedPlan === 'basic' 
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' 
                : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20'
          }`}
        >
          {currentPlan === selectedPlan 
            ? 'Plan actual' 
            : `Activar plan ${selectedPlan.toUpperCase()}`}
        </button>
        <p className="text-[11px] text-gray-500 text-center mt-2 font-medium">
          Sin compromiso · Cancela cuando quieras
        </p>
      </div>

      {/* Modal Verificación Ocupación */}
      {isOcupacionModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl"
          >
            <button 
              onClick={() => setIsOcupacionModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="mb-6">
              <div className="w-12 h-12 bg-brand-50 rounded-2xl flex items-center justify-center mb-4 text-brand-600">
                <Home size={24} />
              </div>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">¿Quién ocupa este inmueble?</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Un profesional se desplaza al inmueble, verifica si está habitado o vacío y te entrega un informe con fotos y conclusiones en 7 días laborables.
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              {[
                'Visita presencial al inmueble',
                'Fotos del exterior y entorno',
                'Verificación de indicios de ocupación',
                'Contacto administrador o presidente'
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>

            <div className="space-y-4">
              <a 
                href="mailto:soporte@activosoffmarket.es?subject=Solicitud verificación ocupación&body=Referencia subasta:"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                Solicitar presupuesto
                <ArrowRight size={18} />
              </a>
              <div className="text-center">
                <p className="text-xs text-slate-500 font-medium">
                  Este servicio se activa bajo presupuesto.
                </p>
                <p className="text-[10px] text-slate-400 mt-1">
                  Escríbenos con la referencia de la subasta o dirección del inmueble.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProPage;
