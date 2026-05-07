import React, { useEffect, useState } from 'react';
import { GuideTOC } from './GuideTOC';
import { GuideMobileCTA } from './GuideMobileCTA';

import { CheckCircle,  Calendar, Clock, ChevronRight, ArrowRight, BookOpen, Search, FileText, Home, Calculator, Gavel, AlertTriangle  } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import SaaSCtaBlock from '@/components/SaaSCtaBlock';
import ConversionBlock from './ConversionBlock';

const AuctionAnalysisGuide: React.FC = () => {
  // Imágenes estáticas optimizadas (Unsplash)
  const IMG_HERO = "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200&h=630"; // Análisis documental / Legal
  const IMG_DOCS = "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=800&h=450"; // Auditoría financiera / Cargas
  const IMG_BUILDING = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800&h=450"; // Edificio real / Perspectiva

  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const schemaDate = currentDate.toISOString();
  
  // State for read time
  const [readTime, setReadTime] = useState(3);

    // Schema.org Article Structured Data
    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
      
      "@type": "Article",
      "headline": "Cómo Analizar una Subasta Judicial Paso a Paso (Guía Completa BOE)",
      "description": "Guía práctica para analizar una subasta judicial del BOE paso a paso: cargas, ocupación, valor real y cálculo del precio máximo seguro.",
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
        "@id": "https://activosoffmarket.es/como-analizar-subasta-judicial-paso-a-paso/"
      }
    },
        {
          "@type": "FAQPage",
          "mainEntity": [
                    {
                              "@type": "Question",
                              "name": "¿El valor de tasación del BOE es el precio de mercado?",
                              "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "No. Suele ser el valor de tasación original de la escritura de hipoteca. Ignóralo para valorar el activo; úsalo solo para calcular el depósito (5%) y los tramos del 70%."
                              }
                    },
                    {
                              "@type": "Question",
                              "name": "¿Cómo sé la deuda exacta de la comunidad?",
                              "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "No es público en el expediente judicial. Debes intentar contactar con el administrador de fincas. Si no te dan el dato, estima el máximo legal (anualidad en curso + 3 anteriores)."
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
                              "name": "Cómo Analizar una Subasta Judicial Paso a Paso (BOE)",
                              "item": "https://activosoffmarket.es/como-analizar-subasta-judicial-paso-a-paso/"
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

    // 1. Scroll top
    window.scrollTo(0, 0);

    // 2. SEO Meta Tags
    document.title = "Cómo Analizar una Subasta Judicial Paso a Paso (BOE) | Guía 2025";
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', "Guía práctica para analizar una subasta judicial del BOE paso a paso: cargas, ocupación, valor real y cálculo del precio máximo seguro.");

    // Helper for meta tags
    const setMeta = (property: string, content: string) => {
        let element = document.querySelector(`meta[property="${property}"]`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute('property', property);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    };

    // Open Graph
    setMeta('og:type', 'article');
    setMeta('og:title', 'Cómo Analizar una Subasta Judicial Paso a Paso (BOE) | Guía 2025');
    setMeta('og:description', 'Guía práctica para analizar una subasta judicial del BOE paso a paso: cargas, ocupación, valor real y cálculo del precio máximo seguro.');
    setMeta('og:image', IMG_HERO);
    setMeta('og:url', 'https://activosoffmarket.es/como-analizar-subasta-judicial-paso-a-paso/');
    setMeta('og:site_name', 'Activos Off-Market');

    // Twitter Card
    let twitterCard = document.querySelector('meta[name="twitter:card"]');
    if (!twitterCard) {
        twitterCard = document.createElement('meta');
        twitterCard.setAttribute('name', 'twitter:card');
        document.head.appendChild(twitterCard);
    }
    twitterCard.setAttribute('content', 'summary_large_image');

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', "https://activosoffmarket.es/como-analizar-subasta-judicial-paso-a-paso/");

    // 3. Inject JSON-LD
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
      
      {/* HEADER STANDARD */}
      <header className="bg-white pb-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
            <nav className="flex items-center text-sm text-slate-500 mb-8 font-medium flex-wrap gap-2" aria-label="Breadcrumb">
                <Link to={ROUTES.HOME} className="hover:text-brand-600 transition-colors">Inicio</Link>
                <ChevronRight size={14} />
                <Link to={ROUTES.GUIDE_PILLAR} className="hover:text-brand-600 transition-colors">Guía Subastas</Link>
                <ChevronRight size={14} />
                <span className="text-brand-700 bg-brand-50 px-2 py-1 rounded-md" aria-current="page">Análisis Paso a Paso</span>
            </nav>
            
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-tight">
                Cómo Analizar una Subasta Judicial Paso a Paso <br/><span className="text-brand-700 italic">(Guía Completa BOE)</span>
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
        
        {/* MAIN COLUMN */}
        <main className="lg:col-span-8">
            <article className="prose prose-lg prose-slate prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900 prose-p:leading-loose text-left max-w-5xl space-y-6 leading-relaxed prose-p:max-w-3xl prose-headings:max-w-3xl prose-li:max-w-3xl">
          
              {/* IMAGEN HERO */}
              <figure className="mb-12 -mt-6">
                <img 
                  src={IMG_HERO} 
                  alt="Análisis de expediente judicial para subasta BOE" 
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
                El 90% del éxito en una inversión en <Link to={ROUTES.GUIDE_PILLAR} className="text-brand-700 underline decoration-1 underline-offset-2 hover:text-brand-900">el mercado de ejecuciones hipotecarias</Link> no ocurre durante la puja, sino en la fase de análisis previo. 
                Pujar es fácil (son dos clics); saber <strong>qué estás comprando realmente</strong> es lo que distingue al inversor profesional del que acaba perdiendo su depósito.
              </p>
              
              <p className="mb-8">
                A continuación, detallo el <strong>protocolo de diligencia debida</strong> (Due Diligence) paso a paso que aplicamos en Activos Off-Market para filtrar cualquier expediente antes de considerarlo una oportunidad viable. Antes de pujar en una subasta es recomendable calcular la rentabilidad real de la operación. Puedes hacerlo con esta <Link to={ROUTES.CALCULATOR} className="text-brand-700 underline font-bold hover:text-brand-900">calculadora de subastas judiciales</Link>.
              </p>

              <ConversionBlock />

              <hr className="border-slate-200 my-10" />

              
            {/* RESUMEN RÁPIDO */}
            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 md:p-8 mb-12 shadow-sm not-prose">
                <h3 className="text-brand-900 font-bold mb-4 flex items-center gap-2">
                    <CheckCircle size={20} className="text-brand-600" /> Resumen Rápido (TL;DR)
                </h3>
                <ul className="space-y-3">
                    <li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Analizar las cargas registrales es obligatorio.</p>
                    </li><li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">La tasación BOE rara vez es el valor de mercado.</p>
                    </li><li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Calcula siempre tu rentabilidad real antes de pujar.</p>
                    </li>
                </ul>
            </div>
            
            <GuideTOC />
            
        
<h2 className="text-3xl font-bold mt-12 mb-6">Paso 1: Verificar el tipo de procedimiento</h2>
              <p>
                No todas las subastas son iguales. Antes de profundizar, revisa la autoridad gestora en el portal del BOE:
              </p>
              <ul className="list-disc pl-6 space-y-3 mb-8">
                <li>
                  <strong>Juzgado (Subasta Judicial):</strong> Rige la Ley de Enjuiciamiento Civil. Garantías procesales fuertes, pero plazos más lentos.
                </li>
                <li>
                  <strong>Agencia Tributaria (AEAT) o Seguridad Social:</strong> Son subastas administrativas. Tienen normativas propias y no siempre aplican las mismas reglas de purga de cargas o posesión.
                </li>
              </ul>
              <div className="bg-slate-50 border-l-4 border-slate-400 p-4 rounded-r-md not-prose text-sm mb-8">
                  <p><strong>¿Por qué importa?</strong> Porque determina cómo se entregan las llaves y qué deudas se cancelan. En esta guía nos centramos en las <strong>judiciales</strong>.</p>
              </div>

              <h2 className="text-3xl font-bold mt-12 mb-6">Paso 2: Revisar la nota simple y cargas registrales</h2>
              <p>
                Nunca pujes sin revisar la <strong>Certificación de Cargas</strong> expedida por el Registrador (disponible en el portal del BOE). Es el historial jurídico del inmueble.
              </p>
              <p>
                 Debes identificar claramente qué cargas se cancelan y cuáles heredas. Para ello, consulta nuestra guía específica sobre <Link to={ROUTES.CHARGES} className="text-brand-700 underline font-bold hover:text-brand-900">jerarquía y cancelación de cargas</Link>, pero el resumen es:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 not-prose">

                <div className="bg-white border text-left border-slate-200 p-6 rounded-2xl shadow-sm hover:border-brand-200 hover:shadow-md transition-all flex flex-col">
                    <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center pr-2 gap-2 text-balance leading-snug"><div className="w-2 h-2 rounded-full bg-brand-500 shrink-0"></div> Carga Ejecutada</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">La deuda por la que sale a subasta. Se cancela tras la adjudicación.</p>
                </div>
                <div className="bg-white border text-left border-slate-200 p-6 rounded-2xl shadow-sm hover:border-brand-200 hover:shadow-md transition-all flex flex-col">
                    <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center pr-2 gap-2 text-balance leading-snug"><div className="w-2 h-2 rounded-full bg-brand-500 shrink-0"></div> Cargas Posteriores</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Se cancelan automáticamente (purga).</p>
                </div>
                <div className="bg-white border text-left border-slate-200 p-6 rounded-2xl shadow-sm hover:border-brand-200 hover:shadow-md transition-all flex flex-col">
                    <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center pr-2 gap-2 text-balance leading-snug"><div className="w-2 h-2 rounded-full bg-brand-500 shrink-0"></div> Cargas Anteriores</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">¡PELIGRO! Estas subsisten. Debes restarlas de tu valoración porque te tocará pagarlas.</p>
                </div>
</div>

              <figure className="my-10">
                <img 
                  src={IMG_DOCS} 
                  alt="Documentación de cargas registrales" 
                  width="800" 
                  height="450"
                  loading="lazy"
                  className="w-full h-auto object-cover rounded-2xl shadow-lg border border-slate-100 bg-slate-100"
                />
              </figure>

              
<GuideMobileCTA />
<h2 className="text-3xl font-bold mt-12 mb-6">Paso 3: Analizar la situación posesoria (ocupada o no)</h2>
              <p>
                El Registro te dice quién es el dueño, pero no quién vive dentro. Lee el Edicto con lupa buscando frases como <em>"situación posesoria: ocupado"</em> o <em>"se ignora ocupación"</em>.
              </p>
              <p>
                  Si hay ocupantes, debes distinguir entre el ejecutado (propietario) y terceros (inquilinos u okupas). Esto determinará el coste y tiempo del desalojo.
              </p>
              <p>
                  ¿Y el estado interior? Si hay ocupantes, olvídate de entrar. Consulta nuestra guía sobre <Link to={ROUTES.VISIT} className="text-brand-700 font-bold hover:underline">cuándo es posible visitar un inmueble en subasta</Link> y cómo actuar si no te dejan.
              </p>

              <h2 className="text-3xl font-bold mt-12 mb-6">Paso 4: Calcular el valor real de mercado</h2>
              <p>
                <strong>Error de novato:</strong> Confiar en el "Valor de Subasta" que aparece en el BOE. Ese valor suele ser la tasación original de la hipoteca (quizás de 2007) y estar totalmente fuera de mercado.
              </p>
              <p>
                Haz tu propia valoración (comparables en Idealista/Fotocasa) para saber cuánto vale realmente ese piso HOY. Ese será tu punto de partida.
              </p>

              <h2 className="text-3xl font-bold mt-12 mb-6">Paso 5: Aplicar la regla del 70%</h2>
              <p>
                Una vez tienes tu valoración, debes mirar el Valor de Tasación del BOE solo para una cosa: calcular los tramos legales del Artículo 670 LEC.
              </p>
              <p>
                Entender la <Link to={ROUTES.RULE_70} className="text-brand-700 underline font-bold hover:text-brand-900">firmeza del decreto de adjudicación</Link> es vital para saber si tu puja será firme o si el banco podrá mejorarla y quitarte el activo.
              </p>

              <h2 className="text-3xl font-bold mt-12 mb-6">Paso 6: Evaluar riesgos legales y económicos</h2>
              <p>
                Antes de fijar tu precio máximo, resta los costes "invisibles":
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 not-prose">

                <div className="bg-white border text-left border-slate-200 p-6 rounded-2xl shadow-sm hover:border-brand-200 hover:shadow-md transition-all flex flex-col">
                    <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center pr-2 gap-2 text-balance leading-snug"><div className="w-2 h-2 rounded-full bg-brand-500 shrink-0"></div> Depósito</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Recuerda que debes consignar el fianza del 5% para participar.</p>
                </div>
                <div className="bg-white border text-left border-slate-200 p-6 rounded-2xl shadow-sm hover:border-brand-200 hover:shadow-md transition-all flex flex-col">
                    <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center pr-2 gap-2 text-balance leading-snug"><div className="w-2 h-2 rounded-full bg-brand-500 shrink-0"></div> Deudas ocultas</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">IBI (hasta 4 años) y Comunidad de Propietarios (año en curso + 3 anteriores).</p>
                </div>
                <div className="bg-white border text-left border-slate-200 p-6 rounded-2xl shadow-sm hover:border-brand-200 hover:shadow-md transition-all flex flex-col">
                    <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center pr-2 gap-2 text-balance leading-snug"><div className="w-2 h-2 rounded-full bg-brand-500 shrink-0"></div> Impuestos</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">ITP (6-10%) y gastos de inscripción.</p>
                </div>
</div>


              <h2 className="text-3xl font-bold mt-12 mb-6">Conclusión</h2>
              <p>
                Si al realizar este análisis paso a paso encuentras un dato que no cuadra (una carga confusa, un ocupante sin identificar), la regla es simple: <strong>NO PUJES</strong>. Hay miles de oportunidades en el BOE; no te arriesgues en una dudosa.
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

              <section className="not-prose bg-slate-50 p-10 rounded-3xl border border-slate-200">
                <h2 className="font-serif text-2xl font-bold text-slate-900 mb-8">Preguntas frecuentes</h2>
                <div className="space-y-8">
                    
                    <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all">
                        <summary className="cursor-pointer font-bold text-slate-900 p-5 list-none flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <span className="text-lg pr-4">¿El valor de tasación del BOE es el precio de mercado?</span>
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-open:bg-brand-100 transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-open:text-brand-600 transition-transform group-open:rotate-180"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                        </summary>
                        <div className="p-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                            <p><strong>No.</strong> Suele ser el valor de tasación original de la escritura de hipoteca. Ignóralo para valorar el activo; úsalo solo para calcular el depósito (5%) y los tramos del 70%.</p>
                        </div>
                    </details>
                    
                    <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all">
                        <summary className="cursor-pointer font-bold text-slate-900 p-5 list-none flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <span className="text-lg pr-4">¿Cómo sé la deuda exacta de la comunidad?</span>
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-open:bg-brand-100 transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-open:text-brand-600 transition-transform group-open:rotate-180"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                        </summary>
                        <div className="p-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                            <p>No es público en el expediente judicial. Debes intentar contactar con el administrador de fincas. Si no te dan el dato, estima el máximo legal (anualidad en curso + 3 anteriores).</p>
                        </div>
                    </details>
                </div>
              </section>

              <SaaSCtaBlock />
            

          
          
          {/* FAQ SECTON AUTOGENERADA */}
          <section className="not-prose bg-slate-50 p-8 md:p-10 rounded-3xl border border-slate-200 mt-16 mb-8">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-8">Preguntas Frecuentes de Inversión y Riesgos (FAQ)</h2>
              <div className="space-y-4">
                  
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all shadow-sm">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          <span className="text-lg pr-4">¿Qué deudas ocultas debo buscar al analizar una subasta judicial?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-justify">
                          Antes de invertir tu dinero en el BOE, debes descargar y analizar la Certificación de Cargas del Registro de la Propiedad para detectar embargos anteriores, hipotecas preferentes no ejecutadas, posibles afecciones fiscales e importes pendientes de IBI o comunidad que heredarás.
                      </div>
                  </details>
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all shadow-sm">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          <span className="text-lg pr-4">¿El valor de tasación del edicto es el precio real de mercado?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-justify">
                          No, y este es un riesgo enorme. Muchas tasaciones usadas en subastas hipotecarias tienen años de antigüedad o están infladas. Confiar ciegamente en el valor del portal del BOE sin un análisis comparativo de mercado puede arruinar tu inversión inmobiliaria.
                      </div>
                  </details>
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all shadow-sm">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          <span className="text-lg pr-4">¿Cómo puedo mitigar el riesgo de "okupas" en viviendas subastadas?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-justify">
                          El edicto suele incluir información sobre la situación posesoria. Es fundamental acudir presencialmente, confirmar con vecinos y estar preparado para iniciar un incidente de lanzamiento en vía civil, asumiendo hasta 9 meses extra de bloqueo de tu capital y posibles reformas.
                      </div>
                  </details>
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all shadow-sm">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          <span className="text-lg pr-4">¿Es rentable comprar pisos embargados sin ver el interior?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-justify">
                          Adquirir inmuebles judiciales implica comprar "a cuerpo cierto" y casi nunca podrás visitar el piso. Por ello, la rentabilidad mínima exigida al analizar los números debe tener un margen de seguridad lo suficientemente alto para cubrir una posible reforma integral.
                      </div>
                  </details>
              </div>
          </section>
      
      
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
                    <Link to={ROUTES.GUIDE_PILLAR} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Guía General Subastas</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to={ROUTES.ERRORS} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Errores Frecuentes</span>
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

export default AuctionAnalysisGuide;