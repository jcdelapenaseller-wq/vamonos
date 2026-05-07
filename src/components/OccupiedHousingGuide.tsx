import React, { useEffect, useState } from 'react';
import { GuideTOC } from './GuideTOC';
import { GuideMobileCTA } from './GuideMobileCTA';

import { CheckCircle,  Calendar, Clock, ChevronRight, AlertTriangle, ShieldAlert, Scale, Gavel, ArrowRight, BookOpen, Lock, Home, UserX, User, FileText  } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import SaaSCtaBlock from '@/components/SaaSCtaBlock';

const OccupiedHousingGuide: React.FC = () => {
  
  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const schemaDate = currentDate.toISOString();
  
  // State for read time
  const [readTime, setReadTime] = useState(3);

  // Images Updated - High Quality replacements
  const IMG_HERO = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200&h=630"; // Keys close up
  const IMG_LEGAL = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800&h=450"; // Signing contract / Legal papers
  const IMG_EVICTION = "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800&h=450"; // Gavel

  // Schema.org Article Structured Data
  const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
    
    "@type": "Article",
    "headline": "Vivienda Ocupada en Subasta: Riesgos Reales y Estrategia",
    "description": "¿Es rentable comprar vivienda ocupada en subasta? Analizamos los riesgos legales, plazos reales de desalojo y costes ocultos antes de pujar en el BOE.",
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
      "@id": "https://activosoffmarket.es/vivienda-ocupada-subasta/"
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
                              "name": "Vivienda Ocupada en Subasta: Riesgos y Desalojo",
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

    // SEO Optimization: Title (50-60 chars) & Description (140-155 chars)
    document.title = "Vivienda Ocupada en Subasta: Riesgos y Desalojo | Activos";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', "¿Es rentable comprar vivienda ocupada en subasta? Analizamos los riesgos legales, plazos reales de desalojo y costes ocultos antes de pujar en el BOE.");

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
                <span className="text-brand-700 bg-brand-50 px-2 py-1 rounded-md" aria-current="page">Vivienda Ocupada</span>
            </nav>
            
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-tight">
                Vivienda Ocupada en Subasta: <br/><span className="text-brand-700 italic">Riesgos Reales y Estrategia</span>
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
                    <span>6 min lectura</span>
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
                        alt="Llaves de vivienda ocupada"
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
                    El "miedo a la ocupación" es la principal barrera de entrada para el inversor particular en subastas. 
                    Sin embargo, comprar con ocupantes es, a menudo, la única forma de obtener rentabilidades de doble dígito. 
                    La clave no es evitar el problema, sino <strong>cuantificar el coste del desalojo</strong> antes de pujar.
                </p>

                <p>
                    Además del problema legal, la ocupación implica un problema de incertidumbre física: <Link to={ROUTES.VISIT} className="text-brand-700 font-bold hover:underline">casi nunca podrás visitar el inmueble</Link> antes de comprarlo. Debes asumir reforma integral en tus números.
                </p>

                {/* ENLACE CONTEXTUAL MEJORADO */}
                <div className="bg-brand-50 p-6 rounded-2xl border border-brand-100 my-10 not-prose flex gap-5 items-center hover:shadow-md transition-shadow">
                    <div className="bg-white p-3 rounded-full shadow-sm text-brand-600">
                        <BookOpen size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-brand-900 text-lg mb-1">¿Nuevo en subastas?</h4>
                        <Link to={ROUTES.GUIDE_PILLAR} className="text-brand-700 text-sm font-bold underline decoration-2 underline-offset-2 hover:text-brand-900 flex items-center gap-1">
                            Lee primero la Guía Técnica General <ArrowRight size={14}/>
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
                        <p className="leading-snug">El juzgado debe expulsarlos mediante 'lanzamiento'.</p>
                    </li><li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Tarda entre 6 y 18 meses adicionales.</p>
                    </li><li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Considera este plazo un coste oculto en tu ROI.</p>
                    </li>
                </ul>
            </div>
            
            <GuideTOC />
            
        
<h2 className="text-3xl mt-12 mb-6">Tipología de Ocupantes: No todos son iguales</h2>
                <p>
                    En el análisis jurídico de un expediente, lo primero que busco es la "Situación Posesoria". Jurídicamente, no es lo mismo echar a un antiguo propietario que a un inquilino protegido.
                </p>

                <div className="grid md:grid-cols-2 gap-6 my-10 not-prose">
                    <div className="bg-white p-8 rounded-2xl border-t-4 border-emerald-500 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-emerald-800 font-bold text-lg mb-3 flex items-center gap-2"><Gavel size={20}/> 1. El Ejecutado</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Es el antiguo propietario.
                            <br/><strong className="text-emerald-700">Riesgo: Bajo/Medio.</strong><br/>
                            El lanzamiento (desalojo) se solicita dentro del mismo procedimiento de ejecución (Art. 675 LEC). Es el proceso más ágil.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl border-t-4 border-amber-500 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-amber-800 font-bold text-lg mb-3 flex items-center gap-2"><UserX size={20}/> 2. El "Okupa"</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Tercero sin título ni derecho.
                            <br/><strong className="text-amber-700">Riesgo: Medio.</strong><br/>
                            Si se detecta tarde, puede requerir iniciar un nuevo pleito (desahucio por precario).
                        </p>
                    </div>
                </div>

                <h3 className="text-2xl mt-10 mb-4">3. El Inquilino con Contrato (La trampa)</h3>
                <p>
                    Aquí está el verdadero peligro. Si el ocupante presenta un contrato de alquiler:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8 not-prose">

                <div className="bg-white border text-left border-slate-200 p-6 rounded-2xl shadow-sm hover:border-brand-200 hover:shadow-md transition-all flex flex-col">
                    <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center pr-2 gap-2 text-balance leading-snug"><div className="w-2 h-2 rounded-full bg-brand-500 shrink-0"></div> Contrato Anterior a la Hipoteca</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Si es real y se paga renta, el adjudicatario se "come" el contrato. Te conviertes en casero.</p>
                </div>
                <div className="bg-white border text-left border-slate-200 p-6 rounded-2xl shadow-sm hover:border-brand-200 hover:shadow-md transition-all flex flex-col">
                    <h3 className="font-bold text-slate-900 text-lg mb-2 flex items-center pr-2 gap-2 text-balance leading-snug"><div className="w-2 h-2 rounded-full bg-brand-500 shrink-0"></div> Contrato Posterior</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">Se extingue con la ejecución, pero el inquilino puede intentar dilatar el proceso alegando vulnerabilidad.</p>
                </div>
</div>

                <figure className="my-14">
                    <div className="w-full h-64 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-200">
                        <FileText size={64} className="text-slate-300" />
                    </div>
                    <figcaption className="text-center text-sm text-slate-500 mt-3 font-medium italic">Distinguir un contrato real de uno simulado es vital.</figcaption>
                </figure>

                <h2 className="text-3xl mt-12 mb-6">El Proceso de Lanzamiento (Art. 675 LEC)</h2>
                <p>
                    Una vez eres adjudicatario (tienes el Decreto de Adjudicación), tienes <strong>un año</strong> para solicitar al juzgado la entrega de la posesión.
                </p>

                <div className="bg-slate-100 p-8 rounded-2xl my-8 border border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2 text-lg"><Clock size={22} className="text-brand-600"/> Tiempos Reales (2024/25)</h4>
                    <p className="m-0 text-slate-700 text-base leading-relaxed">
                        Aunque la ley marca plazos cortos, la saturación judicial hace que un lanzamiento de ejecutado tarde de <strong>4 a 9 meses</strong> de media. Si hay vulnerabilidad social acreditada, puede suspenderse temporalmente.
                    </p>
                </div>

                
<GuideMobileCTA />
<h2 className="text-3xl mt-12 mb-6">Costes Ocultos a calcular</h2>
                <ul className="bg-white border border-slate-200 rounded-xl p-6 space-y-4 list-none pl-0 shadow-sm">
                    <li className="flex gap-3">
                        <span className="text-brand-500 font-bold">•</span>
                        <span><strong>Abogado y Procurador:</strong> 1.500€ - 2.500€.</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="text-brand-500 font-bold">•</span>
                        <span><strong>Cerrajero:</strong> 300€ - 500€ (día del lanzamiento).</span>
                    </li>
                    <li className="flex gap-3">
                        <span className="text-brand-500 font-bold">•</span>
                        <span><strong>Lucro cesante:</strong> Meses sin poder vender/alquilar (IBI y Comunidad siguen corriendo).</span>
                    </li>
                </ul>

                <h2 className="text-3xl mt-12 mb-6">Conclusión Estratégica</h2>
                <p>
                    La estrategia ganadora es: <strong>Investigar &gt; Clasificar Ocupante &gt; Descontar Coste Desalojo &gt; Pujar.</strong>
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
                    <h3 className="font-serif text-2xl font-bold text-slate-900 mb-8">Preguntas Frecuentes sobre Ocupación</h3>
                    <div className="space-y-8">
                        <div>
                            <h4 className="font-bold text-slate-900 mb-2">¿Puedo negociar con el ocupante?</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">Sí, y suele ser lo más rentable. Ofrecer una cantidad económica ("llaves por dinero") a cambio de una salida voluntaria rápida ahorra meses de juzgado.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-900 mb-2">¿Qué pasa con los suministros?</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">No heredas las deudas personales de suministros, pero las compañías pueden poner trabas para el alta. A veces compensa pagar la deuda pequeña.</p>
                        </div>
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
                    Más Guías
                </h4>
                <nav className="space-y-4">
                    <Link to={ROUTES.GUIDE_PILLAR} className="block text-slate-600 hover:text-brand-700 text-sm py-2 border-b border-slate-100 hover:pl-2 transition-all">
                        Guía General de Subastas
                    </Link>
                    <Link to={ROUTES.ANALYSIS} className="block text-slate-600 hover:text-brand-700 text-sm py-2 border-b border-slate-100 hover:pl-2 transition-all">
                        Análisis Paso a Paso
                    </Link>
                    <Link to={ROUTES.CHARGES} className="block text-slate-600 hover:text-brand-700 text-sm py-2 border-b border-slate-100 hover:pl-2 transition-all">
                        Cargas: Qué se cancela
                    </Link>
                    <Link to={ROUTES.DEPOSIT} className="block text-slate-600 hover:text-brand-700 text-sm py-2 border-b border-slate-100 hover:pl-2 transition-all">
                        Depósito del 5%
                    </Link>
                    <Link to={ROUTES.ASSIGNMENT} className="block text-slate-600 hover:text-brand-700 text-sm py-2 border-b border-slate-100 hover:pl-2 transition-all">
                        Cesión de Remate
                    </Link>
                    <Link to={ROUTES.COMPARISON} className="block text-slate-600 hover:text-brand-700 text-sm py-2 border-b border-slate-100 hover:pl-2 transition-all">
                        Judicial vs AEAT
                    </Link>
                </nav>
            </div>
          </div>
        </aside>

      </div>

      <section className="bg-brand-900 py-20 border-t border-brand-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-8">
                Información es poder
            </h2>
            <Link to={ROUTES.PRO} className="inline-flex items-center gap-3 bg-brand-600 text-white font-bold py-4 px-10 rounded-xl hover:bg-brand-700 transition-transform hover:-translate-y-1 shadow-lg">Descubre nuestro modelo Premium <br/><span className="text-sm font-normal">Planes desde 19€</span></Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default OccupiedHousingGuide;