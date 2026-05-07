import React, { useEffect, useState } from 'react';
import { GuideTOC } from './GuideTOC';
import { GuideMobileCTA } from './GuideMobileCTA';

import { CheckCircle,  Calendar, Clock, ChevronRight, Briefcase, Gavel, ArrowRight, BookOpen, AlertTriangle, TrendingUp  } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const AuctionAssignmentGuide: React.FC = () => {
  
  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const schemaDate = currentDate.toISOString();
  
  // State for read time
  const [readTime, setReadTime] = useState(3);

  // IMÁGENES ÚNICAS Y EXCLUSIVAS (Política de no repetición)
  // 1. Hero: Acuerdo entre partes (Representa la Cesión). ID: 1556761175-5973dc0f32e7
  const IMG_HERO = "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200&h=630"; 
  
  // 2. Judicial: Balanza de la justicia (Diferente al mazo de otras guías). ID: 1589578527966-fdac0f44566c
  const IMG_JUDICIAL = "https://images.unsplash.com/photo-1589578527966-fdac0f44566c?auto=format&fit=crop&q=80&w=800&h=450";
  
  // 3. Estrategia: Análisis de datos y gráficos (Enfoque financiero). ID: 1460925895917-afdab827c52f
  const IMG_STRATEGY = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800&h=450";

  // Schema.org Structured Data
  const schemaData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "headline": "Cesión de remate en subastas judiciales: guía práctica",
        "description": "Descubre qué es la cesión de remate en subastas judiciales en España y cuándo puede interesarte estratégicamente.",
        "image": [IMG_HERO],
        "datePublished": "2023-11-20T09:00:00+01:00",
        "dateModified": schemaDate,
        "author": {
          "@type": "Person",
          "name": "José de la Peña",
          "url": "https://activosoffmarket.es/quien-soy"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Activos Off-Market",
          "logo": {
            "@type": "ImageObject",
            "url": "https://activosoffmarket.es/favicon.ico"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": "https://activosoffmarket.es/cesion-de-remate-subasta-judicial/"
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
            "name": "Guía Subastas",
            "item": "https://activosoffmarket.es/subastas-judiciales-espana/"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Cesión de Remate",
            "item": "https://activosoffmarket.es/cesion-de-remate-subasta-judicial/"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Siempre se puede ceder el remate?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No en todos los procedimientos ni en cualquier fase. Depende del tipo de ejecución y de los plazos procesales vigentes."
            }
          },
          {
            "@type": "Question",
            "name": "¿Genera impuestos la cesión de remate?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sí, puede generar obligaciones fiscales específicas (ITP) dependiendo de si hay beneficio en la cesión y de la comunidad autónoma."
            }
          },
          {
            "@type": "Question",
            "name": "¿Es habitual en subastas judiciales?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Es menos frecuente que la adjudicación directa, pero se utiliza recurrentemente en operaciones estratégicas de inversión profesional."
            }
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

    // Scroll to top on mount
    window.scrollTo(0, 0);

    // SEO Optimization: Title (50-60 chars) & Description (140-155 chars)
    document.title = "Cesión de Remate: Qué es y Cómo Funciona | Activos Off-Market";

    // Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', "Guía sobre la cesión de remate en subastas. Aprende a transmitir el derecho de adjudicación a un tercero, ahorrar impuestos y monetizar tu posición.");

    // Helper to set meta tags dynamically
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
    setMeta('og:title', 'Cesión de Remate: Qué es y Cómo Funciona');
    setMeta('og:description', 'Estrategia avanzada: transmite el derecho de adjudicación antes de la inscripción definitiva.');
    setMeta('og:image', IMG_HERO);
    setMeta('og:url', 'https://activosoffmarket.es/cesion-de-remate-subasta-judicial/');
    setMeta('og:site_name', 'Activos Off-Market');

    // Twitter
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
    canonical.setAttribute('href', "https://activosoffmarket.es/cesion-de-remate-subasta-judicial/");

    // Schema.org
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
                <span className="text-brand-700 bg-brand-50 px-2 py-1 rounded-md" aria-current="page">Cesión de Remate</span>
            </nav>
            
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-tight">
                Cesión de Remate en Subastas: <br/><span className="text-brand-700 italic">Qué es y cuándo interesa</span>
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
                        alt="Acuerdo de cesión de remate entre partes"
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
                    La <strong>cesión de remate</strong> es una figura jurídica poco conocida en el ámbito de las subastas judiciales en España. 
                    Permite que el adjudicatario inicial (quien ganó la puja) transmita su "derecho de adjudicación" a un tercero antes de formalizar la inscripción definitiva del inmueble en el Registro.
                </p>

                <div className="bg-brand-50 p-6 rounded-xl border-l-4 border-brand-500 my-8 not-prose">
                    <p className="text-brand-900 font-medium m-0 text-lg">
                        "Bien utilizada, puede ser una herramienta estratégica de alto valor. Mal entendida, puede generar conflictos procesales y riesgos jurídicos innecesarios."
                    </p>
                </div>

                
            {/* RESUMEN RÁPIDO */}
            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 md:p-8 mb-12 shadow-sm not-prose">
                <h3 className="text-brand-900 font-bold mb-4 flex items-center gap-2">
                    <CheckCircle size={20} className="text-brand-600" /> Resumen Rápido (TL;DR)
                </h3>
                <ul className="space-y-3">
                    <li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Permite transferir tu adjudicación a un tercero.</p>
                    </li><li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Es legal pero requiere aprobación del letrado.</p>
                    </li><li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Útil para evitar doble tributación.</p>
                    </li>
                </ul>
            </div>
            
            <GuideTOC />
            
        
