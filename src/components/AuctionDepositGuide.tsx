import React, { useEffect, useState } from 'react';
import { GuideTOC } from './GuideTOC';
import { GuideMobileCTA } from './GuideMobileCTA';

import { CheckCircle,  Calendar, Clock, ChevronRight, Coins, AlertTriangle, ArrowRight, BookOpen, Wallet, Ban, Info, Landmark  } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const AuctionDepositGuide: React.FC = () => {
  
  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const schemaDate = currentDate.toISOString();
  
  // State for read time
  const [readTime, setReadTime] = useState(3);

  // Images Updated
  const IMG_HERO = "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=1200&h=630"; 
  const IMG_PORTAL = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800&h=450";
  const IMG_RISK = "https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?auto=format&fit=crop&q=80&w=800&h=450";

  useEffect(() => {
    // Read Time Calculation
    const article = document.querySelector('article');
    if (article) {
      const text = article.innerText;
      const words = text.trim().split(/\s+/).length;
      const time = Math.ceil(words / 200);
      setReadTime(Math.max(3, time));
    }

    // SEO Optimization
    document.title = "Depósito 5% en Subastas Judiciales BOE | Guía Completa 2025";
    
    // Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', "Aprende cómo funcionan el depósito del 5% en subastas judiciales del BOE, plazos, riesgos y qué ocurre si no ganas la puja.");

    // Open Graph Tags
    const setMeta = (property: string, content: string) => {
        let element = document.querySelector(`meta[property="${property}"]`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute('property', property);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    };

    setMeta('og:title', "Depósito 5% en Subastas Judiciales BOE | Guía Completa 2025");
    setMeta('og:description', "Aprende cómo funcionan el depósito del 5% en subastas judiciales del BOE, plazos, riesgos y qué ocurre si no ganas la puja.");
    setMeta('og:type', "article");
    setMeta('og:url', "https://activosoffmarket.es/deposito-subasta-judicial-5-por-ciento/");
    setMeta('og:image', IMG_HERO);

    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
      
      "@type": "Article",
      "headline": "Depósito 5% en Subastas Judiciales BOE | Guía Completa 2025",
      "description": "Aprende cómo funcionan el depósito del 5% en subastas judiciales del BOE, plazos, riesgos y qué ocurre si no ganas la puja.",
      "image": [IMG_HERO],
      "datePublished": "2024-01-15T09:00:00+01:00",
      "dateModified": schemaDate,
      "author": {
        "@type": "Person",
        "name": "José de la Peña",
        "url": "https://activosoffmarket.es/quien-soy"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://activosoffmarket.es/deposito-subasta-judicial-5-por-ciento/"
      }
    },
        {
          "@type": "FAQPage",
          "mainEntity": [
                    {
                              "@type": "Question",
                              "name": "¿Puedo recuperar el depósito si me arrepiento?",
                              "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "No. Una vez realizada la puja, es vinculante. Si eres el máximo postor y te echas atrás, pierdes el dinero."
                              }
                    },
                    {
                              "@type": "Question",
                              "name": "¿El depósito se descuenta del precio final?",
                              "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Sí. Si ganas por 100.000 € y ya pusiste 5.000 € de depósito, solo tendrás que ingresar 95.000 €."
                              }
                    }
          ]
},
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
                    {
                              "@type": "ListItem",
                              "position": 1,
                              "name": "Inicio",
                              "item": "https://activosoffmarket.es/"
                    },
                    {
                              "@type": "ListItem",
                              "position": 2,
                              "name": "Guías sobre Subastas",
                              "item": "https://activosoffmarket.es/guia-subastas-judiciales-boe/"
                    },
                    {
                              "@type": "ListItem",
                              "position": 3,
                              "name": "Depósito 5% en Subastas Judiciales BOE",
                              "item": "https://activosoffmarket.es/deposito-subasta-judicial-5-por-ciento/"
                    }
          ]
}
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };

  }, [schemaDate]);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-600 selection:bg-brand-100 selection:text-brand-900">
      
      <header className="bg-white pb-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
            <nav className="flex items-center text-sm text-slate-500 mb-8 font-medium flex-wrap gap-2" aria-label="Breadcrumb">
                <Link to="/" className="hover:text-brand-600 transition-colors">Inicio</Link>
                <ChevronRight size={14} />
                <Link to="/subastas-judiciales-espana" className="hover:text-brand-600 transition-colors">Guía Subastas</Link>
                <ChevronRight size={14} />
                <span className="text-brand-700 bg-brand-50 px-2 py-1 rounded-md" aria-current="page">Depósito 5%</span>
            </nav>
            
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-tight">
                Depósito del 5% en Subastas Judiciales (BOE): <br/><span className="text-brand-700 italic">Cómo Funciona y Qué Debes Saber</span>
            </h1>\n
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-8 bg-slate-50 inline-flex px-4 py-2 rounded-full border border-slate-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Basado en el análisis de edictos BOE y certificaciones del Registro de la Propiedad
            </div>

            <div className="flex flex-wrap items-center gap-6 text-slate-500 text-sm border-t border-slate-100 pt-6">
                <div className="flex items-center gap-3">
                    <img 
                      src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iIzI5M2Y1NiIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9Ikdlb3JnaWEsIHNlcmlmIiBmb250LXNpemU9IjYwIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zNWVtIj5KPC90ZXh0Pjwvc3ZnPg==" 
                      alt="José de la Peña" 
                      className="w-10 h-10 rounded-full object-cover border border-slate-200" 
                    />
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-900 leading-none">José de la Peña</span>
                        <span className="text-xs text-brand-600 mt-1 font-semibold uppercase">Jurista</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                    <Calendar size={14} />
                    <span className="capitalize">{currentMonthYear}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                    <Clock size={14} />
                    <span>{readTime} min lectura</span>
                </div>
            </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        <main className="lg:col-span-8">
            <article className="prose prose-lg prose-slate prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900 prose-p:leading-loose text-left max-w-5xl space-y-6 leading-relaxed prose-p:max-w-3xl prose-headings:max-w-3xl prose-li:max-w-3xl">
                
                <figure className="mb-12 -mt-6">
                    <img 
                        src={IMG_HERO} 
                        alt="Depósito bancario y ahorro para subastas"
                        width="1200"
                        height="630"
                        loading="eager"
                        // @ts-ignore
                        fetchpriority="high"
                        className="w-full h-auto object-cover rounded-3xl shadow-xl border border-slate-200 bg-slate-100"
                    />
                </figure>

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


                <p className="text-xl text-slate-700 leading-relaxed font-light mb-10 first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-brand-700 first-letter:mr-3 first-letter:float-left">
                    Para participar en cualquier <Link to="/subastas-judiciales-espana" className="text-brand-700 underline decoration-1 underline-offset-2 hover:text-brand-900">procedimiento de ejecución en España</Link>, el primer requisito ineludible es consignar un depósito. Sin este paso previo, no tendrás acceso a la sala de pujas del BOE.
                </p>
                <p>
                    Muchos inversores novatos temen perder este dinero si no ganan la subasta. En esta guía te explico exactamente cómo funciona, los plazos reales de devolución y, lo más importante, <strong>cuándo existe riesgo real de perderlo</strong>.
                </p>

                
            {/* RESUMEN RÁPIDO */}
            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 md:p-8 mb-12 shadow-sm not-prose">
                <h3 className="text-brand-900 font-bold mb-4 flex items-center gap-2">
                    <CheckCircle size={20} className="text-brand-600" /> Resumen Rápido (TL;DR)
                </h3>
                <ul className="space-y-3">
                    <li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">El 5% de depósito es obligatorio.</p>
                    </li><li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Si no ganas, se te devuelve íntegramente.</p>
                    </li><li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Si ganas y no pagas el resto, lo pierdes.</p>
                    </li>
                </ul>
            </div>
            
            <GuideTOC />
            
        
