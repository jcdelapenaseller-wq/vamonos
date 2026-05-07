import React, { useEffect, useState } from 'react';
import { GuideTOC } from './GuideTOC';
import { GuideMobileCTA } from './GuideMobileCTA';

import { CheckCircle,  Calendar, Clock, ChevronRight, Percent, Gavel, ArrowRight, BookOpen, AlertTriangle, Calculator, Info, XCircle  } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import SaaSCtaBlock from '@/components/SaaSCtaBlock';

const Auction70RuleGuide: React.FC = () => {
  
  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const schemaDate = currentDate.toISOString();
  
  // State for read time
  const [readTime, setReadTime] = useState(3);

  // Images Updated
  const IMG_HERO = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200&h=630";

  // Schema.org Article Structured Data
  const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
    
    "@type": "Article",
    "headline": "Regla del 70% en Subastas Judiciales: Cómo Calcular el Precio Máximo Seguro",
    "description": "Descubre cómo aplicar la regla del 70% en subastas judiciales del BOE y calcular el precio máximo seguro antes de pujar.",
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
    "datePublished": "2023-11-22T09:00:00+01:00",
    "dateModified": schemaDate,
    "image": [IMG_HERO],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://activosoffmarket.es/regla-70-subasta-judicial/"
    }
  },
        {
          "@type": "FAQPage",
          "mainEntity": [
                    {
                              "@type": "Question",
                              "name": "¿El 70% es sobre valor de mercado?",
                              "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "No. Es sobre el Valor de Tasación a efectos de subasta que figura en el edicto (puede ser un valor del año 2007, muy inflado)."
                              }
                    },
                    {
                              "@type": "Question",
                              "name": "¿Cuánto tarda en aprobarse si no llego al 70%?",
                              "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Depende de la carga de trabajo del juzgado. El deudor tiene 10 días hábiles, el acreedor otros 5, pero la resolución final del decreto puede tardar de 1 a 3 meses."
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
                              "name": "Regla del 70% en Subastas Judiciales (BOE)",
                              "item": "https://activosoffmarket.es/regla-70-subasta-judicial/"
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

    // SEO Optimization
    document.title = "Regla del 70% en Subastas Judiciales (BOE) | Guía Práctica 2025";
    
    // Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', "Descubre cómo aplicar la regla del 70% en subastas judiciales del BOE y calcular el precio máximo seguro antes de pujar.");

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

    setMeta('og:title', "Regla del 70% en Subastas Judiciales (BOE) | Guía Práctica 2025");
    setMeta('og:description', "Descubre cómo aplicar la regla del 70% en subastas judiciales del BOE y calcular el precio máximo seguro antes de pujar.");
    setMeta('og:type', "article");
    setMeta('og:url', "https://activosoffmarket.es/regla-70-subasta-judicial/");
    setMeta('og:image', IMG_HERO);

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
                <span className="text-brand-700 bg-brand-50 px-2 py-1 rounded-md" aria-current="page">Regla del 70%</span>
            </nav>
            
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-tight">
                Regla del 70% en Subastas Judiciales: <br/><span className="text-brand-700 italic">Cómo Calcular el Precio Máximo Seguro</span>
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
                        alt="Cálculo financiero de la regla del 70% en subastas BOE"
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
                    La <strong>regla del 70%</strong> es el concepto jurídico más importante que debes dominar antes de participar en cualquier <Link to={ROUTES.GUIDE_PILLAR} className="text-brand-700 underline decoration-1 underline-offset-2 hover:text-brand-900">licitación pública del BOE</Link>. No es solo un porcentaje; es el umbral que define si tu adjudicación será firme, provisional o si perderás la oportunidad frente al banco o el deudor.
                </p>

                <div className="bg-brand-50 p-6 border-l-4 border-brand-600 rounded-r-xl shadow-sm my-10 not-prose flex items-start gap-4">
                    <Info size={24} className="text-brand-600 flex-shrink-0 mt-1" />
                    <div>
                        <h3 className="font-bold text-brand-900 text-lg mb-1">Aclaración Importante</h3>
                        <p className="text-brand-800 text-sm leading-relaxed m-0">
                            Este artículo analiza exclusivamente las subastas regidas por la <strong>Ley de Enjuiciamiento Civil (LEC)</strong>, que son las más comunes en el portal del BOE. Las subastas de la Seguridad Social o AEAT tienen normativas diferentes.
                        </p>
                    </div>
                </div>

                <div className="my-8 p-6 bg-brand-50 border border-brand-100 rounded-2xl">
                    <p className="text-brand-900 font-medium m-0">Puedes calcular rápidamente la rentabilidad usando esta <Link to={ROUTES.CALCULATOR} className="text-brand-700 underline font-bold hover:text-brand-900">calculadora de subastas judiciales</Link>.</p>
                </div>

                
            {/* RESUMEN RÁPIDO */}
            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 md:p-8 mb-12 shadow-sm not-prose">
                <h3 className="text-brand-900 font-bold mb-4 flex items-center gap-2">
                    <CheckCircle size={20} className="text-brand-600" /> Resumen Rápido (TL;DR)
                </h3>
                <ul className="space-y-3">
                    <li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">La norma clave para evitar que el deudor mejore postura.</p>
                    </li><li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Se aprueba automáticamente si tu puja llega al 70%.</p>
                    </li><li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Si no, el juzgado decide si el precio es suficiente.</p>
                    </li>
                </ul>
            </div>
            
            <GuideTOC />
            
        
<h2 className="text-3xl mt-12 mb-6">¿Qué es la regla del 70%?</h2>
                <p>
                    La regla del 70% hace referencia al porcentaje mínimo del <strong>Valor de Tasación</strong> (fijado en la escritura de hipoteca o por perito judicial) que debe cubrir la mejor postura para que la adjudicación sea automática y firme en el acto.
                </p>
                <p>
                    Está regulada en el <strong>Artículo 670 de la Ley de Enjuiciamiento Civil (LEC)</strong>. Entender este artículo es vital porque determina si te llevas la casa o si entras en un limbo jurídico de 10 a 40 días donde pueden quitarte la adjudicación.
                </p>

                <h2 className="text-3xl mt-12 mb-6">Cómo se aplica en subastas judiciales del BOE</h2>
                <p>
                    Cuando finaliza la subasta (generalmente a las 18:00h del día 20), pueden darse tres escenarios según la cuantía de la puja ganadora respecto al tipo de subasta (valor de tasación):
                </p>

                <div className="space-y-6 my-8 not-prose">
                    <div className="flex gap-4 p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <div className="bg-green-100 p-2 h-fit rounded-lg text-green-700 font-bold">1</div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">Puja ≥ 70%</h3>
                            <p className="text-slate-600 text-sm mt-1">
                                <strong>Adjudicación firme.</strong> El Letrado de la Administración de Justicia (LAJ) aprueba el remate a tu favor. Nadie puede mejorar tu oferta a posteriori.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <div className="bg-amber-100 p-2 h-fit rounded-lg text-amber-700 font-bold">2</div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">Puja &lt; 70%</h3>
                            <p className="text-slate-600 text-sm mt-1">
                                <strong>Adjudicación provisional.</strong> Se abre un plazo de 10 días hábiles donde el deudor puede presentar a un tercero que mejore tu postura. Si no lo hace, el acreedor (banco) puede pedir la adjudicación.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <div className="bg-red-100 p-2 h-fit rounded-lg text-red-700 font-bold">3</div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">Puja &lt; 50%</h3>
                            <p className="text-slate-600 text-sm mt-1">
                                <strong>Riesgo de subasta desierta.</strong> Si la mejor postura es inferior al 50% y no cubre la deuda reclamada, el juez tiene la potestad de NO aprobar el remate si considera que el precio es irrisorio.
                            </p>
                        </div>
                    </div>
                </div>

                
<GuideMobileCTA />
<h2 className="text-3xl mt-12 mb-6">Ejemplo práctico paso a paso</h2>
                <p>
                    Imaginemos un piso en Madrid que sale a subasta. Para calcular tu estrategia, necesitas dos datos del edicto: el <strong>Valor de Tasación</strong> y la <strong>Deuda Reclamada</strong>.
                </p>

                <div className="bg-slate-900 text-white p-8 rounded-3xl my-8 not-prose shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600 rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm border-b border-slate-700 pb-4">
                        <div>
                            <span className="block text-slate-400 font-bold uppercase">Valor Tasación (BOE)</span>
                            <span className="block text-2xl font-bold">200.000 €</span>
                        </div>
                        <div>
                            <span className="block text-slate-400 font-bold uppercase">Deuda Reclamada</span>
                            <span className="block text-2xl font-bold text-red-400">110.000 €</span>
                        </div>
                    </div>

                    <h3 className="font-serif font-bold text-xl mb-4 text-brand-200">Escenarios de tu puja:</h3>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
                            <div>
                                <span className="block text-green-400 font-bold">TÚ PUJAS: 140.001 € (70% + 1€)</span>
                                <span className="text-xs text-slate-400">Resultado:</span>
                            </div>
                            <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">GANAS SEGURO</span>
                        </div>

                        <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
                            <div>
                                <span className="block text-amber-400 font-bold">TÚ PUJAS: 115.000 € (57,5%)</span>
                                <span className="text-xs text-slate-400">Cubre la deuda, pero no llega al 70%.</span>
                            </div>
                            <span className="bg-amber-600 text-white text-xs font-bold px-3 py-1 rounded-full">PROVISIONAL</span>
                        </div>
                         <p className="text-xs text-slate-400 pl-2">
                            *En este caso, el deudor tiene 10 días para traer a otro comprador. Si no, te la llevas tú porque cubres la deuda.
                        </p>

                        <div className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700">
                            <div>
                                <span className="block text-red-400 font-bold">TÚ PUJAS: 80.000 € (40%)</span>
                                <span className="text-xs text-slate-400">No cubre deuda ni llega al 50%.</span>
                            </div>
                            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">DIFÍCIL</span>
                        </div>
                    </div>
                </div>

                <p>
                    Para hacer estos números con precisión, primero debes <Link to={ROUTES.ANALYSIS} className="text-brand-700 underline decoration-1 underline-offset-2 hover:text-brand-900">saber analizar el expediente judicial</Link> y extraer la deuda real.
                </p>

                <h2 className="text-3xl mt-12 mb-6">Qué errores cometen los inversores</h2>
                <div className="grid md:grid-cols-2 gap-8 my-8 not-prose">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <XCircle className="text-red-500" size={24} />
                            <h3 className="font-bold text-slate-900">Confundir Tasación con Mercado</h3>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            La tasación del BOE puede ser de 2007. El 70% de una tasación inflada puede ser SUPERIOR al precio real de mercado hoy. Haz tu propia valoración.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <XCircle className="text-red-500" size={24} />
                            <h3 className="font-bold text-slate-900">No calcular el depósito</h3>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Recuerda que para jugar debes poner el <Link to={ROUTES.DEPOSIT} className="text-brand-700 font-bold hover:underline">consignación obligatoria para participar</Link>. Si te adjudican provisionalmente, ese dinero queda retenido semanas o meses hasta que el juez decida.
                        </p>
                    </div>
                </div>

                <h2 className="text-3xl mt-12 mb-6">¿Funciona siempre la regla del 70%?</h2>
                <p>
                    La regla del 70% es una garantía de firmeza, pero <strong>no es una obligación de puja</strong>. Muchos inversores profesionales ganan subastas pujando al 60% o incluso menos, asumiendo el riesgo de la espera y conociendo bien la posición del banco.
                </p>
                <p>
                    La clave está en saber si al banco le interesa adjudicárselo (para limpiar balance) o prefiere el dinero líquido que tú ofreces, aunque sea poco.
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
                          <span className="text-lg pr-4">¿Qué significa pujar por debajo del 70% en una subasta del BOE?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-justify">
                          Pujar por debajo del 70% implica que la adjudicación no es firme inmediatamente. El deudor o el acreedor (generalmente el banco) tendrán plazos legales para mejorar tu postura, lo que aumenta la incertidumbre de la inversión y retrasa la posesión del inmueble judicial.
                      </div>
                  </details>
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all shadow-sm">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          <span className="text-lg pr-4">¿Cómo afecta la regla del 70% a mi riesgo financiero en subastas?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-justify">
                          Superar el 70% del valor de tasación anula el riesgo de que terceros mejoren tu puja. Sin embargo, para conseguir alta rentabilidad en subastas inmobiliarias, se busca pujar entre el 50% y el 70%, asumiendo el riesgo temporal a cambio de un mayor descuento.
                      </div>
                  </details>
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all shadow-sm">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          <span className="text-lg pr-4">¿El Letrado de la Administración de Justicia puede denegar mi puja?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-justify">
                          Sí. Si ofreces menos del 50% del valor de subasta y nadie mejora tu postura, el LAJ tiene potestad (Art. 670.4 LEC) para rechazar la adjudicación si considera que la cifra es irrisoria para saldar la deuda, protegiendo así al ejecutado.
                      </div>
                  </details>
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all shadow-sm">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          <span className="text-lg pr-4">¿Cuánto dinero se bloquea mientras espero la firmeza del remate?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-justify">
                          El depósito retenido inicial será del 5% del valor de subasta, y quedará bloqueado en la cuenta de consignaciones del juzgado hasta que adquiera firmeza la resolución, lo que puede demorarse varios meses si hay controversias.
                      </div>
                  </details>
              </div>
          </section>
      
      
                
                <SaaSCtaBlock />
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
                    <Link to={ROUTES.GUIDE_PILLAR} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Guía General Subastas</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to={ROUTES.ANALYSIS} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Análisis Paso a Paso</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to={ROUTES.DEPOSIT} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Depósito del 5%</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                     <Link to={ROUTES.CHARGES} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Cargas y Deudas</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to={ROUTES.ASSIGNMENT} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Cesión de Remate</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to={ROUTES.COMPARISON} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
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

export default Auction70RuleGuide;