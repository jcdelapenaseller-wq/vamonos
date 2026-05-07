import React, { useEffect, useState } from 'react';
import { GuideTOC } from './GuideTOC';
import { GuideMobileCTA } from './GuideMobileCTA';

import { CheckCircle,  Calendar, Clock, ChevronRight, AlertTriangle, Scale, ArrowRight, BookOpen, AlertOctagon, Coins, XCircle, FileText  } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import SaaSCtaBlock from '@/components/SaaSCtaBlock';

const AuctionChargesGuide: React.FC = () => {
  
  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const schemaDate = currentDate.toISOString();
  
  // State for read time
  const [readTime, setReadTime] = useState(3);

  // Images Updated - Stable Assets
  const IMG_HERO = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=1200&h=630";
  const IMG_REGISTRY = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800&h=450"; 
  const IMG_MONEY = "https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=800&h=450";

  // Schema.org Article Structured Data
  const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
    
    "@type": "Article",
    "headline": "Cargas en Subasta Judicial: Qué se Cancela y Qué No",
    "description": "Descubre qué cargas se cancelan en una subasta judicial (purga) y cuáles subsisten. Evita heredar hipotecas anteriores y deudas ocultas al adjudicarte.",
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
      "@id": "https://activosoffmarket.es/cargas-subasta-judicial-cancelacion/"
    }
  },
        {
          "@type": "FAQPage",
          "mainEntity": [
                    {
                              "@type": "Question",
                              "name": "¿Cómo sé cuánto se debe de hipoteca anterior?",
                              "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "La nota simple dice el principal original, no la deuda actual. El juzgado a veces lo certifica, pero a menudo es una incógnita que debes investigar."
                              }
                    },
                    {
                              "@type": "Question",
                              "name": "¿Qué ocurre con las deudas de la Comunidad de Propietarios?",
                              "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Por la Ley de Propiedad Horizontal, el nuevo propietario responde de la deuda del año en curso y los tres naturales anteriores. Tienes que pagarlo sí o sí, aunque no aparezca en el Registro de la Propiedad."
                              }
                    },
                    {
                              "@type": "Question",
                              "name": "¿Las deudas de IBI se cancelan?",
                              "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "No. El IBI tiene la consideración de hipoteca legal tácita por el año en curso y el inmediatamente anterior. En la práctica, te tocará asumir las deudas pendientes de IBI con el Ayuntamiento."
                              }
                    },
                    {
                              "@type": "Question",
                              "name": "¿Qué significa purgar las cargas posteriores?",
                              "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Consiste en la cancelación en el Registro de la Propiedad de todas las cargas, embargos y anotaciones preventivas que sean posteriores a la carga que origina y ejecuta la subasta."
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
                               "name": "Cargas en Subasta Judicial: Qué se Cancela y Qué No",
                               "item": "https://activosoffmarket.es/guia/"
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
    document.title = "Cargas en Subasta Judicial: Qué se Cancela y Qué No | Activos";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', "Descubre qué cargas se cancelan en una subasta judicial (purga) y cuáles subsisten. Evita heredar hipotecas anteriores y deudas ocultas al adjudicarte.");
    
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
                <Link to="/" className="hover:text-brand-600 transition-colors">Inicio</Link>
                <ChevronRight size={14} />
                <Link to="/subastas-judiciales-espana" className="hover:text-brand-600 transition-colors">Guía Subastas</Link>
                <ChevronRight size={14} />
                <span className="text-brand-700 bg-brand-50 px-2 py-1 rounded-md" aria-current="page">Cargas y Deudas</span>
            </nav>
            
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-tight">
                Qué cargas se cancelan en subasta <br/><span className="text-brand-700 italic">(y cuáles pagas tú)</span>
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
                        alt="Análisis de cargas"
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
                    Uno de los mayores errores al invertir en subastas judiciales es pensar que <strong>“todas las deudas desaparecen”</strong> al ganar la puja. 
                    No es así. Al adjudicar un inmueble, algunas cargas se cancelan automáticamente, pero otras pueden mantenerse y convertirse en tu responsabilidad.
                </p>

                <div className="bg-brand-50 p-8 rounded-2xl border-l-4 border-brand-500 my-10 shadow-sm">
                    <p className="text-brand-900 font-medium text-lg italic m-0">
                        "Un descuento del 40% en subasta puede convertirse en pérdidas totales si heredas una hipoteca preferente que no viste."
                    </p>
                </div>

                <div className="my-8 p-6 bg-brand-50 border border-brand-100 rounded-2xl">
                    <p className="text-brand-900 font-medium m-0">Puedes calcular rápidamente la rentabilidad usando esta <Link to={ROUTES.CALCULATOR} className="text-brand-700 underline font-bold hover:text-brand-900">calculadora de subastas judiciales</Link>.</p>
                </div>

                <div className="my-12 not-prose bg-slate-50 border border-slate-200 rounded-2xl p-6 flex items-center gap-5">
                    <div className="bg-white p-3 rounded-full shadow-sm text-brand-600 border border-slate-100">
                         <BookOpen size={24} />
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Contexto Básico</span>
                        <Link to="/subastas-judiciales-espana" className="block text-brand-700 font-bold text-lg hover:underline decoration-2 underline-offset-2">
                            Lee primero la Guía Técnica General →
                        </Link>
                    </div>
                </div>

                
            {/* RESUMEN RÁPIDO */}
            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 md:p-8 mb-12 shadow-sm not-prose">
                <h3 className="text-brand-900 font-bold mb-4 flex items-center gap-2">
                    <CheckCircle size={20} className="text-brand-600" /> Resumen Rápido (TL;DR)
                </h3>
                <ul className="space-y-3">
                    <li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Las deudas anteriores o preferentes NO se borran.</p>
                    </li><li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Pide siempre Certificación de Cargas.</p>
                    </li><li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Ignorar este paso es el mayor error del inversor novato.</p>
                    </li>
                </ul>
            </div>
            
            <GuideTOC />
            
            <h2 className="text-3xl mt-12 mb-6">Cargas que se cancelan (Lo bueno)</h2>
                <p>
                    En una ejecución estándar, rige el principio de <strong>purga de cargas posteriores</strong> (Art. 674 LEC). El juzgado ordenará cancelar:
                </p>
                <ul className="grid grid-cols-1 gap-4 list-none pl-0 my-6 not-prose">
                    <li className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center gap-4">
                        <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
                        <span className="font-medium text-green-900">La hipoteca o embargo que se ejecuta (la del banco que subasta).</span>
                    </li>
                    <li className="bg-green-50 p-4 rounded-xl border border-green-100 flex items-center gap-4">
                        <CheckCircle size={24} className="text-green-600 flex-shrink-0" />
                        <span className="font-medium text-green-900">Todas las cargas inscritas DESPUÉS (posteriores en rango).</span>
                    </li>
                </ul>

                <figure className="my-14">
                    <img 
                        src={IMG_REGISTRY} 
                        alt="Revisión de documentación técnica" 
                        width="800"
                        height="450"
                        loading="lazy"
                        className="w-full h-auto object-cover rounded-2xl shadow-lg" 
                    />
                    <figcaption className="text-center text-sm text-slate-500 mt-3 font-medium italic">La fecha de inscripción en el Registro determina qué se borra.</figcaption>
                </figure>

                <h2 className="text-3xl mt-12 mb-6">Cargas que NO se cancelan (El peligro)</h2>
                <p>
                    Aquí es donde se pierde dinero. Según el <strong>Art. 668 de la Ley de Enjuiciamiento Civil</strong>, el adjudicatario acepta la subsistencia de las cargas anteriores y preferentes, subrogándose en la responsabilidad de las mismas:
                </p>

                <div className="space-y-6 my-8 not-prose">
                    <div className="flex gap-4 p-5 bg-white border-l-4 border-red-500 rounded-r-xl shadow-sm">
                        <AlertTriangle className="text-red-500 flex-shrink-0 mt-1" size={24} />
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">1. Cargas Anteriores</h3>
                            <p className="text-slate-600 text-sm mt-1">Si hay una hipoteca del año 2005 y se ejecuta un embargo del 2010, la hipoteca de 2005 se queda. Tendrás que pagarla.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-5 bg-white border-l-4 border-amber-500 rounded-r-xl shadow-sm">
                        <AlertOctagon className="text-amber-500 flex-shrink-0 mt-1" size={24} />
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">2. Deudas "Invisibles"</h3>
                            <div className="text-slate-600 text-sm mt-2 space-y-2">
                                <p><strong>Comunidad de Propietarios:</strong> El inmueble responde legalmente de las cuotas impagadas correspondientes a la anualidad en curso y a las tres anualidades anteriores. No importa que la deuda no esté en el Registro.</p>
                                <p><strong>IBI (Impuesto de Bienes Inmuebles):</strong> El Ayuntamiento tiene una hipoteca legal tácita sobre el inmueble por el año corriente y el anterior. Las deudas de años anteriores (hasta 4 por prescripción) subsisten como carga real si hay afección fiscal.</p>
                            </div>
                        </div>
                    </div>
                </div>

                
<GuideMobileCTA />
<h2 className="text-3xl mt-12 mb-6">Ejemplo práctico de Ruina</h2>
                <div className="bg-slate-900 text-white p-10 rounded-3xl my-8 not-prose shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800 rounded-full blur-3xl opacity-50 -mr-10 -mt-10"></div>
                    
                    <div className="flex justify-between items-end border-b border-slate-700 pb-4 mb-6 relative z-10">
                        <span className="text-slate-400 text-sm uppercase tracking-wide font-bold">Valor de Tasación</span>
                        <span className="text-3xl font-bold">200.000 €</span>
                    </div>
                    <div className="space-y-4 mb-8 relative z-10 text-lg">
                        <div className="flex justify-between text-red-300 border-b border-slate-800 pb-2 border-dashed">
                            <span>1. Hipoteca Anterior (Subsiste)</span>
                            <span className="font-mono">- 80.000 €</span>
                        </div>
                        <div className="flex justify-between text-green-400 border-b border-slate-800 pb-2 border-dashed">
                            <span>2. Embargo Ejecutado (Se borra)</span>
                            <span className="font-mono">- 40.000 €</span>
                        </div>
                        <div className="flex justify-between text-green-400">
                            <span>3. Embargo Posterior (Se borra)</span>
                            <span className="font-mono">- 15.000 €</span>
                        </div>
                    </div>
                    <div className="pt-6 border-t border-slate-700 relative z-10 bg-slate-800/50 p-4 rounded-xl">
                        <p className="text-sm text-slate-300 mb-2">Si pujas 100.000 € y ganas:</p>
                        <p className="font-bold text-xl text-white">Coste total = 100k (puja) + 80k (carga anterior) = <span className="text-yellow-400">180.000 €</span></p>
                    </div>
                </div>

                <div className="bg-red-50 border border-red-100 p-6 rounded-2xl mb-8 not-prose">
                    <p className="text-red-900 font-bold mb-4 flex items-center gap-2 italic">
                         “Esto ocurre todos los días en subastas BOE”
                    </p>
                    <Link 
                        to={ROUTES.PRO} 
                        className="inline-flex items-center justify-center w-full bg-brand-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-brand-700 transition-all shadow-lg group"
                    >
                        Analizar cargas antes de pujar
                        <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <figure className="my-14">
                    <img 
                        src={IMG_MONEY} 
                        alt="Calculadora financiera" 
                        width="800"
                        height="450"
                        loading="lazy"
                        className="w-full h-auto object-cover rounded-2xl shadow-lg border border-slate-100 bg-slate-100" 
                    />
                </figure>

                <h2 className="text-3xl mt-12 mb-6">Estrategia antes de pujar</h2>
                <div className="bg-slate-900 text-white p-6 rounded-2xl mb-8 not-prose border-l-4 border-brand-500">
                    <div className="flex items-start gap-4">
                        <div className="bg-brand-500/20 p-2 rounded-lg">
                            <Scale size={24} className="text-brand-400" />
                        </div>
                        <div>
                            <span className="block text-brand-400 text-xs font-bold uppercase tracking-widest mb-1">Regla profesional</span>
                            <p className="text-lg font-bold m-0 italic">"Nunca pujar sin nota simple analizada"</p>
                        </div>
                    </div>
                </div>
                <p>
                    Nunca confíes solo en el BOE. Solicita siempre una <strong>Nota Simple actualizada</strong> al Registro de la Propiedad antes de mover un dedo.
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
                          <span className="text-lg pr-4">¿Cómo afecta al cálculo de la rentabilidad la subsistencia de deudas anteriores?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-justify">
                          Toda carga previa (anotaciones, hipotecas o embargos anteriores en fecha registral al crédito que se ejecuta) subsiste (Art. 668 LEC) y debes sumarla a tu coste de adquisición. Esto implica que la cantidad a desembolsar no finaliza con tu puja al BOE y debes añadir ese importe para evitar la ruina financiera.
                      </div>
                  </details>
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all shadow-sm">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          <span className="text-lg pr-4">¿Es el juzgado responsable de avisarme de impagos o deudas fiscales?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-justify">
                          No, operar en subastas exige responsabilidad de investigación privada ("caveat emptor"). El edicto o portal del BOE a veces tienen Certificaciones desactualizadas. Tú eres el único responsable de actualizar la información sobre IVTM, IRPF vinculado, IBI, u otras deudas y tasas registrales.
                      </div>
                  </details>
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all shadow-sm">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          <span className="text-lg pr-4">¿Las deudas de la Comunidad de Propietarios quedan eliminadas con la purga judicial?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-justify">
                          Bajo la Ley de Propiedad Horizontal española, el adjudicatario responde civilmente por las cuotas comunitarias impagadas que corresponden al año en curso de la adquisición y a los tres años naturales inmediatamente anteriores (la afección real frente a terceros adquirientes).
                      </div>
                  </details>
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all shadow-sm">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          <span className="text-lg pr-4">¿En qué beneficia al adjudicatario la purga de cargas posteriores y mandamiento de cancelación?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-justify">
                          La purga libera la finca. Te aseguras de recibir el inmueble limpio de todos los embargos y garantías inscritas más tarde (posteriores registralmente) de la carga que motivó la subasta, permitiendo adquirir a precio reducido pisos bancarios o activos problemáticos para posterior rentabilidad o 'House Flipping'.
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

            {/* SATELLITE NAVIGATION ADDED */}
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
                    <Link to="/vivienda-ocupada-subasta-judicial" className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Vivienda Ocupada</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to="/deposito-subasta-judicial-5-por-ciento" className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Depósito 5%: Riesgos</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                     <Link to="/cesion-de-remate-subasta-judicial" className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Cesión de Remate</span>
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

export default AuctionChargesGuide;