<h2 className="text-3xl mt-12 mb-6">¿Qué es el depósito del 5% en una subasta judicial?</h2>
                <p>
                    Es una garantía económica obligatoria que demuestra tu seriedad como postor. Su cuantía está fijada por ley (Ley de Enjuiciamiento Civil) en el <strong>5% del Valor de Tasación</strong> del bien a subastar.
                </p>
                
                <div className="bg-brand-50 p-6 rounded-xl border border-brand-100 my-8 not-prose flex gap-4 items-start">
                    <Info className="text-brand-600 flex-shrink-0 mt-1" size={24} />
                    <div>
                        <h3 className="font-bold text-brand-900 mb-1">Dato Clave</h3>
                        <p className="text-brand-800 m-0 text-sm leading-relaxed">
                            No confundas el Valor de Tasación con la Deuda Reclamada ni con el Valor de Mercado. El 5% se calcula siempre sobre la tasación que figura en el edicto (que a menudo es un valor antiguo y elevado).
                        </p>
                    </div>
                </div>

                <h2 className="text-3xl mt-12 mb-6">Cómo se realiza el depósito en el portal del BOE</h2>
                <p>
                    El proceso es 100% telemático a través del <strong>Portal de Subastas del BOE</strong>. No se puede ir al juzgado con un cheque.
                </p>
                <ol className="list-decimal pl-6 space-y-4 my-6">
                    <li><strong>Registro:</strong> Debes estar registrado en el Portal con tu certificado digital o Cl@ve.</li>
                    <li><strong>Selección:</strong> Entras en la subasta activa y pulsas "Constituir Depósito".</li>
                    <li><strong>Pago:</strong> El sistema te redirige a la pasarela de pagos de la AEAT. Necesitarás una cuenta bancaria a tu nombre en una entidad colaboradora (casi todos los bancos españoles lo son).</li>
                    <li><strong>NRC:</strong> El banco genera un código NRC (Número de Referencia Completo) que acredita el pago. El portal lo valida y te habilita para pujar.</li>
                </ol>

                
