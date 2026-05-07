import React, { useEffect, useState } from 'react';
import { GuideTOC } from './GuideTOC';
import { GuideMobileCTA } from './GuideMobileCTA';
import { CheckCircle,  Calendar, Clock, ChevronRight, ArrowRight, BookOpen, Calculator  } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import SaaSCtaBlock from '@/components/SaaSCtaBlock';

const AuctionProfitabilityGuide: React.FC = () => {
  const IMG_HERO = "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=1200&h=630"; 

  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const schemaDate = currentDate.toISOString();
  
  const [readTime, setReadTime] = useState(4);

  const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
    
    "@type": "Article",
    "headline": "Cómo calcular la rentabilidad de una subasta judicial",
    "description": "Aprende cómo calcular la rentabilidad real de una subasta judicial incluyendo ITP, reforma y costes ocultos. Incluye ejemplo práctico.",
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
    "datePublished": "2024-01-15T09:00:00+01:00",
    "dateModified": schemaDate,
    "image": [IMG_HERO],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://activosoffmarket.es/como-calcular-rentabilidad-subasta-judicial"
    }
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
                              "name": "Cómo calcular la rentabilidad de una subasta judicial",
                              "item": "https://activosoffmarket.es/como-calcular-rentabilidad-subasta-judicial"
                    }
          ]
}
      ]
    };

  useEffect(() => {
    const article = document.querySelector('article');
    if (article) {
      const text = article.innerText;
      const words = text.trim().split(/\s+/).length;
      const time = Math.ceil(words / 200);
      setReadTime(Math.max(3, time));
    }

    window.scrollTo(0, 0);

    document.title = "Cómo calcular la rentabilidad de una subasta judicial";
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', "Aprende cómo calcular la rentabilidad real de una subasta judicial incluyendo ITP, reforma y costes ocultos. Incluye ejemplo práctico.");

    const setMeta = (property: string, content: string) => {
        let element = document.querySelector(`meta[property="${property}"]`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute('property', property);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    };

    setMeta('og:type', 'article');
    setMeta('og:title', 'Cómo calcular la rentabilidad de una subasta judicial');
    setMeta('og:description', 'Aprende cómo calcular la rentabilidad real de una subasta judicial incluyendo ITP, reforma y costes ocultos. Incluye ejemplo práctico.');
    setMeta('og:image', IMG_HERO);
    setMeta('og:url', 'https://activosoffmarket.es/como-calcular-rentabilidad-subasta-judicial');
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
    canonical.setAttribute('href', "https://activosoffmarket.es/como-calcular-rentabilidad-subasta-judicial");

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
                <span className="text-brand-700 bg-brand-50 px-2 py-1 rounded-md" aria-current="page">Calcular Rentabilidad</span>
            </nav>
            
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-tight">
                Cómo calcular la rentabilidad de una subasta judicial
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
                  alt="Cálculo de rentabilidad en subastas judiciales" 
                  width="1200" 
                  height="630"
                  className="w-full h-auto object-cover rounded-3xl shadow-xl border border-slate-200 bg-slate-100"
                  // @ts-ignore
                  fetchpriority="high"
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


              <p className="text-xl leading-relaxed mb-8 font-light first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-brand-700 first-letter:mr-3 first-letter:float-left">
                Calcular correctamente la rentabilidad antes de pujar es el paso más crítico en cualquier inversión inmobiliaria, especialmente en las subastas judiciales. Un error de cálculo puede transformar una oportunidad aparente en una pérdida económica severa.
              </p>
              
              <p className="mb-8">
                En este artículo te explico de forma clara y directa cómo calcular la rentabilidad real de una subasta en España, qué costes ocultos debes considerar siempre y cómo evitar los errores más comunes.
              </p>

              
            {/* RESUMEN RÁPIDO */}
            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 md:p-8 mb-12 shadow-sm not-prose">
                <h3 className="text-brand-900 font-bold mb-4 flex items-center gap-2">
                    <CheckCircle size={20} className="text-brand-600" /> Resumen Rápido (TL;DR)
                </h3>
                <ul className="space-y-3">
                    <li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">No caigas en la trampa del precio barato.</p>
                    </li><li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Una reforma cara arruina una buena subasta.</p>
                    </li><li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Cuidado con los inmuebles okupados y su tiempo de desalojo.</p>
                    </li>
                </ul>
            </div>
            
            <GuideTOC />
            
        
<h2 className="text-3xl font-bold mt-12 mb-6">Qué costes incluir al calcular una subasta judicial</h2>
              <p>
                El precio de adjudicación (lo que pujas) es solo una parte del coste total. Para no llevarte sorpresas, debes sumar siempre los siguientes conceptos:
              </p>
              <ul className="list-disc pl-6 space-y-3 mb-8">
                <li>
                  <strong>Precio de adjudicación:</strong> El importe final por el que ganas la subasta.
                </li>
                <li>
                  <strong>ITP (Impuesto de Transmisiones Patrimoniales):</strong> Varía según la comunidad autónoma (generalmente entre el 6% y el 10%). Se calcula sobre el valor de referencia o el precio de adjudicación (el mayor de los dos).
                </li>
                <li>
                  <strong>Costes de notaría y registro:</strong> Gastos derivados de la inscripción del decreto de adjudicación y mandamiento de cancelación de cargas en el Registro de la Propiedad.
                </li>
                <li>
                  <strong>Reforma:</strong> Estimación realista de los costes para adecuar la vivienda para su venta o alquiler.
                </li>
                <li>
                  <strong>Deudas heredadas:</strong> IBI (hasta 4 años) y cuotas de la comunidad de propietarios (año en curso y los 3 anteriores).
                </li>
              </ul>

              <h2 className="text-3xl font-bold mt-12 mb-6">Cómo calcular el ROI de una subasta</h2>
              <p>
                El ROI (Retorno sobre la Inversión) es la métrica clave. Se calcula con esta fórmula básica:
              </p>
              
              <div className="bg-slate-900 text-white p-6 rounded-xl my-8 font-mono text-lg text-center shadow-lg">
                ROI = (Beneficio / Coste Total) × 100
              </div>

              <p>
                Para aplicar la fórmula, primero debes calcular el <strong>beneficio</strong>. Este se obtiene restando el <strong>coste total</strong> de la inversión al <strong>valor de mercado</strong> realista del inmueble una vez reformado.
              </p>

              
<GuideMobileCTA />
<h2 className="text-3xl font-bold mt-12 mb-6">Ejemplo real de cálculo de una subasta</h2>
              <p>
                Veamos un ejemplo simple con números redondos para ilustrar el proceso:
              </p>

              <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm my-8">
                <ul className="space-y-4 text-slate-700 font-medium">
                    <li className="flex justify-between border-b border-slate-100 pb-2">
                        <span>Valor de mercado:</span> <span>220.000€</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-100 pb-2">
                        <span>Precio adjudicación:</span> <span>140.000€</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-100 pb-2">
                        <span>Reforma:</span> <span>25.000€</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-100 pb-2">
                        <span>ITP (ej. 6%):</span> <span>8.400€</span>
                    </li>
                    <li className="flex justify-between pt-4 font-bold text-lg text-slate-900 border-t-2 border-slate-200">
                        <span>Coste total:</span> <span>173.400€</span>
                    </li>
                    <li className="flex justify-between text-brand-700 font-bold text-lg">
                        <span>Beneficio potencial:</span> <span>46.600€</span>
                    </li>
                    <li className="flex justify-between text-emerald-600 font-bold text-xl mt-4">
                        <span>ROI aproximado:</span> <span>26%</span>
                    </li>
                </ul>
              </div>

              <h2 className="text-3xl font-bold mt-12 mb-6">Errores frecuentes al calcular la rentabilidad de una subasta</h2>
              <p>
                Muchos inversores fracasan por cometer estos errores básicos de cálculo:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 not-prose">

                <div className="bg-white border text-left border-slate-200 p-6 rounded-2xl shadow-sm hover:border-brand-200 hover:shadow-md transition-all flex flex-col">
                    <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center pr-2 gap-2 text-balance leading-snug"><div className="w-2 h-2 rounded-full bg-brand-500 shrink-0"></div> Olvidar el ITP</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Es el gasto más importante después del precio de adjudicación.</p>
                </div>
                <div className="bg-white border text-left border-slate-200 p-6 rounded-2xl shadow-sm hover:border-brand-200 hover:shadow-md transition-all flex flex-col">
                    <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center pr-2 gap-2 text-balance leading-snug"><div className="w-2 h-2 rounded-full bg-brand-500 shrink-0"></div> Subestimar la reforma</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Siempre añade un margen de imprevistos (10-15%) al presupuesto de obra.</p>
                </div>
                <div className="bg-white border text-left border-slate-200 p-6 rounded-2xl shadow-sm hover:border-brand-200 hover:shadow-md transition-all flex flex-col">
                    <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center pr-2 gap-2 text-balance leading-snug"><div className="w-2 h-2 rounded-full bg-brand-500 shrink-0"></div> No considerar deudas de comunidad</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Pueden sumar miles de euros si el anterior propietario llevaba años sin pagar.</p>
                </div>
                <div className="bg-white border text-left border-slate-200 p-6 rounded-2xl shadow-sm hover:border-brand-200 hover:shadow-md transition-all flex flex-col">
                    <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center pr-2 gap-2 text-balance leading-snug"><div className="w-2 h-2 rounded-full bg-brand-500 shrink-0"></div> Confiar demasiado en la tasación BOE</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">El valor de subasta que publica el BOE suele estar desactualizado. Haz siempre tu propio estudio de mercado.</p>
                </div>
</div>

              <div className="bg-brand-50 border border-brand-100 p-8 rounded-2xl my-12">
                  <p className="text-brand-900 font-medium text-lg m-0 flex items-start gap-4">
                      <Calculator className="text-brand-600 shrink-0 mt-1" size={24} />
                      <span>Si quieres estimar automáticamente la rentabilidad de una operación, puedes utilizar esta <Link to={ROUTES.CALCULATOR} className="text-brand-700 font-bold hover:underline">calculadora de subastas judiciales</Link>.</span>
                  </p>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4">También puede interesarte:</h3>
                <ul className="list-none pl-0 space-y-3">
                  <li>
                    <Link to={ROUTES.HOW_MUCH_TO_PAY} className="text-brand-700 font-medium hover:underline flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                      Cuánto pagar en una subasta judicial
                    </Link>
                  </li>
                  <li>
                    <Link to={ROUTES.MAX_BID} className="text-brand-700 font-medium hover:underline flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
                      Cómo calcular la puja máxima en una subasta
                    </Link>
                  </li>
                </ul>
              </div>

              <SaaSCtaBlock />
            

          
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

{/* FAQ SECTON AUTOGENERADA */}
          <section className="not-prose bg-slate-50 p-8 md:p-10 rounded-3xl border border-slate-200 mt-16 mb-8">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-8">Preguntas Frecuentes</h2>
              <div className="space-y-4">
                  
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          ¿Cuánto tiempo tarda el juzgado en darme las llaves?
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                          Desde la adjudicación, pueden pasar entre 3 y 8 meses de media para obtener el Decreto y el Mandamiento, y luego solicitar la posesión.
                      </div>
                  </details>
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          ¿Se pagan impuestos al comprar en subasta?
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                          Sí. Transmisiones Patrimoniales (ITP) o IVA, según el caso. Se calcula sobre el valor de adjudicación o el valor de referencia, el mayor de ellos.
                      </div>
                  </details>
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          ¿Puedo revender el piso de inmediato?
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                          Puedes hacerlo en cuanto se inscriba el Decreto de Adjudicación a tu nombre en el Registro de la Propiedad, asumiendo su posesión pacífica.
                      </div>
                  </details>
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          ¿Las subastas de Hacienda tienen las mismas reglas?
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                          No. Las subastas administrativas de la AEAT o Seguridad Social tienen plazos, reglas de adjudicación y procedimientos de posesión diferentes a las judiciales.
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
                    <Link to={ROUTES.COMO_COMPRAR} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Cómo comprar paso a paso</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to={ROUTES.GUIDE_PILLAR} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Guía General Subastas</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to={ROUTES.ANALYSIS} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Cómo Analizar Subastas</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to={ROUTES.ERRORS} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Errores Frecuentes</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                     <Link to={ROUTES.RULE_70} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Regla del 70%</span>
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

export default AuctionProfitabilityGuide;
