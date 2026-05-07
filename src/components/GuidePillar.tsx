import React, { useEffect, useState } from 'react';
import { Calendar, Clock, ChevronRight, ArrowRight, BookOpen, AlertTriangle, Lightbulb, Info, FileText, Scale, Landmark, MapPin, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import SaaSCtaBlock from '@/components/SaaSCtaBlock';

const GuidePillar: React.FC = () => {
  
  // Dynamic Date
  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const schemaDate = currentDate.toISOString();
  
  // State for read time
  const [readTime, setReadTime] = useState(3);

  // Images
  const IMG_FEATURED = "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=1200&h=630";
  const IMG_STEP_BY_STEP = "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800&h=450";

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
    document.title = "Subastas Judiciales en España (BOE) | Guía Completa para Invertir 2025";
    
    // Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', "Aprende cómo funcionan las subastas judiciales en España (BOE), riesgos reales, depósito del 5% y cómo encontrar oportunidades rentables.");
    }

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

    setMeta('og:title', "Subastas Judiciales en España (BOE) | Guía Completa para Invertir 2025");
    setMeta('og:description', "Aprende cómo funcionan las subastas judiciales en España (BOE), riesgos reales, depósito del 5% y cómo encontrar oportunidades rentables.");
    setMeta('og:type', "article");
    setMeta('og:url', "https://activosoffmarket.es/subastas-judiciales-espana/");
    setMeta('og:image', IMG_FEATURED);
    setMeta('og:site_name', "Activos Off-Market");

    // Schema.org Article Structured Data
    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
      
      "@type": "Article",
      "headline": "Subastas Judiciales en España (BOE): Guía Completa para Invertir",
      "description": "Aprende cómo funcionan las subastas judiciales en España (BOE), riesgos reales, depósito del 5% y cómo encontrar oportunidades rentables.",
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
      "image": [IMG_FEATURED],
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://activosoffmarket.es/subastas-judiciales-espana/"
      }
    },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "¿Puedo visitar el inmueble antes de pujar?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Por norma general, no. En subastas judiciales no hay visitas organizadas. Compras \"a ciegas\" en cuanto al estado interior. A veces, si el ejecutado colabora (muy raro), se puede pactar, pero debes asumir reforma integral en tus números."
              }
            },
            {
              "@type": "Question",
              "name": "¿Necesito abogado y procurador para participar?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Para participar y pujar, no es obligatorio. Puedes hacerlo tú mismo con tu certificado digital. Sin embargo, si surgen problemas procesales o necesitas pedir el lanzamiento (desalojo) posterior, sí necesitarás asistencia letrada."
              }
            },
            {
              "@type": "Question",
              "name": "¿Puedo pedir una hipoteca para pagar la subasta?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Es muy difícil y arriesgado. Tienes solo 40 días hábiles para pagar. Los bancos tradicionales no suelen financiar si no pueden tasar el interior o si no hay inscripción registral previa a tu nombre. Se recomienda tener liquidez propia o financiación alternativa."
              }
            },
            {
              "@type": "Question",
              "name": "¿Qué pasa si la vivienda tiene \"okupas\"?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Si son ocupantes sin título (precarios), puedes pedir el lanzamiento al mismo juzgado (Art. 675 LEC). El proceso tarda de 4 a 9 meses. Si tienen contrato de alquiler válido anterior a la hipoteca, tendrás que respetarlo hasta su fin."
              }
            },
            {
              "@type": "Question",
              "name": "¿Se devuelve el depósito si no gano?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Sí. El Portal de Subastas ordena la devolución automática a tu IBAN en cuanto finaliza la subasta, salvo que marques la casilla de \"reserva de postura\" (quedar en lista de espera)."
              }
            },
            {
              "@type": "Question",
              "name": "¿Cuánto dinero necesito tener ahorrado?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Además del precio de adjudicación, calcula un 10-12% extra para Impuesto de Transmisiones Patrimoniales (ITP), Notaría, Registro y posibles deudas de comunidad/IBI atrasadas."
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
                               "name": "Subastas Judiciales en España (BOE)",
                               "item": "https://activosoffmarket.es/subastas-judiciales-espana/"
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
      
      {/* HEADER SECTION */}
      <header className="bg-white pb-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
            <nav className="flex items-center text-sm text-slate-500 mb-8 font-medium flex-wrap gap-2" aria-label="Breadcrumb">
                <Link to={ROUTES.HOME} className="hover:text-brand-600 transition-colors">Inicio</Link>
                <ChevronRight size={14} />
                <Link to={ROUTES.GUIDE_HUB} className="hover:text-brand-600 transition-colors">Guías</Link>
                <ChevronRight size={14} />
                <span className="text-brand-700 bg-brand-50 px-2 py-1 rounded-md" aria-current="page">Subastas judiciales</span>
            </nav>

            <h1 className="font-serif text-4xl md:text-6xl font-bold text-slate-900 mb-8 leading-[1.1] tracking-tight">
                Subastas Judiciales en España (BOE): <br/>
                <span className="text-brand-700 italic">Guía Completa para Invertir con Seguridad</span>
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
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md" 
                    />
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-900 leading-none">José de la Peña</span>
                        <span className="text-xs text-brand-600 font-semibold mt-1 uppercase tracking-wide">Jurista & Analista de Inversión</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                    <Calendar size={14} />
                    <span className="capitalize font-medium">{currentMonthYear}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                    <Clock size={14} />
                    <span className="font-medium">{readTime} min lectura</span>
                </div>
            </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* MAIN CONTENT */}
        <main className="lg:col-span-8">
            <article className="prose prose-lg prose-slate prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900 prose-p:leading-loose prose-li: text-left max-w-5xl space-y-6 leading-relaxed prose-p:max-w-3xl prose-headings:max-w-3xl prose-li:max-w-3xl">
                
                {/* FEATURED IMAGE */}
                <figure className="mb-12 -mt-6">
                    <img 
                        src={IMG_FEATURED} 
                        alt="Análisis profesional de subastas judiciales en España"
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


                {/* CONTEXTUAL SEO LINK */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-10 text-sm text-slate-600 flex gap-4 items-start not-prose">
                     <Info className="text-brand-600 flex-shrink-0 mt-1" size={20} />
                     <div>
                         <p className="m-0 leading-relaxed">
                             <strong>Contexto:</strong> Las subastas judiciales son una categoría específica dentro del ecosistema general del <Link to={ROUTES.SUBASTAS_BOE} className="text-brand-700 font-bold hover:underline">Portal de Subastas del BOE</Link>. Si te pierdes con la terminología (adjudicación, remate, lanzamiento...), he preparado un <Link to={ROUTES.GLOSSARY} className="text-brand-700 font-bold hover:underline">Glosario de Subastas Judiciales</Link> donde explico cada concepto en detalle.
                         </p>
                     </div>
                </div>

                <SaaSCtaBlock />

                {/* INTRODUCCIÓN */}
                <p className="text-xl text-slate-700 leading-relaxed font-light mb-10 first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-brand-700 first-letter:mr-3 first-letter:float-left">
                    Invertir en subastas judiciales es, posiblemente, la vía más potente para adquirir patrimonio inmobiliario con descuentos del 30% al 50% en España. Sin embargo, <strong>no es un mercado para la improvisación</strong>. 
                </p>
                
                <p>
                   A diferencia de una compraventa ante notario, aquí no hay garantías de saneamiento por vicios ocultos y compras "a cuerpo cierto". <strong>Esta guía explica el funcionamiento del sistema y su marco normativo.</strong> Para ejecutar una compra real y seguir el proceso operativo detallado, te recomiendo seguir nuestra <Link to={ROUTES.COMO_COMPRAR} className="text-brand-700 font-bold hover:underline">guía paso a paso para comprar en subasta</Link>.
                </p>

                {/* H2: MARCO LEGAL */}
                <h2 id="marco-legal" className="text-3xl mt-16 mb-8 flex items-center gap-3">
                    <Scale className="text-brand-600" /> El Sistema de Ejecución Forzosa
                </h2>
                <p>
                    Las subastas judiciales en España no son un mercado libre, sino el último eslabón de un <strong>procedimiento de ejecución forzosa</strong> regulado primordialmente por la <strong>Ley de Enjuiciamiento Civil (LEC)</strong>. El objetivo del sistema es equilibrar la satisfacción de la deuda del acreedor con la protección de los derechos del deudor, utilizando el mercado como mecanismo de transparencia y objetividad.
                </p>
                <p>
                    Es vital distinguir entre los tres tipos principales de subastas según el organismo que las impulsa, ya que su seguridad jurídica y reglas de adjudicación varían significativamente:
                </p>

                <div className="grid gap-6 my-8 not-prose">
                    <div className="bg-white border-l-4 border-brand-600 p-6 rounded-r-xl shadow-sm">
                        <h3 className="font-bold text-slate-900 text-lg mb-2 text-brand-700 uppercase tracking-wide">1. Subasta Judicial (LEC)</h3>
                        <p className="text-slate-600 text-sm m-0">
                            Ordenada por un Juzgado Civil o Mercantil. Rige la Ley de Enjuiciamiento Civil. Es el marco más robusto porque ofrece una purga de cargas clara mediante mandamiento judicial, garantizando la titularidad libre de deudas posteriores.
                        </p>
                    </div>
                    <div className="bg-white border-l-4 border-slate-400 p-6 rounded-r-xl shadow-sm">
                        <h3 className="font-bold text-slate-900 text-lg mb-2 text-slate-700 uppercase tracking-wide">2. Subasta AEAT (Hacienda)</h3>
                        <p className="text-slate-600 text-sm m-0">
                            Procedimiento administrativo regulado por el Reglamento de Recaudación. Presenta diferencias críticas en la adjudicación y en la gestión de la posesión frente a la vía judicial.
                        </p>
                    </div>
                    <div className="bg-white border-l-4 border-slate-400 p-6 rounded-r-xl shadow-sm">
                        <h3 className="font-bold text-slate-900 text-lg mb-2 text-slate-700 uppercase tracking-wide">3. Subastas Directas y Notariales</h3>
                        <p className="text-slate-600 text-sm m-0">
                            Incluye convenios de realización o subastas ante notario por ejecuciones hipotecarias pactadas. Suelen tener plazos más ágiles pero requieren un análisis del título más exhaustivo.
                        </p>
                    </div>
                </div>

                {/* H2: FUNCIONAMIENTO SISTÉMICO */}
                <h2 id="funcionamiento" className="text-3xl mt-16 mb-8">El Ciclo de Vida de la Adjudicación Judicial</h2>
                <p>Desde una perspectiva sistémica, la subasta judicial no es solo un evento de pujas, sino una sucesión de hitos jurídicos que garantizan la transmisión de la propiedad libre de cargas posteriores.</p>

                <div className="bg-slate-100 rounded-3xl p-8 my-10 border border-slate-200 not-prose">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <Scale className="w-5 h-5 text-brand-600" /> 
                        Protocolo de Ejecución según la LEC
                    </h3>
                    <div className="space-y-6">
                        {/* Punto 1 */}
                        <div className="flex gap-4 border-b border-slate-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-brand-600 shadow-sm flex-shrink-0">1</div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg">Nacimiento del Título Ejecutivo</h4>
                                <p className="text-sm text-slate-600 leading-relaxed m-0">El juzgado ordena la subasta tras un impago (hipotecario o de otra índole). El <strong>Edicto de Subasta</strong> es el documento clave que define las condiciones de venta.</p>
                            </div>
                        </div>
                        {/* Punto 2 */}
                        <div className="flex gap-4 border-b border-slate-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-brand-600 shadow-sm flex-shrink-0">2</div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg">La Sala de Subastas del BOE</h4>
                                <p className="text-sm text-slate-600 leading-relaxed m-0">Fase de concurrencia pública de 20 días naturales. El sistema garantiza la igualdad de oportunidades mediante el anonimato de las pujas y la extensión automática en los últimos minutos.</p>
                            </div>
                        </div>
                        {/* Punto 3 */}
                        <div className="flex gap-4 border-b border-slate-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-brand-600 shadow-sm flex-shrink-0">3</div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg">Aprobación del Remate</h4>
                                <p className="text-sm text-slate-600 leading-relaxed m-0">No basta con ganar la puja. El Letrado de la Administración de Justicia (LAJ) debe dictar el Decreto de Adjudicación, previa verificación del cumplimiento de los tramos de precio (Art. 670 LEC).</p>
                            </div>
                        </div>
                        {/* Punto 4 */}
                        <div className="flex gap-4 border-b border-slate-200 pb-6 mb-6 last:border-0 last:pb-0 last:mb-0">
                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-brand-600 shadow-sm flex-shrink-0">4</div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg">Transmisión y Saneamiento</h4>
                                <p className="text-sm text-slate-600 leading-relaxed m-0">El proceso culmina con el <strong>Mandamiento de Cancelación de Cargas</strong>, que permite limpiar registralmente el inmueble de deudas posteriores a la que motivó la ejecución.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-200">
                        <Link 
                            to={ROUTES.COMO_COMPRAR} 
                            className="flex items-center justify-between bg-brand-600 text-white p-6 rounded-2xl hover:bg-brand-700 transition-all shadow-lg group"
                        >
                            <div className="pr-4">
                                <span className="text-brand-200 text-xs font-bold uppercase tracking-widest block mb-1">Guía Operativa</span>
                                <span className="text-lg font-bold text-white">¿Quieres comprar ahora? Mira el proceso paso a paso</span>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 bg-white/10 px-4 py-2 rounded-xl">
                                <span className="font-bold text-white text-sm">Ir al Tutorial</span>
                                <ArrowUpRight size={18} className="text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </div>
                        </Link>
                    </div>
                </div>

                <figure className="my-10">
                    <img 
                        src={IMG_STEP_BY_STEP} 
                        alt="Proceso de análisis de expediente judicial" 
                        width="800"
                        height="450"
                        loading="lazy"
                        className="w-full h-auto object-cover rounded-2xl shadow-lg" 
                    />
                </figure>

                {/* H2: RIESGOS REALES */}
                <h2 id="riesgos" className="text-3xl mt-16 mb-8 flex items-center gap-3">
                    <AlertTriangle className="text-amber-500" /> Riesgos reales de las subastas
                </h2>
                <p>
                    Invertir en subastas no es como comprar en Idealista. Aquí no hay agente inmobiliario que te enseñe el piso. Los riesgos existen y deben cuantificarse económicamente antes de pujar.
                </p>

                <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
                    <Link to={ROUTES.OCCUPIED} className="block group">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 h-full hover:border-brand-300 hover:shadow-md transition-all">
                            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <span className="bg-slate-200 text-slate-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                                Vivienda Ocupada
                            </h3>
                            <p className="text-sm text-slate-600 group-hover:text-brand-800 transition-colors m-0">
                                El mayor miedo. ¿Quién vive dentro? ¿Un ex-propietario (fácil de echar) o un inquilino con contrato protegido?
                            </p>
                        </div>
                    </Link>

                    <Link to={ROUTES.CHARGES} className="block group">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 h-full hover:border-brand-300 hover:shadow-md transition-all">
                            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <span className="bg-slate-200 text-slate-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                                Cargas Registrales
                            </h3>
                            <p className="text-sm text-slate-600 group-hover:text-brand-800 transition-colors m-0">
                                El error que arruina. Las cargas anteriores a la subasta NO se borran. Tú las heredas.
                            </p>
                        </div>
                    </Link>

                    <Link to={ROUTES.VISIT} className="block group">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 h-full hover:border-brand-300 hover:shadow-md transition-all">
                            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <span className="bg-slate-200 text-slate-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                                Estado Físico
                            </h3>
                            <p className="text-sm text-slate-600 group-hover:text-brand-800 transition-colors m-0">
                                Compras "a cuerpo cierto". ¿Se puede visitar el interior? Descubre por qué casi nunca es posible.
                            </p>
                        </div>
                    </Link>

                    <Link to={ROUTES.ERRORS} className="block group">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 h-full hover:border-brand-300 hover:shadow-md transition-all">
                            <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <span className="bg-slate-200 text-slate-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
                                Errores de Análisis
                            </h3>
                            <p className="text-sm text-slate-600 group-hover:text-brand-800 transition-colors m-0">
                                Leer mal el edicto o confundir el número de finca puede hacerte comprar un trastero a precio de piso.
                            </p>
                        </div>
                    </Link>
                </div>

                {/* H2: OPORTUNIDADES RENTABLES */}
                <h2 id="oportunidades" className="text-3xl mt-16 mb-8 flex items-center gap-3">
                    <Lightbulb className="text-yellow-500" /> Cómo encontrar oportunidades rentables
                </h2>
                <p>
                    A pesar de los riesgos, la rentabilidad existe. Para encontrarla, debes aplicar un filtro estricto. Antes de pujar en una subasta es recomendable calcular la rentabilidad real de la operación. Puedes hacerlo con esta <Link to={ROUTES.CALCULATOR} className="text-brand-700 font-bold hover:underline">calculadora de subastas judiciales</Link>. Mi método se basa en estos pilares:
                </p>

                <ul className="space-y-6 my-8 list-none pl-0">
                    <li className="flex gap-4">
                        <div className="bg-brand-100 p-2 rounded-lg h-fit text-brand-700"><MapPin size={24} /></div>
                        <div>
                            <strong className="block text-slate-900 text-lg">1. Ubicación y Valor Real</strong>
                            <span className="text-slate-600 leading-relaxed">Ignora el "Valor de Tasación" del BOE (suele estar inflado, de la época de la burbuja). Calcula el valor de mercado actual en Idealista/Fotocasa y aplica un descuento de seguridad del 20-30%.</span>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <div className="bg-brand-100 p-2 rounded-lg h-fit text-brand-700"><FileText size={24} /></div>
                        <div>
                            <strong className="block text-slate-900 text-lg">2. Estudio de Cargas</strong>
                            <span className="text-slate-600 leading-relaxed">Solicita siempre la Nota Simple actualizada. Tu puja máxima debe ser: <em>Valor Mercado - Reformas - Impuestos - Cargas Anteriores - Margen Beneficio</em>.</span>
                        </div>
                    </li>
                    <li className="flex gap-4">
                        <div className="bg-brand-100 p-2 rounded-lg h-fit text-brand-700"><Landmark size={24} /></div>
                        <div>
                            <strong className="block text-slate-900 text-lg">3. Dominio de la Regla del 70%</strong>
                            <span className="text-slate-600 leading-relaxed">Entender los tramos del Art. 670 LEC te permite saber si tu adjudicación será firme o si el banco/deudor pueden quitártela. <Link to={ROUTES.RULE_70} className="text-brand-700 font-bold hover:underline">Domina la mecánica de adjudicación (Art. 670)</Link>.</span>
                        </div>
                    </li>
                </ul>

                
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
                          <span className="text-lg pr-4">¿Qué rentabilidad media puedo obtener invirtiendo en subastas judiciales del Estado?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-justify">
                          La experiencia de inversores y fondos refleja márgenes consolidados (TIR) tras pago de ITP, registros e incidencias que oscilan entre un 15% y un 30% en modalidad 'House Flipping'. Esta ganancia requiere sin embargo una enorme gestión del riesgo documental (Cargas, VPOs, herederos, ocupación) que disuade al inversor novato.
                      </div>
                  </details>
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all shadow-sm">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          <span className="text-lg pr-4">¿Son seguras las compras a través del sistema de enjuiciamiento civil español?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-justify">
                          Las adjudicaciones judiciales suponen una transmisión jurídica completamente oficial. La incertidumbre o riesgo no está en el organismo o Letrado interviniente, radica exclusivamente en tu pericia interpretativa del expediente de Ejecución Hipotecaria o Título No Judicial (cargas, okupas e importes ocultos).
                      </div>
                  </details>
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all shadow-sm">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          <span className="text-lg pr-4">¿Cubre legalmente el juzgado posibles vicios o deterioros dentro de la vivienda subastada?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-justify">
                          Absolutamente no. Según la Ley Civil en ejecuciones obligatorias se extingue el saneamiento por vicios ocultos (no aplicable pacto al respecto). Compras el piso tal cual se entregue la posesión, independientemente de reformas estructurales, okupas que hayan desvalijado cañerías interiores o afectaciones imprevistas, no tienes posibilidad de reclamo a la entidad bancaria.
                      </div>
                  </details>
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all shadow-sm">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          <span className="text-lg pr-4">¿Existe una cantidad idónea para iniciarme con solvencia y pujar en el mercado de subastas BOE?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-justify">
                          Operar requiere capitalización plena. Los avales bancarios no son aceptados de oficio; precisarás liquidez de base del 100% de la puja ejecutoria más una provisión adicional (20% aproximadamente) que cubra impuestos, Notaría si aplicas financiación mixta posterior, gastos periciales ocultos (comunidad, basura/IBI de Hacienda) y vaciado pacífico o judicial de los enseres o intrusos.
                      </div>
                  </details>
              </div>
          </section>

          <SaaSCtaBlock />
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
                            <a href="#marco-legal" className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent">
                                <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">El Sistema de Ejecución Forzosa</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity group-hover:text-brand-500"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </a>
                        </li>
                        <li>
                            <a href="#funcionamiento" className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent">
                                <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">El Ciclo de Vida de la Adjudicación Judicial</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity group-hover:text-brand-500"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </a>
                        </li>
                        <li>
                            <a href="#riesgos" className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent">
                                <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Riesgos reales de las subastas</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity group-hover:text-brand-500"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </a>
                        </li>
                        <li>
                            <a href="#oportunidades" className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent">
                                <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Cómo encontrar oportunidades rentables</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity group-hover:text-brand-500"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </a>
                        </li>
                </ul>
            </div>


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
                     <Link to="/cargas-subasta-judicial-cancelacion" className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Cargas y Cancelación</span>
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

export default GuidePillar;