<GuideMobileCTA />
<h2 className="text-3xl mt-12 mb-6">Qué ocurre si no ganas la subasta</h2>
                <p>
                    Si la subasta finaliza y tu postura no ha sido la ganadora, el sistema del BOE ordena la <strong>devolución automática</strong> del depósito a la misma cuenta IBAN de origen.
                </p>
                <p>
                    <strong>Plazos reales:</strong> Aunque debería ser inmediato, suele tardar entre 24 y 48 horas hábiles en reflejarse en tu cuenta. Es un proceso seguro.
                </p>
                
                <div className="bg-white border border-slate-200 p-6 rounded-xl my-8 not-prose shadow-sm">
                    <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <CheckCircle size={20} className="text-green-600" /> Excepción: Reserva de Postura
                    </h3>
                    <p className="text-slate-600 text-sm m-0">
                        Si al pujar marcaste la casilla <em>"Reservar postura en caso de que el ganador falle"</em>, tu dinero quedará retenido hasta que el ganador complete el pago (puede tardar meses). Solo marca esta casilla si realmente te interesa quedar en lista de espera.
                    </p>
                </div>

                <h2 className="text-3xl mt-12 mb-6 text-red-700">Qué pasa si ganas y no pagas el resto</h2>
                <p>
                    Este es el mayor riesgo financiero. Si resultas adjudicatario (ganador), tienes un plazo (generalmente 40 días hábiles en subastas judiciales) para ingresar el resto del precio ofrecido.
                </p>
                <p>
                    Si no consigues el dinero a tiempo, se produce la llamada <strong>"quiebra de la subasta"</strong>.
                </p>

                <div className="bg-red-50 border-l-4 border-red-600 p-8 rounded-r-xl my-8 not-prose shadow-sm">
                    <h3 className="text-red-900 font-bold text-xl mb-4 flex items-center gap-2"><Ban size={24}/> Consecuencias de la quiebra</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 not-prose">

                <div className="bg-white border text-left border-slate-200 p-6 rounded-2xl shadow-sm hover:border-brand-200 hover:shadow-md transition-all flex flex-col">
                    <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center pr-2 gap-2 text-balance leading-snug"><div className="w-2 h-2 rounded-full bg-brand-500 shrink-0"></div> Pierdes el 100% del depósito consignado.</h3>
                    <p className="text-slate-600 text-sm leading-relaxed"></p>
                </div>
