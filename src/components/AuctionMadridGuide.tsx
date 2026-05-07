import React, { useEffect, useState } from 'react';
import { GuideTOC } from './GuideTOC';
import { GuideMobileCTA } from './GuideMobileCTA';
import { CheckCircle,  Calendar, Clock, ChevronRight, ArrowRight, BookOpen, Calculator, HelpCircle, MapPin, DollarSign, TrendingUp, Search  } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { AUCTIONS } from '../data/auctions';
import { getFilteredAuctions } from '../utils/auctionHelpers';
import { isAuctionFinished, sortActiveFirst } from '../utils/auctionHelpers';
import { normalizePropertyType, normalizeCity, normalizeLocationLabel } from '../utils/auctionNormalizer';

const AuctionMadridGuide: React.FC = () => {
  const cityAuctions = React.useMemo(() => {
    const filtered = Object.entries(AUCTIONS).filter(([_, a]) => normalizeCity(a) === "Madrid");
    return sortActiveFirst(filtered, (item) => item[1].auctionDate);
  }, []);
  
  const activeCount = React.useMemo(() => {
    return cityAuctions.filter(item => !isAuctionFinished(item[1].auctionDate)).length;
  }, [cityAuctions]);

  const summary = React.useMemo(() => {
    const active = cityAuctions.filter(item => !isAuctionFinished(item[1].auctionDate));
    const count = active.length;
    if (count === 0) return null;
    
    const totalDiscount = active.reduce((acc, curr) => acc + (curr[1].discount || 0), 0);
    const avgDiscount = (totalDiscount / count).toFixed(1);
    
    const typeCounts: Record<string, number> = {};
    active.forEach(item => {
      const type = normalizePropertyType(item[1].propertyType || "Otros");
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    
    const dominantType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0][0];
    
    return { count, avgDiscount, dominantType };
  }, [cityAuctions]);

  const IMG_HERO = "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&q=80&w=1200&h=630"; 

  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const schemaDate = currentDate.toISOString();
  
  const [readTime, setReadTime] = useState(5);

  const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
    
    "@type": "Article",
    "headline": "Subastas BOE Madrid: cómo comprar pisos en subasta judicial",
    "description": "Descubre cómo comprar pisos en subasta judicial en Madrid. Aprende a encontrar oportunidades reales en el portal del BOE, auditar expedientes y pujar con rentabilidad.",
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
      "@id": "https://activosoffmarket.es/subastas-madrid"
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
                              "name": "Subastas BOE Madrid: cómo comprar pisos en subasta judicial",
                              "item": "https://activosoffmarket.es/subastas-madrid"
                    }
          ]
}
      ]
    };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Es posible visitar los pisos antes de participar en la subasta BOE?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Casi nunca. Salvo excepciones muy concretas publicadas en el edicto, comprar en subasta implica hacerlo 'a cuerpo cierto'. Si el deudor reside en la vivienda, no tienes derecho a examinar su estado interior, lo que influye en tu cálculo de reforma."
        }
      },
      {
        "@type": "Question",
        "name": "¿La adjudicación bancaria de una subasta limpia todas las deudas?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Bajo ningún concepto. Sólo se cancelan las deudas posteriores a la que ejecuta la subasta. Tú, como nuevo propietario, heredarás todas las cargas anteriores inscritas en la Seguridad Social o en el Registro, además del IBI y comunidad de forma subsidiaria."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cuánto debo consignar para participar en subastas en Madrid?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "La consignación exigida es del 5% del valor de subasta, no de tu puja. Por tanto, es clave tener ese dinero bloqueado antes del cierre del portal oficial BOE. Si pierdes la subasta judicial, el propio Ministerio de Justicia te retorna los fondos sin penalización."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
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
        "name": "Guía Subastas",
        "item": "https://activosoffmarket.es/guias"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Subastas en Madrid",
        "item": "https://activosoffmarket.es/subastas-madrid"
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

    document.title = "Subastas BOE Madrid: cómo comprar pisos en subasta judicial";
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', "Descubre cómo comprar pisos en subasta judicial en Madrid. Aprende a encontrar oportunidades reales en el portal de subastas del BOE y evitar cargas registrales.");

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
    setMeta('og:title', 'Subastas BOE Madrid: cómo comprar pisos en subasta judicial');
    setMeta('og:description', 'Descubre cómo comprar pisos en subasta judicial en Madrid. Aprende a encontrar oportunidades reales en el portal de subastas del BOE y evitar cargas registrales.');
    setMeta('og:image', IMG_HERO);
    setMeta('og:url', 'https://activosoffmarket.es/subastas-madrid');
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
    canonical.setAttribute('href', "https://activosoffmarket.es/subastas-madrid");

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    script.id = 'schemaData';
    document.head.appendChild(script);

    const scriptFaq = document.createElement('script');
    scriptFaq.type = 'application/ld+json';
    scriptFaq.text = JSON.stringify(faqSchema);
    scriptFaq.id = 'faqSchema';
    document.head.appendChild(scriptFaq);

    const scriptBread = document.createElement('script');
    scriptBread.type = 'application/ld+json';
    scriptBread.text = JSON.stringify(breadcrumbSchema);
    scriptBread.id = 'breadcrumbSchema';
    document.head.appendChild(scriptBread);

    return () => {
        if (document.head.contains(script)) {
            document.head.removeChild(script);
        }
        if (document.head.contains(scriptFaq)) {
            document.head.removeChild(scriptFaq);
        }
        if (document.head.contains(scriptBread)) {
            document.head.removeChild(scriptBread);
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
                <span className="text-brand-700 bg-brand-50 px-2 py-1 rounded-md" aria-current="page">Subastas en Madrid</span>
            </nav>
            
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-tight">
                Subastas BOE Madrid: cómo comprar pisos en subasta judicial
            </h1>\n
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-8 bg-slate-50 inline-flex px-4 py-2 rounded-full border border-slate-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Basado en el análisis de edictos BOE y certificaciones del Registro de la Propiedad
            </div>

            <p className="text-lg text-slate-600 mb-8">
              Las subastas BOE en Madrid ofrecen oportunidades de inversión para adquirir inmuebles con descuentos. Descubre cómo encontrar pisos de bancos y embargos, evaluar el expediente judicial y pujar con seguridad en la capital y el resto de la provincia.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-12">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">En esta guía</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm list-none p-0 m-0">
                    <li className="flex items-center gap-2"><ArrowRight size={14} className="text-brand-500 shrink-0"/><a href="#encontrar-subastas" className="text-slate-700 hover:text-brand-600 transition-colors">Dónde encontrar subastas en Madrid</a></li>
                    <li className="flex items-center gap-2"><ArrowRight size={14} className="text-brand-500 shrink-0"/><a href="#que-mirar" className="text-slate-700 hover:text-brand-600 transition-colors">Qué mirar en las subastas</a></li>
                    <li className="flex items-center gap-2"><ArrowRight size={14} className="text-brand-500 shrink-0"/><a href="#rentabilidad" className="text-slate-700 hover:text-brand-600 transition-colors">Cómo calcular rentabilidad</a></li>
                    <li className="flex items-center gap-2"><ArrowRight size={14} className="text-brand-500 shrink-0"/><a href="#ejemplo-calculo" className="text-slate-700 hover:text-brand-600 transition-colors">Ejemplo real de cálculo</a></li>
                    <li className="flex items-center gap-2"><ArrowRight size={14} className="text-brand-500 shrink-0"/><a href="#faq" className="text-slate-700 hover:text-brand-600 transition-colors">Preguntas frecuentes</a></li>
                    <li className="flex items-center gap-2"><ArrowRight size={14} className="text-brand-500 shrink-0"/><a href="#analizar-correctamente" className="text-slate-700 hover:text-brand-600 transition-colors">Cómo analizar correctamente</a></li>
                </ul>
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
                  alt="Subastas judiciales en Madrid" 
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


              <p className="text-xl leading-relaxed mb-6 font-light first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-brand-700 first-letter:mr-3 first-letter:float-left">
                Las subastas pisos Madrid representan una de las vías más rentables para adquirir propiedades, locales o garajes con descuentos notables sobre el valor de mercado. 
              </p>
              <p className="text-xl leading-relaxed mb-6 font-light">
                Sin embargo, la mayoría de los inversores fracasa en el primer paso: no saben identificar qué activos esconden deudas inasumibles. Participar en subastas en Madrid exige conocimientos técnicos; un error de análisis en la nota simple o la certificación de cargas puede arruinar todos tus beneficios.
              </p>

              {summary && summary.count >= 10 && parseFloat(summary.avgDiscount) > 1 ? (
                <div className="bg-brand-50 border border-brand-200 p-8 rounded-2xl my-8 relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold text-brand-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="text-brand-600" />
                        Radiografía del mercado en Madrid (Actualizado)
                    </h3>
                    <p className="text-slate-700 mb-6">
                        El mercado en la provincia es altamente competitivo y las mejores oportunidades tienen tiempos muy cortos de exposición en el BOE. Estos son los datos reales que estamos analizando en tiempo real:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-brand-100">
                            <span className="block text-sm text-slate-500 mb-1">Oportunidades activas</span>
                            <span className="text-2xl font-bold text-slate-900">{summary.count}</span>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-brand-100">
                            <span className="block text-sm text-slate-500 mb-1">Descuento medio detectado</span>
                            <span className="text-2xl font-bold text-slate-900">{summary.avgDiscount}%</span>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-brand-100">
                            <span className="block text-sm text-slate-500 mb-1">Activo más frecuente</span>
                            <span className="text-2xl font-bold text-slate-900 capitalize">{summary.dominantType}</span>
                        </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-brand-50 border border-brand-200 p-8 rounded-2xl my-8">
                  <h3 className="text-xl font-bold text-brand-900 mb-4 flex items-center gap-2">
                      <TrendingUp className="text-brand-600" />
                      Radiografía del mercado en Madrid
                  </h3>
                  <p className="text-slate-700 m-0 leading-relaxed">
                      El mercado en Madrid es dinámico y altamente competitivo, las oportunidades aparecen y se adjudican de forma muy rápida. Ante esta velocidad, existe una necesidad vital de análisis previo meticuloso. Revisar el BOE con frecuencia y auditar en profundidad cada expediente con rigor registral es fundamental para tener viabilidad en la operación.
                  </p>
                </div>
              )}

              
            {/* RESUMEN RÁPIDO */}
            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 md:p-8 mb-12 shadow-sm not-prose">
                <h3 className="text-brand-900 font-bold mb-4 flex items-center gap-2">
                    <CheckCircle size={20} className="text-brand-600" /> Resumen Rápido (TL;DR)
                </h3>
                <ul className="space-y-3">
                    <li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Alta demanda en bienes prime.</p>
                    </li><li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">ITP en torno al 6%, ventaja competitiva.</p>
                    </li><li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Céntrate en analizar rápido y pujar fuerte.</p>
                    </li>
                </ul>
            </div>
            
            <GuideTOC />
            
        
<h2 id="encontrar-subastas" className="text-3xl font-bold mt-12 mb-6">Dónde encontrar subastas judiciales en Madrid</h2>
              <p>
                Para localizar subastas de pisos, locales o garajes en la Comunidad de Madrid, debes acudir a las fuentes oficiales. Las principales son:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 not-prose">

                <div className="bg-white border text-left border-slate-200 p-6 rounded-2xl shadow-sm hover:border-brand-200 hover:shadow-md transition-all flex flex-col">
                    <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center pr-2 gap-2 text-balance leading-snug"><div className="w-2 h-2 rounded-full bg-brand-500 shrink-0"></div> Portal de Subastas del BOE</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">(subastas.boe.es). Es la plataforma centralizada del Estado. Aquí se publican la inmensa mayoría de las subastas inmobiliarias, tanto judiciales como notariales.</p>
                </div>
                <div className="bg-white border text-left border-slate-200 p-6 rounded-2xl shadow-sm hover:border-brand-200 hover:shadow-md transition-all flex flex-col">
                    <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center pr-2 gap-2 text-balance leading-snug"><div className="w-2 h-2 rounded-full bg-brand-500 shrink-0"></div> Subastas de Hacienda (AEAT)</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">La Agencia Tributaria realiza sus propias subastas por embargos de deudas fiscales. También se anuncian y celebran a través del portal del BOE.</p>
                </div>
                <div className="bg-white border text-left border-slate-200 p-6 rounded-2xl shadow-sm hover:border-brand-200 hover:shadow-md transition-all flex flex-col">
                    <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center pr-2 gap-2 text-balance leading-snug"><div className="w-2 h-2 rounded-full bg-brand-500 shrink-0"></div> Ejecuciones hipotecarias</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Son el tipo de subasta judicial más común, derivadas del impago de préstamos hipotecarios a entidades bancarias.</p>
                </div>
</div>
              <p>
                En resumen, si quieres buscar oportunidades en Madrid, tu principal herramienta de trabajo diaria debe ser el buscador avanzado del portal oficial del BOE.
              </p>

              <h2 id="que-mirar" className="text-3xl font-bold mt-12 mb-6">Qué mirar en las subastas de Madrid</h2>
              <p>
                Analizar activos en Madrid requiere poner el foco en tres puntos críticos que la mayoría de compradores pasa por alto:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 mt-8 not-prose">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-brand-300 transition-colors">
                  <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Cargas registrales</h3>
                  <p className="text-slate-600 text-sm leading-relaxed m-0">
                    Cuidado con embargos encadenados. La nota simple no basta, audita la certificación de cargas a fondo.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-brand-300 transition-colors">
                  <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <HelpCircle size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Estado de ocupación</h3>
                  <p className="text-slate-600 text-sm leading-relaxed m-0">
                    Mucha vulnerabilidad oculta. Ten en cuenta que los plazos de lanzamiento en Madrid pueden superar los 12 meses ampliamente.
                  </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-brand-300 transition-colors">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <DollarSign size={24} />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-2">Deudas pendientes</h3>
                  <p className="text-slate-600 text-sm leading-relaxed m-0">
                    Por "afección real", asumes el año en curso y tres anteriores. Las comunidades céntricas pueden ocultar derramas altas.
                  </p>
                </div>
              </div>
              <div className="p-6 bg-brand-50 rounded-2xl mb-12 flex flex-col sm:flex-row items-center justify-between gap-6 border border-brand-100 shadow-sm">
                  <p className="text-brand-900 m-0 text-base font-medium">
                      No dejes tu inversión al azar. Automatiza el estudio registral y bloquea riesgos invisibles al instante.
                  </p>
                  <Link to={ROUTES.ANALIZAR_SUBASTA} className="whitespace-nowrap bg-brand-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-brand-700 transition-all shadow-md shadow-brand-500/20 text-base flex items-center gap-2 w-full sm:w-auto justify-center">
                     Analizar subasta en Madrid <Search size={18} />
                  </Link>
              </div>

              
<GuideMobileCTA />
<h2 id="rentabilidad" className="text-3xl font-bold mt-12 mb-6">Cómo calcular la rentabilidad de una subasta en Madrid</h2>
              <p className="mb-6">
                Para calcular correctamente la rentabilidad de una subasta en Madrid es estrictamente necesario incluir en tus números:
              </p>
              <ul className="list-disc pl-6 space-y-3 mb-8">
                <li>El <strong>precio de adjudicación</strong> (tu puja ganadora).</li>
                <li>Los <strong>impuestos (ITP)</strong>, que en la Comunidad de Madrid es del 6% con carácter general para segunda mano.</li>
                <li>El coste de la <strong>reforma</strong> o adecuación del inmueble.</li>
                <li>Las <strong>deudas previas u ocultas</strong> (IBI, cuotas de comunidad y cancelaciones en el <a href="https://www.registradores.org" target="_blank" rel="noopener nofollow" className="text-brand-600 hover:underline">Colegio de Registradores</a>).</li>
              </ul>

              <div className="bg-brand-50 border border-brand-100 p-8 rounded-2xl my-12">
                  <p className="text-brand-900 font-medium text-lg m-0 flex items-start gap-4">
                      <Calculator className="text-brand-600 shrink-0 mt-1" size={24} />
                      <span>Puedes estimar automáticamente la rentabilidad de tu operación utilizando nuestra <Link to={ROUTES.CALCULATOR} className="text-brand-700 font-bold hover:underline">calculadora de subastas judiciales gratis</Link>.</span>
                  </p>
              </div>

              <h2 id="ejemplo-calculo" className="text-3xl font-bold mt-12 mb-6">Ejemplo real de cálculo en Madrid</h2>
              <p>
                Para entender los números de una operación típica en la capital, veamos un esquema básico:
              </p>

              <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm my-8">
                <ul className="space-y-4 text-slate-700 font-medium list-none pl-0 m-0">
                    <li className="flex justify-between border-b border-slate-100 pb-3">
                        <span>Valor de mercado objetivo:</span> <span>240.000€</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-100 pb-3">
                        <span>Precio de remate (tu puja):</span> <span>150.000€</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-100 pb-3">
                        <span>Reforma estimada:</span> <span>30.000€</span>
                    </li>
                    <li className="flex justify-between border-b border-slate-100 pb-3">
                        <span>ITP Madrid (6%) + Honorarios:</span> <span>9.000€</span>
                    </li>
                    <li className="flex justify-between pt-4 font-bold text-lg text-slate-900 border-t items-center">
                        <span>Coste total de adquisición:</span> <span>189.000€</span>
                    </li>
                    <li className="flex justify-between text-brand-700 font-bold text-2xl mt-4 items-center bg-brand-50 p-4 rounded-xl">
                        <span>Beneficio potencial:</span> <span>51.000€</span>
                    </li>
                </ul>
              </div>

              <div className="bg-white border-2 border-brand-100 p-10 rounded-3xl my-12 shadow-sm text-center">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Calcula tu puja máxima sin riesgo</h3>
                  <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
                      Calcular tu límite (PMA) es la regla más importante. Usa nuestra herramienta para evitar dejarte llevar en la subasta.
                  </p>
                  <Link to={ROUTES.CALCULATOR} className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white font-bold py-4 px-10 rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/30 text-lg w-full sm:w-auto">
                      Calcular puja ahora <ArrowRight size={20} />
                  </Link>
              </div>

              <h2 id="faq" className="text-3xl font-bold mt-12 mb-6">Preguntas frecuentes sobre comprar piso en subasta en Madrid</h2>
              
              <div className="space-y-6 my-8">
                <div className="bg-white border border-slate-200 p-6 rounded-xl">
                  <h3 className="font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle size={20} className="text-brand-600 shrink-0" />
                    ¿Es posible visitar los pisos antes de participar en la subasta BOE?
                  </h3>
                  <p className="text-slate-600 m-0">
                    Casi nunca. Salvo excepciones muy concretas publicadas en el edicto, comprar en subasta implica hacerlo "a cuerpo cierto". Si el deudor reside en la vivienda, no tienes derecho a examinar su estado interior, lo que influye en tu cálculo de reforma.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 p-6 rounded-xl">
                  <h3 className="font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle size={20} className="text-brand-600 shrink-0" />
                    ¿La adjudicación bancaria de una subasta limpia todas las deudas?
                  </h3>
                  <p className="text-slate-600 m-0">
                    Bajo ningún concepto. Sólo se cancelan las deudas posteriores a la que ejecuta la subasta. Tú, como nuevo propietario, heredarás todas las cargas anteriores inscritas en la Seguridad Social o en el Registro, además del IBI y comunidad de forma subsidiaria.
                  </p>
                </div>

                <div className="bg-white border border-slate-200 p-6 rounded-xl">
                  <h3 className="font-bold text-lg text-slate-900 mb-2 flex items-center gap-2">
                    <HelpCircle size={20} className="text-brand-600 shrink-0" />
                    ¿Cuánto debo consignar para participar en subastas en Madrid?
                  </h3>
                  <p className="text-slate-600 m-0">
                    La consignación exigida es del 5% del valor de subasta, no de tu puja. Por tanto, es clave tener ese dinero bloqueado antes del cierre del portal oficial BOE. Si pierdes la subasta judicial, el propio Ministerio de Justicia te retorna los fondos sin penalización.
                  </p>
                </div>
              </div>

              <div className="my-16 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h2 id="analizar-correctamente" className="text-3xl font-bold mb-6 text-slate-900 border-b border-slate-100 pb-4">Cómo analizar una subasta en Madrid correctamente</h2>
                
                <p className="text-slate-700 mb-6 leading-relaxed">
                  Para tener éxito en el mercado de subastas de Madrid, la intuición no sirve. Necesitas auditar la operación de forma fría y profesional. La mayoría de postores se fijan en el descuento aparente y olvidan que están comprando "a cuerpo cierto", asumiendo deudas y ocupantes.
                </p>

                <h3 className="text-xl font-bold mb-3 text-slate-900">1. Analiza la Nota Simple y la Certificación de Cargas</h3>
                <p className="text-slate-700 mb-6 leading-relaxed">
                  El decreto de subasta solo te muestra la superficie. Debes descifrar registralmente si lo que compras es el pleno dominio o solo una parte proporcional, y qué embargos anteriores vas a tener que liquidar de tu bolsillo. No asumas que todas las deudas se borran con el remate.
                </p>

                <h3 className="text-xl font-bold mb-3 text-slate-900">2. Estima los costes ocultos</h3>
                <p className="text-slate-700 mb-6 leading-relaxed">
                  Suma siempre el pago del ITP (6% en Madrid), los posibles recibos impagados del IBI, las deudas de comunidad (vitales en edificios del centro), así como el coste de un procedimiento de desahucio y cerrajero en caso de estar la vivienda habitada por terceros.
                </p>

                <h3 className="text-xl font-bold mb-3 text-slate-900">3. Fija tu Precio Máximo (PMA) y no te desvíes</h3>
                <p className="text-slate-700 mb-8 leading-relaxed">
                  Calcula el valor real en Idealista o portales similares y aplica tu margen de rentabilidad. Una vez hecho esto y descontados los gastos, tendrás tu puja máxima absoluta. Si la subasta supera esa cifra, abandónala. Las emociones te harán pagar de más.
                </p>

                <div className="flex flex-col gap-4 mt-10 pt-8 border-t border-slate-100">
                  <Link 
                    to={ROUTES.ANALIZAR_SUBASTA} 
                    className="w-full flex items-center justify-center gap-2 bg-brand-600 text-white font-bold py-5 px-8 rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/30 text-lg"
                  >
                    Auditar un expediente real ahora <Search size={22} className="ml-1" />
                  </Link>
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

            {/* ÍNDICE DE CONTENIDOS (TOC) */}
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm mb-8">
                <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                    Índice de contenidos
                </h2>
                <ul className="space-y-2 list-none p-0 m-0">

                        <li>
                            <a href="#encontrar-subastas" className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent">
                                <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Dónde encontrar subastas judiciales en Madrid</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity group-hover:text-brand-500"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </a>
                        </li>
                        <li>
                            <a href="#que-mirar" className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent">
                                <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Qué mirar en las subastas de Madrid</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity group-hover:text-brand-500"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </a>
                        </li>
                        <li>
                            <a href="#rentabilidad" className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent">
                                <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Cómo calcular la rentabilidad de una subasta en Madrid</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity group-hover:text-brand-500"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </a>
                        </li>
                        <li>
                            <a href="#ejemplo-calculo" className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent">
                                <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Ejemplo real de cálculo en Madrid</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity group-hover:text-brand-500"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </a>
                        </li>
                        <li>
                            <a href="#faq" className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent">
                                <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Preguntas frecuentes sobre comprar piso en subasta en Madrid</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity group-hover:text-brand-500"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </a>
                        </li>
                        <li>
                            <a href="#analizar-correctamente" className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent">
                                <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Cómo analizar una subasta en Madrid correctamente</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity group-hover:text-brand-500"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </a>
                        </li>
                </ul>
            </div>


            

            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/20 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3" />
                <div className="relative z-10">
                  <span className="text-brand-300 text-xs font-bold uppercase tracking-widest mb-4 block">Herramienta Profesional</span>
                  <h3 className="font-serif text-2xl font-bold mb-4">No dejes tu inversión al azar</h3>
                  <p className="text-slate-300 mb-8 text-sm leading-relaxed">
                      La diferencia entre una operación rentable y una quiebra está en saber auditar el BOE y las cargas registrales.
                  </p>
                  <Link 
                      to={ROUTES.ANALIZAR_SUBASTA} 
                      className="block w-full bg-brand-600 text-white font-bold py-4 px-4 rounded-xl text-center hover:bg-brand-700 transition-all flex items-center justify-center gap-2"
                  >
                      Analizar ahora 👉
                  </Link>
                </div>
            </div>

            <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
                <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <BookOpen size={18} className="text-brand-600"/>
                    Guías Relacionadas
                </h4>
                <nav className="space-y-4">
                    <Link to={ROUTES.HOW_MUCH_TO_PAY} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Cuánto Pagar</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to={ROUTES.PROFITABILITY} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Calcular Rentabilidad</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to={ROUTES.ANALYSIS} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Cómo Analizar Subastas</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                     <Link to={ROUTES.RULE_70} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Regla del 70%</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    
                    
                    <Link to={ROUTES.BARCELONA} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Subastas en Barcelona</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to={ROUTES.VALENCIA} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Subastas en Valencia</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to={ROUTES.SEVILLA} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Subastas en Sevilla</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to={ROUTES.PROFITABILITY_CALC_GUIDE} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Calculadora Rentabilidad</span>
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

export default AuctionMadridGuide;