<h2 className="text-3xl mt-12 mb-6">¿Qué es exactamente la cesión de remate?</h2>
                <p>
                    Es la posibilidad procesal de que quien ha resultado mejor postor en una <Link to={ROUTES.GUIDE_PILLAR} className="text-brand-700 underline decoration-1 underline-offset-2 hover:text-brand-900">subasta judicial</Link> ceda su posición a otra persona (física o jurídica) antes de que se dicte el decreto de adjudicación firme.
                </p>
                <p>
                    <strong>No es una reventa tradicional.</strong> Es una transmisión del derecho a adjudicarse el bien. El tercero (cesionario) pasa a ocupar la posición del adjudicatario original frente al juzgado.
                </p>

                <h2 className="text-3xl mt-12 mb-6">¿Cuándo está permitida?</h2>
                <p>
                    En el marco de una ejecución hipotecaria, la cesión de remate está expresamente prevista en la Ley de Enjuiciamiento Civil. Sin embargo, no es un derecho absoluto ni automático:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                    <li>Debe realizarse dentro del <strong>plazo procesal</strong> habilitado tras la aprobación del remate.</li>
                    <li>Requiere <strong>aceptación judicial</strong> y comparecencia (normalmente ante el Letrado de la Administración de Justicia).</li>
                    <li>Exige el cumplimiento estricto de los requisitos formales (identificación del cesionario, solvencia, etc.).</li>
                </ul>

                <figure className="my-14">
                    <img 
                        src={IMG_JUDICIAL} 
                        alt="Balanza de la justicia y procedimiento legal" 
                        width="800"
                        height="450"
                        loading="lazy"
                        className="w-full h-auto object-cover rounded-2xl shadow-lg border border-slate-100" 
                    />
                    <figcaption className="text-center text-sm text-slate-500 mt-3 font-medium italic">La comparecencia en el juzgado es obligatoria para formalizar la cesión.</figcaption>
                </figure>

                