</div>
                </div>
                
                <p>
                    Por eso es vital entender la <Link to="/regla-70-subasta-judicial" className="text-brand-700 underline decoration-1 underline-offset-2 hover:text-brand-900">normativa de precios de adjudicación (Art. 670 LEC)</Link>. Si tu puja es alta y ganas, debes tener la liquidez lista. No confíes en que un banco tradicional te conceda una hipoteca en ese plazo tan corto.
                </p>

                <h2 className="text-3xl mt-12 mb-6">Errores frecuentes con el depósito del 5%</h2>
                <p>
                    Muchos inversores pierden oportunidades o dinero por no planificar esta fase.
                </p>

                <div className="space-y-6 my-8 not-prose">
                    <div className="flex gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <div className="bg-slate-100 p-2 h-fit rounded-lg text-slate-700 font-bold">1</div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">No tener liquidez inmediata</h3>
                            <p className="text-slate-600 text-sm mt-1">El dinero del depósito debe estar líquido en cuenta. No valen fondos de inversión ni plazos fijos.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <div className="bg-slate-100 p-2 h-fit rounded-lg text-slate-700 font-bold">2</div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">Calcular costes incompletos</h3>
                            <p className="text-slate-600 text-sm mt-1">
                                Si gastas todo tu capital en el depósito y la puja, ¿con qué pagarás el ITP (6-10%) y las reformas? Revisa nuestra guía para <Link to="/como-analizar-subasta-judicial-paso-a-paso" className="text-brand-700 font-bold hover:underline">auditar la viabilidad económica de la subasta</Link>.
                            </p>
                        </div>
                    </div>
                </div>

                
                {/* MICRO-BLOQUES: INVERSOR VS PRIMERA VIVIENDA */}
                <div className="grid md:grid-cols-2 gap-6 my-16 not-prose">
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl hover:border-slate-300 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                            </div>
                <div className="mt-8 not-prose">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/analizar-subasta" className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-700 transition-colors shadow-sm w-full sm:w-auto">
                            Analizar subasta en curso <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                        </Link>
                        <Link to="/pro" className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 font-bold py-3 px-8 rounded-xl hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm w-full sm:w-auto">
                            Ver Planes Pro
                        </Link>
                    </div>
                </div>
                            <h4 className="font-bold text-slate-900 text-lg">Visión Inversor (Flipping)</h4>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed m-0 text-left">
                            Busca rentabilidad a corto plazo (TIR). El objetivo central es adjudicarse la propiedad con un descuento superior al 30%, purgar las cargas ágilmente, realizar una adecuación estética ('Home Staging') y vender antes de 6 meses para maximizar el retorno del capital invertido.
                        </p>
                    </div>
                    <div className="bg-brand-50 border border-brand-200 p-6 rounded-2xl hover:border-brand-300 transition-colors">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                            </div>
                            <h4 className="font-bold text-brand-900 text-lg">Visión Primera Vivienda</h4>
                        </div>
                        <p className="text-brand-800 text-sm leading-relaxed m-0 text-left">
                            Busca adquirir por debajo de mercado para residir. Prima la calidad estructural, vecindario y ubicación sobre la agresividad del descuento. Es vital contar con financiación puente o ahorros previos, ya que la hipoteca tradicional rara vez aprueba este tipo de compras en los ajustados plazos legales.
                        </p>
                    </div>
                </div>

<hr className="my-16 border-slate-200" />

                <section className="not-prose bg-slate-50 p-10 rounded-3xl border border-slate-200">
                    <h2 className="font-serif text-2xl font-bold text-slate-900 mb-8">Preguntas Frecuentes</h2>
                    <div className="space-y-8">
                        
                    <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all">
                        <summary className="cursor-pointer font-bold text-slate-900 p-5 list-none flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <span className="text-lg pr-4">¿Puedo recuperar el depósito si me arrepiento?</span>
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-open:bg-brand-100 transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-open:text-brand-600 transition-transform group-open:rotate-180"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                        </summary>
                        <div className="p-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                            <p>No. Una vez realizada la puja, es vinculante. Si eres el máximo postor y te echas atrás, pierdes el dinero.</p>
                        </div>
                    </details>
                        
                    <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all">
                        <summary className="cursor-pointer font-bold text-slate-900 p-5 list-none flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <span className="text-lg pr-4">¿El depósito se descuenta del precio final?</span>
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-open:bg-brand-100 transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-open:text-brand-600 transition-transform group-open:rotate-180"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                        </summary>
                        <div className="p-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                            <p>Sí. Si ganas por 100.000 € y ya pusiste 5.000 € de depósito, solo tendrás que ingresar 95.000 €.</p>
                        </div>
                    </details>
                    </div>
                </section>
                
            </article>
        </main>

        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-10 max-h-[calc(100vh-120px)] overflow-auto pr-2 custom-scrollbar">
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl border border-slate-800">
                <span className="text-brand-300 text-xs font-bold uppercase tracking-widest mb-4 block">Herramientas Pro</span>
                <h3 className="font-serif text-2xl font-bold mb-4">Analiza sin Riesgo</h3>
                <p className="text-slate-300 mb-8 text-sm leading-relaxed">
                    ¿Dudas con una puja? Nuestro algoritmo analiza cargas, ITP y valor real en segundos. Evita sorpresas y puja con seguridad matemática.
                </p>
                <Link 
                    to={ROUTES.PRO}
                    className="block w-full bg-brand-500 text-white font-bold py-4 px-4 rounded-xl text-center hover:bg-brand-600 transition-all flex items-center justify-center gap-2"
                >
                    Ver Planes y Precios <ArrowRight size={16}/>
                </Link>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
                <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <BookOpen size={18} className="text-brand-600"/>
                    Guías Relacionadas
                </h4>
                <nav className="space-y-4">
                    <Link to="/subastas-judiciales-espana" className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Guía General Subastas</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to="/como-analizar-subasta-judicial-paso-a-paso" className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Análisis Paso a Paso</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to="/regla-70-subasta-judicial" className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Regla del 70%</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                     <Link to="/cargas-subasta-judicial" className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Cargas y Deudas</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to="/subasta-judicial-vs-aeat-diferencias" className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Judicial vs AEAT</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                </nav>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default AuctionDepositGuide;