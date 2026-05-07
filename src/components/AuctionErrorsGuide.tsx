import React, { useEffect, useState } from 'react';
import { GuideTOC } from './GuideTOC';
import { GuideMobileCTA } from './GuideMobileCTA';

import { CheckCircle,  Calendar, Clock, ChevronRight, AlertTriangle, XCircle, ArrowRight, BookOpen, Ban, Search, Calculator, TrendingUp  } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import SaaSCtaBlock from '@/components/SaaSCtaBlock';

const AuctionErrorsGuide: React.FC = () => {
  
  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const schemaDate = currentDate.toISOString();
  
  // State for read time
  const [readTime, setReadTime] = useState(3);

  // IMÁGENES ÚNICAS (No reutilizadas)
  const IMG_HERO = "https://images.unsplash.com/photo-1455849318743-b2233052fcff?auto=format&fit=crop&q=80&w=1200&h=630";
  const IMG_COSTS = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800&h=450";
  const IMG_STRATEGY = "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800&h=450";

  // Schema.org Article Structured Data
  const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
    
    "@type": "Article",
    "headline": "Errores en subastas judiciales que debes evitar",
    "description": "Descubre los errores más comunes en subastas judiciales en España (cargas ocultas, ocupación, regla del 70%) y cómo evitarlos antes de pujar.",
    "author": {
      "@type": "Person",
      "name": "José de la Peña",
      "jobTitle": "Consultor especializado en análisis de subastas públicas",
      "url": "https://activosoffmarket.es/quien-soy"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Activos Off-Market",
      "logo": {
        "@type": "ImageObject",
        "url": "https://activosoffmarket.es/logo.png"
      }
    },
    "datePublished": "2023-11-28T09:00:00+01:00",
    "dateModified": schemaDate,
    "image": [IMG_HERO],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://activosoffmarket.es/errores-subasta-judicial/"
    }
  },
        {
          "@type": "FAQPage",
          "mainEntity": [
                    {
                              "@type": "Question",
                              "name": "¿Qué pasa si me equivoco al pujar?",
                              "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Si ganas la puja y decides no completar el pago (quebrar la subasta), perderás íntegramente el depósito del 5% que consignaste."
                              }
                    },
                    {
                              "@type": "Question",
                              "name": "¿Es recuperable el dinero si hay cargas ocultas?",
                              "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "No. Al participar en la subasta aceptas el estado jurídico del bien. Las cargas anteriores son responsabilidad del adjudicatario."
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
                              "name": "7 Errores en Subastas Judiciales a Evitar",
                              "item": "https://activosoffmarket.es/errores-subasta-judicial/"
                    }
          ]
}
      ]
    };

  useEffect(() => {
    // Read Time Calculation
    const article = document.querySelector('article');
    if (article) {
      const text = article.innerText;
      const words = text.trim().split(/\s+/).length;
      const time = Math.ceil(words / 200);
      setReadTime(Math.max(3, time));
    }

    window.scrollTo(0, 0);
    // SEO Optimization
    document.title = "7 Errores en Subastas Judiciales a Evitar | Activos Off-Market";
    
    const setMeta = (property: string, content: string) => {
        let element = document.querySelector(`meta[property="${property}"]`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute('property', property);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    };

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', "Evita perder dinero en subastas. Los 7 errores más comunes: cargas ocultas, problemas de posesión, falta de liquidez y fallos en el cálculo de costes.");

    setMeta('og:type', 'article');
    setMeta('og:title', '7 Errores en Subastas Judiciales a Evitar');
    setMeta('og:description', 'Guía preventiva: Cargas ocultas, ocupación y errores de cálculo que arruinan la inversión.');
    setMeta('og:image', IMG_HERO);
    setMeta('og:url', 'https://activosoffmarket.es/errores-subasta-judicial/');
    setMeta('og:site_name', 'Activos Off-Market');

    let twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (!twitterCard) {
        twitterCard = document.createElement('meta');
        twitterCard.setAttribute('name', 'twitter:card');
        document.head.appendChild(twitterCard);
    }
    twitterCard.setAttribute('content', 'summary_large_image');

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', "https://activosoffmarket.es/errores-subasta-judicial/");

    // Inject JSON-LD
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
                <Link to={ROUTES.HOME} className="hover:text-brand-600 transition-colors">Inicio</Link>
                <ChevronRight size={14} />
                <Link to={ROUTES.GUIDE_PILLAR} className="hover:text-brand-600 transition-colors">Guía Subastas</Link>
                <ChevronRight size={14} />
                <span className="text-brand-700 bg-brand-50 px-2 py-1 rounded-md" aria-current="page">Errores Frecuentes</span>
            </nav>
            
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-tight">
                Errores que arruinan una subasta judicial <br/><span className="text-brand-700 italic">(y cómo evitarlos)</span>
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
                        alt="Inversor analizando errores en documentación"
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
                    Las subastas judiciales pueden ser oportunidades interesantes, pero también pueden convertirse en errores costosos que atrapan tu capital durante años.
                </p>
                <p>
                    La mayoría de los problemas no se deben al procedimiento judicial en sí, sino a una <strong>mala preparación previa</strong> por parte del inversor. He visto a personas perder decenas de miles de euros por no leer una línea en una Nota Simple.
                </p>
                <p>
                    Estos son los <strong>7 errores capitales</strong> que cometen los inversores novatos (y algunos expertos) al participar en una subasta en España.
                </p>

                {/* ERROR 1 */}
                <div className="my-12 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden not-prose">
                    <div className="bg-red-50 p-4 border-b border-red-100 flex items-center gap-3">
                        <XCircle className="text-red-600" size={24} />
                        
            {/* RESUMEN RÁPIDO */}
            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 md:p-8 mb-12 shadow-sm not-prose">
                <h3 className="text-brand-900 font-bold mb-4 flex items-center gap-2">
                    <CheckCircle size={20} className="text-brand-600" /> Resumen Rápido (TL;DR)
                </h3>
                <ul className="space-y-3">
                    <li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">No estudiar las cargas.</p>
                    </li><li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Pujar por un bien sin visitarlo por fuera.</p>
                    </li><li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Calcular mal los impuestos de la operación.</p>
                    </li>
                </ul>
            </div>
            
            <GuideTOC />
            
        
<h2 className="text-red-900 font-bold text-lg m-0">Error 1: Pujar solo porque parece barato</h2>
                    </div>
                    <div className="p-6">
                        <div className="mb-4">
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Consecuencia</span>
                            <p className="text-slate-700 m-0">El precio de salida o la valoración en el BOE pueden ser irrelevantes si el activo tiene cargas ocultas o problemas graves de posesión.</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl flex items-start gap-3">
                            <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                            <div>
                                <span className="block text-sm font-bold text-green-800 mb-1">Cómo evitarlo</span>
                                <p className="text-sm text-green-700 m-0 leading-relaxed">
                                    Nunca confíes en la valoración del edicto. Realiza tu propia valoración de mercado y descuenta todos los costes de regularización.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ERROR 2 */}
                <div className="my-12 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden not-prose">
                    <div className="bg-red-50 p-4 border-b border-red-100 flex items-center gap-3">
                        <XCircle className="text-red-600" size={24} />
                        <h2 className="text-red-900 font-bold text-lg m-0">Error 2: No revisar el orden de cargas</h2>
                    </div>
                    <div className="p-6">
                        <div className="mb-4">
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Consecuencia</span>
                            <p className="text-slate-700 m-0">Puedes adjudicarte un inmueble y descubrir después que heredas una hipoteca anterior de 100.000€.</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl flex items-start gap-3">
                            <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                            <div>
                                <span className="block text-sm font-bold text-green-800 mb-1">Cómo evitarlo</span>
                                <p className="text-sm text-green-700 m-0 leading-relaxed">
                                    Estudia la prioridad registral. Lee nuestra guía sobre <Link to={ROUTES.CHARGES} className="underline decoration-2 font-bold hover:text-green-900">Cargas que se cancelan vs Cargas que subsisten</Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ERROR 3 */}
                <div className="my-12 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden not-prose">
                    <div className="bg-red-50 p-4 border-b border-red-100 flex items-center gap-3">
                        <XCircle className="text-red-600" size={24} />
                        
<GuideMobileCTA />
<h2 className="text-red-900 font-bold text-lg m-0">Error 3: Ignorar si está ocupada</h2>
                    </div>
                    <div className="p-6">
                        <div className="mb-4">
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Consecuencia</span>
                            <p className="text-slate-700 m-0">Te enfrentas a 6-18 meses de procedimiento judicial para recuperar la posesión, sin poder vender ni alquilar.</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl flex items-start gap-3">
                            <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                            <div>
                                <span className="block text-sm font-bold text-green-800 mb-1">Cómo evitarlo</span>
                                <p className="text-sm text-green-700 m-0 leading-relaxed">
                                    Investiga indicios en el edicto y notificaciones. Revisa nuestra guía sobre <Link to={ROUTES.OCCUPIED} className="underline decoration-2 font-bold hover:text-green-900">Vivienda Ocupada en Subastas</Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <figure className="my-14">
                    <img 
                        src={IMG_COSTS} 
                        alt="Cálculo de costes ocultos" 
                        width="800"
                        height="450"
                        loading="lazy"
                        className="w-full h-auto object-cover rounded-2xl shadow-lg border border-slate-100" 
                    />
                </figure>

                {/* ERROR 4 */}
                <div className="my-12 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden not-prose">
                    <div className="bg-red-50 p-4 border-b border-red-100 flex items-center gap-3">
                        <XCircle className="text-red-600" size={24} />
                        <h2 className="text-red-900 font-bold text-lg m-0">Error 4: Calcular mal los costes reales</h2>
                    </div>
                    <div className="p-6">
                        <div className="mb-4">
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Consecuencia</span>
                            <p className="text-slate-700 m-0">El margen de beneficio desaparece al sumar impuestos y gastos imprevistos.</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl flex items-start gap-3">
                            <Calculator className="text-green-600 flex-shrink-0 mt-1" size={18} />
                            <div>
                                <span className="block text-sm font-bold text-green-800 mb-1">Suma siempre:</span>
                                <ul className="text-sm text-green-700 m-0 list-disc pl-4 space-y-1">
                                    <li>ITP (6% - 10% según CCAA).</li>
                                    <li>Deudas de Comunidad (hasta 4 años).</li>
                                    <li>IBI (hasta 4 años).</li>
                                    <li>Costes legales y de reforma.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ERROR 5 */}
                <div className="my-12 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden not-prose">
                    <div className="bg-red-50 p-4 border-b border-red-100 flex items-center gap-3">
                        <XCircle className="text-red-600" size={24} />
                        <h2 className="text-red-900 font-bold text-lg m-0">Error 5: No tener liquidez suficiente</h2>
                    </div>
                    <div className="p-6">
                        <div className="mb-4">
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Consecuencia</span>
                            <p className="text-slate-700 m-0">
                                Si ganas la subasta y no puedes pagar el resto del precio en 40 días (judicial) o 20 días (administrativa), <strong>pierdes el depósito</strong>.
                            </p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl flex items-start gap-3">
                            <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                            <div>
                                <span className="block text-sm font-bold text-green-800 mb-1">Cómo evitarlo</span>
                                <p className="text-sm text-green-700 m-0 leading-relaxed">
                                    No cuentes con hipotecas tradicionales. Ten el capital o financiación puente lista. Más info en: <Link to={ROUTES.DEPOSIT} className="underline decoration-2 font-bold hover:text-green-900">Riesgos del Depósito</Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ERROR 6 */}
                <div className="my-12 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden not-prose">
                    <div className="bg-red-50 p-4 border-b border-red-100 flex items-center gap-3">
                        <XCircle className="text-red-600" size={24} />
                        <h2 className="text-red-900 font-bold text-lg m-0">Error 6: Creer que la regla del 70% garantiza todo</h2>
                    </div>
                    <div className="p-6">
                        <div className="mb-4">
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Consecuencia</span>
                            <p className="text-slate-700 m-0">Pujar bajo (&lt; 70%) deja la puerta abierta a que el deudor o el acreedor mejoren tu postura y te quedes sin el bien.</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl flex items-start gap-3">
                            <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={18} />
                            <div>
                                <span className="block text-sm font-bold text-green-800 mb-1">Cómo evitarlo</span>
                                <p className="text-sm text-green-700 m-0 leading-relaxed">
                                    Entiende los tramos de adjudicación. Lee nuestra guía sobre la <Link to={ROUTES.RULE_70} className="underline decoration-2 font-bold hover:text-green-900">Regla del 70%</Link>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <figure className="my-14">
                    <img 
                        src={IMG_STRATEGY} 
                        alt="Planificación de estrategia de salida" 
                        width="800"
                        height="450"
                        loading="lazy"
                        className="w-full h-auto object-cover rounded-2xl shadow-lg border border-slate-100" 
                    />
                </figure>

                {/* ERROR 7 */}
                <div className="my-12 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden not-prose">
                    <div className="bg-red-50 p-4 border-b border-red-100 flex items-center gap-3">
                        <XCircle className="text-red-600" size={24} />
                        <h2 className="text-red-900 font-bold text-lg m-0">Error 7: No tener estrategia de salida</h2>
                    </div>
                    <div className="p-6">
                        <div className="mb-4">
                            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Consecuencia</span>
                            <p className="text-slate-700 m-0">Compras un activo ilíquido y tu dinero queda atrapado sin rentabilidad.</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl flex items-start gap-3">
                            <TrendingUp className="text-green-600 flex-shrink-0 mt-1" size={18} />
                            <div>
                                <span className="block text-sm font-bold text-green-800 mb-1">Define antes de pujar:</span>
                                <ul className="text-sm text-green-700 m-0 list-disc pl-4 space-y-1">
                                    <li>¿Es para reforma y venta (flip)?</li>
                                    <li>¿Alquiler tradicional o turístico?</li>
                                    <li>¿Tienes margen si el mercado baja un 10%?</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <h2 className="text-3xl mt-12 mb-6">Conclusión</h2>
                <p>
                    Las subastas no son un casino. Son un mercado técnico donde gana quien tiene mejor información. Si evitas estos 7 errores, ya estás por delante del 90% de los participantes.
                </p>

                
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

                
          
          {/* FAQ SECTON AUTOGENERADA */}
          <section className="not-prose bg-slate-50 p-8 md:p-10 rounded-3xl border border-slate-200 mt-16 mb-8">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-8">Preguntas Frecuentes de Inversión y Riesgos (FAQ)</h2>
              <div className="space-y-4">
                  
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all shadow-sm">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          <span className="text-lg pr-4">¿Cuál es el error con mayor coste financiero de los principiantes en subastas?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-justify">
                          Sobrepasar su capital por obviar las cargas registrales ocultas, especialmente las deudas en administraciones públicas limitadas (AEAT/Tesorería) preferentes y las ejecuciones sobre bienes libres no verificables, y por carecer del crédito puente necesario provocando la quiebra de la subasta y la consiguiente pérdida del capital depositado.
                      </div>
                  </details>
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all shadow-sm">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          <span className="text-lg pr-4">¿Qué riesgos físicos tiene no peritar o examinar la finca registral al detalle?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-justify">
                          Se observan discrepancias asiduamente: adquirir una referencia catastral errónea (terrenos rústicos catalogados urbanos temporalmente, trasteros descritos erróneamente en el edicto como viviendas), incurrir en fallas de segregación parcelaria e inmersión en demoliciones de ruina inminente del Ayuntamiento.
                      </div>
                  </details>
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all shadow-sm">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          <span className="text-lg pr-4">¿Por qué fijar rentabilidades teóricas de compra es una negligencia como inversor?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-justify">
                          En el 'flipping' o compraventa inmobiliaria, fiarse de las estimaciones medias de los portales tipo Idealista sin descontar ITP (hasta 10%), riesgos ocultos comunitarios o de suministros destrozados, es destructivo para la TIR real. La inversión exige simulaciones financieras conservadoras para blindar beneficios.
                      </div>
                  </details>
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all shadow-sm">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          <span className="text-lg pr-4">¿Son subsanables los errores procesales que cometo per se ante el LAJ?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-justify">
                          Raramente. Los errores de clic al pujar con el certificado digital tienen valor de firma de Estado e impacto legal instantáneo irrepetible. Apelar o impugnar en estos eventos procesales suele ser considerado por la sala inadmisible frente al perjuicio temerario a la ejecución de la sentencia y los derechos del ejecutante.
                      </div>
                  </details>
              </div>
          </section>
      
      
                
                <SaaSCtaBlock />
            </article>
        </main>

        {/* SIDEBAR */}
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
                    <Link to={ROUTES.COMO_COMPRAR} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Cómo comprar paso a paso</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to={ROUTES.GUIDE_PILLAR} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Guía General Subastas</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to={ROUTES.CHARGES} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Cargas y Deudas</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to={ROUTES.OCCUPIED} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Vivienda Ocupada</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to={ROUTES.ANALYSIS} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Análisis Paso a Paso</span>
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

export default AuctionErrorsGuide;