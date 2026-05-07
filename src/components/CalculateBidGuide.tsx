import { CheckCircle } from 'lucide-react';

import React, { useEffect } from 'react';
import { GuideTOC } from './GuideTOC';
import { GuideMobileCTA } from './GuideMobileCTA';
import { Link, useLocation, useParams } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import ConversionBlock from './ConversionBlock';

const CalculateBidGuide: React.FC = () => {
  const location = useLocation();
  const { city } = useParams();
  
  const getPageContent = () => {
    if (city) {
        const cityName = city.charAt(0).toUpperCase() + city.slice(1);
        
        if (location.pathname.startsWith('/rentabilidad-subasta/')) {
            return {
                title: `Rentabilidad en subastas en ${cityName}`,
                desc: `Guía para calcular la rentabilidad de subastas inmobiliarias en ${cityName}.`,
                explanation: `La rentabilidad en ${cityName} depende de la ubicación, el estado del inmueble y los costes de adquisición. Analizamos el mercado local para maximizar tu inversión.`,
                example: `Inversión total en ${cityName} de 200.000€ con venta final de 260.000€ genera un beneficio neto del 30%.`
            };
        }
        
        if (location.pathname.startsWith('/cuanto-pujar-subasta/')) {
            return {
                title: `Cuánto pujar en subastas en ${cityName}`,
                desc: `Guía para determinar cuánto pujar en subastas inmobiliarias en ${cityName}.`,
                explanation: `Saber cuánto pujar en ${cityName} requiere un análisis exhaustivo de las cargas registrales y la demanda de alquiler en la zona.`,
                example: `Si el valor de mercado en ${cityName} es 300.000€, una puja segura suele rondar los 210.000€ (70%).`
            };
        }

        return { 
          title: `Calcular la puja en una subasta inmobiliaria en ${cityName}`, 
          desc: `Guía para calcular la puja en subastas inmobiliarias en ${cityName}.`,
          explanation: `Calcular la puja en ${cityName} requiere conocer las particularidades del mercado local, como la demanda en barrios específicos y los costes de reforma.`,
          example: `En una subasta en ${cityName} con valor de mercado de 250.000€ y costes de 60.000€, tu puja máxima debería ser 190.000€.`
        };
    }

    switch (location.pathname) {
      case ROUTES.CALCULAR_PUJA:
        return { 
          title: "Cómo calcular la puja en una subasta judicial", 
          desc: "Aprende a calcular la puja correcta para tus inversiones en subastas judiciales.",
          explanation: "Calcular la puja es determinar el precio máximo de adjudicación que garantiza rentabilidad tras descontar impuestos (ITP), gastos de registro, notaría, reformas y posibles deudas.",
          example: "Si un inmueble vale 200.000€ en mercado y tiene 50.000€ en costes totales, tu puja máxima debería ser 150.000€ para cubrir gastos y obtener beneficio."
        };
      case ROUTES.PUJA_MAXIMA_BOE:
        return { 
          title: "Puja máxima en subasta BOE", 
          desc: "Descubre cómo determinar tu puja máxima en el portal del BOE.",
          explanation: "La puja máxima en subastas del BOE es el límite de seguridad que no debes superar para evitar una inversión ruinosa. Se basa en la regla del 70% y el análisis de cargas.",
          example: "Para un valor de tasación de 200.000€, la puja máxima segura según la regla del 70% sería 140.000€, siempre que no existan cargas prioritarias."
        };
      case ROUTES.RENTABILIDAD_JUDICIAL:
        return { 
          title: "Rentabilidad en subasta judicial", 
          desc: "Analiza la rentabilidad real de tus inversiones en subastas.",
          explanation: "La rentabilidad real no es solo la diferencia de precio. Debes considerar el tiempo de inmovilización del capital, el riesgo de ocupación y los costes de desalojo.",
          example: "Adjudicación 100.000€ + Gastos 20.000€ = 120.000€ inversión. Venta 160.000€. Beneficio 40.000€ (33% ROI)."
        };
      case ROUTES.CUANTO_PUJAR_BOE:
        return { 
          title: "Cuánto pujar en subasta BOE", 
          desc: "Guía para saber cuánto pujar en subastas del BOE.",
          explanation: "Saber cuánto pujar requiere conocer la deuda reclamada y las cargas registrales. Pujar demasiado alto elimina tu margen de beneficio.",
          example: "Si la deuda es 80.000€ y el valor de mercado es 150.000€, pujar por encima de 100.000€ reduce drásticamente tu margen."
        };
      default:
        return { title: "Guía de subastas", desc: "Información sobre subastas.", explanation: "", example: "" };
    }
  };

  const content = getPageContent();

  useEffect(() => {
    document.title = `${content.title} | Activos Off-Market`;
  }, [content.title]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 prose prose-slate">
      <h1>{content.title}</h1>\n
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-8 bg-slate-50 inline-flex px-4 py-2 rounded-full border border-slate-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Basado en el análisis de edictos BOE y certificaciones del Registro de la Propiedad
            </div>
      <p>{content.desc}</p>
      
      
            {/* RESUMEN RÁPIDO */}
            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 md:p-8 mb-12 shadow-sm not-prose">
                <h3 className="text-brand-900 font-bold mb-4 flex items-center gap-2">
                    <CheckCircle size={20} className="text-brand-600" /> Resumen Rápido (TL;DR)
                </h3>
                <ul className="space-y-3">
                    <li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        
                {/* RESPUESTA DIRECTA */}
                <div className="bg-brand-50 border-l-4 border-brand-600 p-6 rounded-r-2xl mb-10 not-prose shadow-sm">
                    <h3 className="text-brand-900 font-bold mb-4 flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600"><circle cx="12" cy="12" r="10"></circle><polyline points="12 16 16 12 12 8"></polyline><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                        Resumen Rápido (Subastas BOE)
                    </h3>
                    <ul className="text-brand-800 text-sm leading-relaxed m-0 text-left space-y-2 list-none pl-0">
                        <li className="flex items-start gap-2">
                            <span className="text-brand-600 font-bold mt-0.5">•</span>
                            <span><strong>Adquisición con descuento:</strong> Principal vía para bienes embargados con altos márgenes.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-brand-600 font-bold mt-0.5">•</span>
                            <span><strong>Requisito inicial:</strong> Consignar el 5% del valor de tasación vía Portal BOE.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-brand-600 font-bold mt-0.5">•</span>
                            <span><strong>Riesgos clave:</strong> Deudas previas ocultas (IBI, comunidad) y ocupantes.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-brand-600 font-bold mt-0.5">•</span>
                            <span><strong>Rentabilidad:</strong> Se asegura pujando y purgiendo cargas posteriores.</span>
                        </li>
                    </ul>
                </div>

<p className="leading-snug">Tienes que despejar la fórmula de coste total.</p>
                    </li><li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Sumas la carga y el ITP.</p>
                    </li><li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Tu puja es = Venta - Reforma - Beneficio - Impuestos.</p>
                    </li>
                </ul>
            </div>
            
            <GuideTOC />
            
        
<h2>¿Qué significa este concepto?</h2>
      <p>{content.explanation}</p>
      <p>
        Si estás dando tus primeros pasos y necesitas entender el proceso desde cero, 
        te recomendamos leer nuestra guía sobre <Link to={ROUTES.COMO_COMPRAR} className="font-bold text-brand-700 hover:underline">cómo comprar en una subasta judicial</Link>.
      </p>
      
      <h2>Ejemplo práctico</h2>
      <p>{content.example}</p>
      
      <ConversionBlock />

      
      <section className="not-prose bg-slate-50 p-10 rounded-3xl border border-slate-200 mt-12">
        
<GuideMobileCTA />
<h2 className="font-serif text-2xl font-bold text-slate-900 mb-8">Preguntas frecuentes</h2>
        <div className="space-y-4">
            <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all">
                <summary className="cursor-pointer font-bold text-slate-900 p-5 list-none flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <span className="text-lg pr-4">¿Cómo calcular la puja máxima?</span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-open:bg-brand-100 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-open:text-brand-600 transition-transform group-open:rotate-180"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </summary>
                <div className="p-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                    <p>Calcula restando todos los costes asociados (impuestos, registro, reformas, deudas previas) al valor real de mercado.</p>
                </div>
            </details>
            <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all">
                <summary className="cursor-pointer font-bold text-slate-900 p-5 list-none flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <span className="text-lg pr-4">¿Cuánto dinero necesito?</span>
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-open:bg-brand-100 transition-colors">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-open:text-brand-600 transition-transform group-open:rotate-180"><polyline points="6 9 12 15 18 9"></polyline></svg>
                    </div>
                </summary>
                <div className="p-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                    <p>Como mínimo, necesitas el 5% de consignación del valor de subasta para poder participar en el portal del BOE.</p>
                </div>
            </details>
        </div>
      </section>

      
      <nav className="mt-12 border-t pt-8">
        <Link 
          to={ROUTES.GUIDE_HUB} className="text-brand-700"
        >
          Volver al índice de guías
        </Link>
      </nav>
    </div>
  );
};

export default CalculateBidGuide;
