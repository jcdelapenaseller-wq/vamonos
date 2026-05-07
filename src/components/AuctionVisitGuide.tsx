import React, { useEffect, useState } from 'react';
import { GuideTOC } from './GuideTOC';
import { GuideMobileCTA } from './GuideMobileCTA';

import { CheckCircle,  Calendar, Clock, ChevronRight, EyeOff, Search, Home, AlertTriangle, ShieldCheck, DoorClosed, Footprints, Eye, Lock, ArrowRight, BookOpen  } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import SaaSCtaBlock from '@/components/SaaSCtaBlock';

const AuctionVisitGuide: React.FC = () => {
  
  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const schemaDate = currentDate.toISOString();
  
  // State for read time
  const [readTime, setReadTime] = useState(3);

  // Imágenes seleccionadas (Unsplash IDs estables)
  const IMG_HERO = "https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80&w=1200&h=630"; // Puerta cerrada / Llaves
  const IMG_INSPECTION = "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=800&h=450"; // Inspección / Lupa
  const IMG_NEIGHBORHOOD = "https://images.unsplash.com/photo-1444723121867-c61e74e36b1f?auto=format&fit=crop&q=80&w=800&h=450"; // Calle / Vecindario

  // Schema.org Article Structured Data
  const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
    
    "@type": "Article",
    "headline": "¿Se Puede Visitar un Inmueble en Subasta Judicial? (Guía Realista 2025)",
    "description": "Descubre si es posible visitar una vivienda en subasta judicial, cuándo se permite y cómo evaluar el riesgo si no puedes acceder al inmueble.",
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
      "@id": "https://activosoffmarket.es/visitar-inmueble-subasta-judicial/"
    }
  },
        {
          "@type": "FAQPage",
          "mainEntity": [
                    {
                              "@type": "Question",
                              "name": "¿Puedo pedir las llaves al juzgado antes de la subasta?",
                              "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "No. El juzgado no tiene las llaves hasta que se ha consumado la subasta, se ha dictado adjudicación y se ejecuta el lanzamiento."
                              }
                    },
                    {
                              "@type": "Question",
                              "name": "¿Qué pasa si al entrar está destrozado?",
                              "acceptedAnswer": {
                                        "@type": "Answer",
                                        "text": "Es tu responsabilidad. No puedes reclamar ni devolver el bien. Por eso siempre debes presupuestar el \"peor escenario\" posible en tu puja."
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
                              "name": "¿Se Puede Visitar un Inmueble en Subasta Judicial?",
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

    // SEO
    document.title = "¿Se Puede Visitar un Inmueble en Subasta Judicial? | BOE 2025";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', "Descubre si es posible visitar una vivienda en subasta judicial, cuándo se permite y cómo evaluar el riesgo si no puedes acceder al inmueble.");
    }
    window.scrollTo(0, 0);

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
      
      {/* HEADER */}
      <header className="bg-white pb-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
            <nav className="flex items-center text-sm text-slate-500 mb-8 font-medium flex-wrap gap-2" aria-label="Breadcrumb">
                <Link to={ROUTES.HOME} className="hover:text-brand-600 transition-colors">Inicio</Link>
                <ChevronRight size={14} />
                <Link to={ROUTES.GUIDE_PILLAR} className="hover:text-brand-600 transition-colors">Guía Subastas</Link>
                <ChevronRight size={14} />
                <span className="text-brand-700 bg-brand-50 px-2 py-1 rounded-md" aria-current="page">Visitar Inmueble</span>
            </nav>
            
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-tight">
                ¿Se Puede Visitar un Inmueble en <br/>
                <span className="text-brand-700 italic">Subasta Judicial? (Guía Realista 2025)</span>
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
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md" 
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
        
        {/* MAIN CONTENT */}
        <main className="lg:col-span-8">
            <article className="prose prose-lg prose-slate prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900 prose-p:leading-loose text-left max-w-5xl space-y-6 leading-relaxed prose-p:max-w-3xl prose-headings:max-w-3xl prose-li:max-w-3xl">
                
                <figure className="mb-12 -mt-6">
                    <img 
                        src={IMG_HERO} 
                        alt="Puerta cerrada de vivienda en subasta judicial"
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
                    Es la pregunta más frecuente de todo inversor novato: <em>"¿Puedo ir a ver el piso antes de pujar?"</em>. 
                    La respuesta corta y honesta es: <strong>No, en el 95% de los casos no es posible visitar el inmueble</strong>.
                </p>
                
                <p>
                    A diferencia de una compraventa tradicional donde visitas la casa varias veces con la inmobiliaria, en el mercado de subastas del BOE compras "a ciegas" respecto al estado interior. No obstante, "a ciegas" no significa sin información. Existen métodos para reducir la incertidumbre.
                </p>

                <div className="bg-brand-50 p-6 rounded-xl border-l-4 border-brand-500 my-8 not-prose flex gap-4 items-start">
                    <EyeOff className="text-brand-600 flex-shrink-0 mt-1" size={24} />
                    <div>
                        <h3 className="font-bold text-brand-900 mb-1">Principio de "Cuerpo Cierto"</h3>
                        <p className="text-brand-800 m-0 text-sm leading-relaxed">
                            Jurídicamente, en subasta compras el bien como "cuerpo cierto". Asumes su estado físico y jurídico tal cual está. Si al abrir la puerta no hay cocina o las tuberías están rotas, no puedes reclamar al juzgado.
                        </p>
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
                        <p className="leading-snug">El BOE no enseña los pisos por dentro.</p>
                    </li><li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Hay tácticas para averiguar el estado y ocupación.</p>
                    </li><li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Nunca pujes sin haber ido a la puerta del inmueble.</p>
                    </li>
                </ul>
            </div>
            
            <GuideTOC />
            
        
<h2 className="text-3xl mt-12 mb-6">Por qué no se puede visitar</h2>
                <p>
                    La vivienda subastada suele estar ocupada por el deudor (que va a perder su casa) o por inquilinos. El juzgado no tiene las llaves hasta que se ejecuta el lanzamiento (desalojo), lo cual ocurre meses después de la subasta.
                </p>
                <p>
                   Aunque la Ley de Enjuiciamiento Civil (LEC) prevé en su artículo 669 que el tribunal podrá acordar la inspección del inmueble si el ejecutado lo consiente, en la práctica:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                    <li>El ejecutado casi nunca consiente (por motivos obvios).</li>
                    <li>Los juzgados están saturados y no organizan visitas.</li>
                    <li>No hay agentes inmobiliarios intermediando.</li>
                </ul>

                <h2 className="text-3xl mt-12 mb-6">La excepción: Cuándo SÍ se puede ver</h2>
                <p>
                    Existen casos excepcionales, que suelen ser "unicornios" en el BOE, pero ocurren:
                </p>
                <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <DoorClosed size={20} className="text-green-600"/> Inmuebles Vacíos y en Posesión
                        </h3>
                        <p className="text-sm text-slate-600">
                            A veces, si el procedimiento es una liquidación concursal (empresa) o si el banco ya tomó posesión previamente, las llaves pueden estar en el juzgado o en manos del administrador concursal, quien sí organiza visitas.
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                            <ShieldCheck size={20} className="text-brand-600"/> Colaboración del Ejecutado
                        </h3>
                        <p className="text-sm text-slate-600">
                            Si el deudor quiere vender rápido para saldar la deuda (y quizás quedarse con el sobrante), podría acceder a enseñar la casa. Es muy raro, pero posible.
                        </p>
                    </div>
                </div>

                <figure className="my-12">
                    <img 
                        src={IMG_INSPECTION} 
                        alt="Inspección visual exterior"
                        width="800"
                        height="450"
                        className="rounded-2xl shadow-lg w-full object-cover"
                    />
                    <figcaption className="text-center text-sm text-slate-500 mt-2">La inspección exterior es obligatoria para cualquier inversor serio.</figcaption>
                </figure>

                
<GuideMobileCTA />
<h2 className="text-3xl mt-12 mb-6">Qué investigar si no puedes entrar</h2>
                <p>
                    Si no puedes ver el interior, debes convertirte en un detective inmobiliario. Tu objetivo es descartar la "ruina" y estimar el coste de reforma.
                </p>

                <div className="space-y-6 my-8 not-prose">
                    <div className="flex gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <div className="bg-slate-100 p-2 h-fit rounded-lg text-slate-700 font-bold"><Search size={20} /></div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">1. Visita Exterior y Vecindario</h3>
                            <p className="text-slate-600 text-sm mt-1">
                                ¿En qué estado está la fachada? ¿Hay luz en las ventanas por la noche? ¿El buzón está lleno de cartas? Habla con el portero o los vecinos; suelen ser la mejor fuente de información sobre quién vive allí y cómo está el piso.
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <div className="bg-slate-100 p-2 h-fit rounded-lg text-slate-700 font-bold"><Home size={20} /></div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">2. Antigüedad y Calidades</h3>
                            <p className="text-slate-600 text-sm mt-1">
                                Usa Google Street View y la Sede Electrónica del Catastro para ver el año de construcción. Si el edificio es de 1970 y no se ve reforma exterior, asume que las tuberías y electricidad son de origen.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <div className="bg-slate-100 p-2 h-fit rounded-lg text-slate-700 font-bold"><AlertTriangle size={20} /></div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">3. Estrategia de Costes</h3>
                            <p className="text-slate-600 text-sm mt-1">
                                En tu Excel de inversión, añade siempre una partida de <strong>"Reforma Integral"</strong> (aprox. 500-700€/m²). Si el piso está bien, será beneficio extra. Si está destrozado, ya lo tenías contemplado. Nunca asumas que está "para entrar a vivir".
                            </p>
                        </div>
                    </div>
                </div>

                <figure className="my-12">
                    <img 
                        src={IMG_NEIGHBORHOOD} 
                        alt="Entorno y vecindario del inmueble"
                        width="800"
                        height="450"
                        className="rounded-2xl shadow-lg w-full object-cover"
                    />
                    <figcaption className="text-center text-sm text-slate-500 mt-2">El estado de las zonas comunes (buzones, escalera) dice mucho del interior.</figcaption>
                </figure>

                <h2 className="text-3xl mt-12 mb-6">Conclusión</h2>
                <p>
                    No poder visitar el inmueble es la principal barrera de entrada para el gran público, y precisamente por eso existen los descuentos en las subastas. Es el "premio" por asumir ese riesgo.
                </p>
                <p>
                    Si no estás dispuesto a comprar sin ver, las subastas judiciales probablemente no sean para ti. Si aceptas el riesgo, mitígalo con información exterior y márgenes de seguridad amplios.
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

                {/* FAQ */}
                <section className="not-prose bg-slate-50 p-10 rounded-3xl border border-slate-200">
                    <h2 className="font-serif text-2xl font-bold text-slate-900 mb-8">Preguntas Frecuentes</h2>
                    <div className="space-y-8">
                        
                    <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all">
                        <summary className="cursor-pointer font-bold text-slate-900 p-5 list-none flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <span className="text-lg pr-4">¿Puedo pedir las llaves al juzgado antes de la subasta?</span>
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-open:bg-brand-100 transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-open:text-brand-600 transition-transform group-open:rotate-180"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                        </summary>
                        <div className="p-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                            <p>No. El juzgado no tiene las llaves hasta que se ha consumado la subasta, se ha dictado adjudicación y se ejecuta el lanzamiento.</p>
                        </div>
                    </details>
                        
                    <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all">
                        <summary className="cursor-pointer font-bold text-slate-900 p-5 list-none flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <span className="text-lg pr-4">¿Qué pasa si al entrar está destrozado?</span>
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 group-open:bg-brand-100 transition-colors">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 group-open:text-brand-600 transition-transform group-open:rotate-180"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                        </summary>
                        <div className="p-5 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100">
                            <p>Es tu responsabilidad. No puedes reclamar ni devolver el bien. Por eso siempre debes presupuestar el "peor escenario" posible en tu puja.</p>
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
                    <Link to={ROUTES.OCCUPIED} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Vivienda Ocupada</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to={ROUTES.ANALYSIS} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Análisis Paso a Paso</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to={ROUTES.GUIDE_PILLAR} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Guía General Subastas</span>
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

export default AuctionVisitGuide;