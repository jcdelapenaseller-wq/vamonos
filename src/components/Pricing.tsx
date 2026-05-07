import React from 'react';
import { Check, X, Sparkles } from 'lucide-react';
import { MetricTag } from '../utils/themeClasses';
import { Link } from 'react-router-dom';

const Pricing: React.FC = () => {
  return (
    <section id="precios" className="py-24 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-7xl mx-auto mb-20">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-6">Planes de Acceso</h2>
          <p className="text-xl md:text-2xl text-slate-700 font-medium max-w-2xl mx-auto leading-relaxed">
            Analiza una subasta antes de pujar, tanto si compras tu vivienda como si inviertes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
          
          {/* Free Tier */}
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 flex flex-col hover:border-slate-300 transition-colors group">
            <div className="mb-4">
              <span className={MetricTag}>FREE</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Explorar</h3>
            <div className="text-4xl font-bold text-slate-900 mb-6">0€ <span className="text-base font-medium text-slate-500">/siempre</span></div>
            <p className="text-slate-600 mb-8 flex-grow leading-relaxed">
              Explora las oportunidades disponibles y usa herramientas básicas de rentabilidad.
            </p>
            <Link to="/login" className="block w-full py-4 px-6 bg-slate-100 text-slate-800 font-bold rounded-xl text-center hover:bg-slate-200 transition-colors mb-8 text-lg">
              Empezar gratis
            </Link>
            <ul className="space-y-4 text-slate-700">
              <li className="flex items-center gap-3">
                <div className="bg-slate-100 p-1 rounded-full group-hover:bg-slate-200 transition-colors"><Check size={16} className="text-slate-600" /></div>
                <span>Acceso al listado público</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-slate-100 p-1 rounded-full group-hover:bg-slate-200 transition-colors"><Check size={16} className="text-slate-600" /></div>
                <span>Uso de calculadoras</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <div className="bg-slate-50 p-1 rounded-full"><X size={16} /></div>
                <span>Análisis de cargas centralizado</span>
              </li>
            </ul>
          </div>

          {/* Basic Tier - HIGHLIGHTED */}
          <div className="bg-brand-50/50 p-10 rounded-3xl shadow-2xl border-2 border-brand-500 relative flex flex-col transform md:-translate-y-4 z-10 transition-transform hover:-translate-y-5">
            <div className={`absolute -top-4 left-1/2 -translate-x-1/2 ${MetricTag} !bg-brand-600 !text-white !border-brand-600 shadow-lg flex items-center gap-1.5 whitespace-nowrap !px-4 !py-1.5`}>
                <Sparkles size={14} /> Recomendado
            </div>
            <div className="mb-4 mt-2">
              <span className={`${MetricTag} !bg-brand-100 !text-brand-800 !border-brand-200`}>BASIC</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Analizar</h3>
            <div className="flex items-baseline gap-1 mb-6">
                <span className="text-sm font-bold text-slate-500">Desde</span>
                <span className="text-4xl font-bold text-slate-900">9,90€</span>
                <span className="text-base font-medium text-slate-500">/mes</span>
            </div>
            <p className="text-slate-600 mb-8 flex-grow leading-relaxed">
              Accede a la estructura de cargas simplificada e informes detallados de cada activo.
            </p>
            <a 
                href="https://buy.stripe.com/28E3cxeCXdKpfOlep2djO05" 
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-5 px-6 bg-brand-700 text-white font-bold rounded-xl text-center hover:bg-brand-800 transition-all mb-8 shadow-lg hover:shadow-brand-500/30 text-lg transform active:scale-95"
            >
              Activar plan
            </a>
            <ul className="space-y-4 text-slate-700">
              <li className="flex items-center gap-3">
                <div className="bg-brand-100 p-1 rounded-full"><Check size={16} className="text-brand-700" /></div>
                <span><strong>Todo</strong> lo de Free</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-brand-100 p-1 rounded-full"><Check size={16} className="text-brand-700" /></div>
                <span><strong>Desglose de cargas</strong></span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-brand-100 p-1 rounded-full"><Check size={16} className="text-brand-700" /></div>
                <span>Alertas en tiempo real</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <div className="bg-slate-50 p-1 rounded-full"><X size={16} /></div>
                <span>Consulta directa con analista</span>
              </li>
            </ul>
          </div>

          {/* Pro Tier */}
          <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 flex flex-col hover:border-slate-300 transition-colors group">
            <div className="mb-4">
              <span className={MetricTag}>PRO</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Decidir con ventaja</h3>
            <div className="flex items-baseline gap-1 mb-6">
                <span className="text-sm font-bold text-slate-500">Desde</span>
                <span className="text-4xl font-bold text-slate-900">19,90€</span>
                <span className="text-base font-medium text-slate-500">/mes</span>
            </div>
            <p className="text-slate-600 mb-8 flex-grow leading-relaxed">
              Herramientas avanzadas, priorización de activos y soporte estratégico.
            </p>
            <div className="flex flex-col gap-3 mb-8">
                <a 
                    href="https://buy.stripe.com/fZu4gB0M7fSxeKh6WAdjO0b"
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="block w-full py-4 px-6 bg-slate-900 text-white font-bold rounded-xl text-center hover:bg-slate-800 transition-colors text-lg transform active:scale-95 shadow-md"
                >
                Activar plan
                </a>
            </div>
            
            <ul className="space-y-4 text-slate-700">
              <li className="flex items-center gap-3">
                <div className="bg-green-100 p-1 rounded-full group-hover:bg-green-200 transition-colors"><Check size={16} className="text-green-700" /></div>
                <span><strong>Todo</strong> lo de Basic</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-green-100 p-1 rounded-full group-hover:bg-green-200 transition-colors"><Check size={16} className="text-green-700" /></div>
                <span>Valoración estimada del activo</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-green-100 p-1 rounded-full group-hover:bg-green-200 transition-colors"><Check size={16} className="text-green-700" /></div>
                <span>Dashboard de seguimiento</span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Pricing;