<GuideMobileCTA />
<h2 className="text-3xl mt-12 mb-6">¿Qué implica económicamente?</h2>
                <p>
                    Para el cesionario (quien recibe el derecho), la operación implica asumir todas las cargas de la adjudicación original:
                </p>
                <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
                    <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><Briefcase size={20} className="text-brand-600"/> Obligaciones</h3>
                        <ul className="text-sm text-slate-600 space-y-2">
                            <li>Completar el precio del remate (restando el <Link to={ROUTES.DEPOSIT} className="text-brand-700 hover:underline">depósito ya consignado</Link>).</li>
                            <li>Pagar el Impuesto de Transmisiones Patrimoniales (ITP).</li>
                        </ul>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2"><TrendingUp size={20} className="text-brand-600"/> Oportunidad</h3>
                        <ul className="text-sm text-slate-600 space-y-2">
                            <li>El cedente puede obtener un margen de beneficio si existe un acuerdo económico privado por la cesión.</li>
                        </ul>
                    </div>
                </div>

                <h2 className="text-3xl mt-12 mb-6">Diferencia entre cesión de remate y compraventa posterior</h2>
                <p>
                    Muchos inversores confunden ambas figuras, pero sus implicaciones fiscales y temporales son opuestas:
                </p>
                <div className="overflow-x-auto my-8 not-prose">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-slate-100 border-b border-slate-200">
                                <th className="p-4 font-bold text-slate-900">Característica</th>
                                <th className="p-4 font-bold text-brand-700">Cesión de Remate</th>
                                <th className="p-4 font-bold text-slate-600">Compraventa Posterior</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-slate-100">
                                <td className="p-4 font-medium">Momento</td>
                                <td className="p-4">Antes de inscripción registral</td>
                                <td className="p-4">Tras inscripción a nombre del adjudicatario</td>
                            </tr>
                            <tr className="border-b border-slate-100">
                                <td className="p-4 font-medium">Objeto</td>
                                <td className="p-4">Derecho procesal</td>
                                <td className="p-4">Propiedad del inmueble</td>
                            </tr>
                            <tr className="border-b border-slate-100">
                                <td className="p-4 font-medium">Costes</td>
                                <td className="p-4">Menores (una sola transmisión)</td>
                                <td className="p-4">Dobles (ITP adjudicación + ITP venta)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h2 className="text-3xl mt-12 mb-6">¿Cuándo puede ser interesante?</h2>
                <p>
                    Esta figura no es para improvisar, pero resulta muy útil en escenarios concretos:
                </p>
                <ul className="space-y-4 list-none pl-0 my-6">
                    <li className="flex gap-3">
                        <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20}/>
                        <span><strong>Intermediación:</strong> El adjudicatario actúa como "conseguidor" profesional y cede el activo a un inversor final.</span>
                    </li>
                    <li className="flex gap-3">
                        <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20}/>
                        <span><strong>Liquidez Inmediata:</strong> Se detecta un comprador interesado antes de tener que desembolsar el total del precio.</span>
                    </li>
                    <li className="flex gap-3">
                        <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20}/>
                        <span><strong>Optimización Fiscal:</strong> Evita la doble tributación de una compraventa sucesiva rápida.</span>
                    </li>
                </ul>

                <h2 className="text-3xl mt-12 mb-6">Riesgos Frecuentes</h2>
                <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-xl my-6 not-prose">
                    <h3 className="text-red-900 font-bold mb-2 flex items-center gap-2"><AlertTriangle size={20}/> ¡Cuidado!</h3>
                    <ul className="list-disc pl-5 space-y-1 text-red-800 text-sm">
                        <li>No respetar los plazos procesales puede anular la cesión.</li>
                        <li>No formalizar correctamente ante el juzgado deja al cedente como responsable único.</li>
                        <li>Si existen <Link to={ROUTES.CHARGES} className="text-red-900 underline font-bold">cargas anteriores</Link>, el cesionario se las "come" igual que el adjudicatario original.</li>
                    </ul>
                </div>

                <figure className="my-14">
                    <img 
                        src={IMG_STRATEGY} 
                        alt="Análisis estratégico y financiero de la operación" 
                        width="800"
                        height="450"
                        loading="lazy"
                        className="w-full h-auto object-cover rounded-2xl shadow-lg border border-slate-100" 
                    />
                </figure>

                <h2 className="text-3xl mt-12 mb-6">Estrategia antes de plantear una cesión</h2>
                <p>
                    Antes de comprometerte a ceder un remate, confirma la viabilidad jurídica del expediente. Debes tener muy claros los números, incluyendo la posible <Link to={ROUTES.RULE_70} className="text-brand-700 underline decoration-1 underline-offset-2 hover:text-brand-900">regla del 70%</Link> para saber si la adjudicación será firme o provisional.
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
                          <span className="text-lg pr-4">¿Cuáles son los beneficios fiscales de la cesión de remate en subastas?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-justify">
                          Comprar mediante cesión de remate (cuando un banco cede su posición de ganador a un inversor) evita el doble pago de impuestos (ITP o AJD). La transmisión se realiza directamente al cesionario, abaratando los costes notariales y tributarios aplicables.
                      </div>
                  </details>
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all shadow-sm">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          <span className="text-lg pr-4">¿Qué margen temporal tengo para negociar una cesión con el banco ejecutante?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-justify">
                          Generalmente se cuenta con el plazo de 20 a 40 días hábiles que discurren desde el remate hasta la emisión del Decreto de Adjudicación. Los fondos buitre (gestores de NPLs) son las entidades con mayor volumen de activos susceptibles de cesión de remate en España.
                      </div>
                  </details>
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all shadow-sm">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          <span className="text-lg pr-4">¿Existen riesgos ocultos al aceptar una cesión de remate hipotecaria?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-justify">
                          Sí, asumes el inmueble en su estado jurídico y físico. Las cargas inscritas con anterioridad a la hipoteca ejecutada (IBI, deudas vecinales preferentes e hipotecas de menor rango) subsistirán y pasarán a ser tu responsabilidad monetaria directa tras la adquisición.
                      </div>
                  </details>
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all shadow-sm">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          <span className="text-lg pr-4">¿Puedo asegurar mi dinero al comprar NPLs y cesiones bancarias?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-justify">
                          Se recomienda que toda transacción y arras penitenciales se condicionen explícitamente a la aprobación judicial del remate. Se aconseja actuar con abogados especializados para evitar el riesgo de perder el capital si el juzgado retrasa o bloquea la inscripción.
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
                    <Link to={ROUTES.ANALYSIS} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Análisis Paso a Paso</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to={ROUTES.DEPOSIT} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Depósito del 5%</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to={ROUTES.RULE_70} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Regla del 70%</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                     <Link to={ROUTES.CHARGES} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Cargas y Deudas</span>
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

export default AuctionAssignmentGuide;