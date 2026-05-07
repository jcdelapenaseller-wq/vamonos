import React, { useEffect } from 'react';
import { GuideTOC } from './GuideTOC';
import { GuideMobileCTA } from './GuideMobileCTA';

import { CheckCircle,  Calendar, Clock, ChevronRight, Gavel, ArrowRight, BookOpen, UserX, Building2, TrendingDown, HelpCircle, AlertCircle, Percent, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const AuctionEmptyGuide: React.FC = () => {
  
  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const schemaDate = currentDate.toISOString();

  // Images - Professional & Abstract
  const IMG_HERO = "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=1200&h=630"; // Gavel in empty room context
  const IMG_BANK = "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800&h=450"; // Bank / Creditor
  const IMG_PROCESS = "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800&h=450"; // Documents

  useEffect(() => {
    // SEO Optimization
    document.title = "¿Qué Pasa Si Nadie Puja en una Subasta Judicial? | BOE 2025";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', "Descubre qué ocurre cuando una subasta judicial queda desierta, qué opciones tiene el acreedor y cómo puede afectar al precio final.");
    }
    window.scrollTo(0, 0);

    // Schema.org
    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
      
      "@type": "Article",
      "headline": "¿Qué Pasa Si Nadie Puja en una Subasta Judicial?",
      "description": "Análisis técnico sobre las subastas desiertas en el BOE y los derechos de adjudicación del acreedor.",
      "image": [IMG_HERO],
      "datePublished": "2024-02-10T09:00:00+01:00",
      "dateModified": schemaDate,
      "author": {
        "@type": "Person",
        "name": "José de la Peña",
        "url": "https://activosoffmarket.es/quien-soy"
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://activosoffmarket.es/que-pasa-si-nadie-puja-subasta-judicial"
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
                              "name": "¿Qué Pasa Si Nadie Puja en una Subasta Judicial?",
                              "item": "https://activosoffmarket.es/guia/"
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
      
      {/* HEADER */}
      <header className="bg-white pb-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
            <nav className="flex items-center text-sm text-slate-500 mb-8 font-medium flex-wrap gap-2" aria-label="Breadcrumb">
                <Link to={ROUTES.HOME} className="hover:text-brand-600 transition-colors">Inicio</Link>
                <ChevronRight size={14} />
                <Link to={ROUTES.GUIDE_PILLAR} className="hover:text-brand-600 transition-colors">Guía Subastas</Link>
                <ChevronRight size={14} />
                <span className="text-brand-700 bg-brand-50 px-2 py-1 rounded-md" aria-current="page">Subasta Desierta</span>
            </nav>
            
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-tight">
                ¿Qué Pasa Si Nadie Puja en una <br/>
                <span className="text-brand-700 italic">Subasta Judicial? (Explicación Completa)</span>
            </h1>\n
            <div className="flex items-center gap-2 text-sm text-slate-500 font-medium mb-8 bg-slate-50 inline-flex px-4 py-2 rounded-full border border-slate-200">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                Basado en el análisis de edictos BOE y certificaciones del Registro de la Propiedad
            </div>

            <div className="flex flex-wrap items-center gap-6 text-slate-500 text-sm border-t border-slate-100 pt-6">
                <div className="flex items-center gap-3">
                    <img src="/jose-de-la-pena-subastas-boe.jpg" alt="José de la Peña" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md" />
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
                    <span>6 min lectura</span>
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
                        alt="Sala de subastas vacía o mazo judicial"
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
                    Una situación muy común en el portal del BOE es que transcurran los 20 días de plazo y el contador de pujas permanezca en cero. 
                    Contrario a la creencia popular, que nadie puje no significa que la deuda desaparezca ni que el propietario conserve su casa.
                </p>
                <p>
                    Cuando una <Link to={ROUTES.GUIDE_PILLAR} className="text-brand-700 font-bold hover:underline">subasta judicial</Link> finaliza sin postores, se activa un mecanismo legal específico diseñado para proteger al acreedor (normalmente el banco) y evitar que el procedimiento quede en punto muerto.
                </p>

                {/* H2 1 */}
                
            {/* RESUMEN RÁPIDO */}
            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 md:p-8 mb-12 shadow-sm not-prose">
                <h3 className="text-brand-900 font-bold mb-4 flex items-center gap-2">
                    <CheckCircle size={20} className="text-brand-600" /> Resumen Rápido (TL;DR)
                </h3>
                <ul className="space-y-3">
                    <li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Nadie pujó en la subasta.</p>
                    </li><li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">El acreedor puede adjudicársela por un porcentaje menor.</p>
                    </li><li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug">Gran pérdida de oportunidad para el público.</p>
                    </li>
                </ul>
            </div>
            
            <GuideTOC />
            
        
<h2 className="text-3xl mt-16 mb-8 flex items-center gap-3">
                    <UserX className="text-brand-600" /> ¿Se declara desierta la subasta?
                </h2>
                <p>
                    Técnicamente sí. Cuando el Portal de Subastas certifica el cierre sin ninguna oferta válida, el Letrado de la Administración de Justicia (LAJ) declara el acto <strong>"sin postores"</strong> o desierto.
                </p>
                <p>
                    Esto no implica que se vaya a celebrar una "segunda subasta" con precio rebajado (ese sistema antiguo ya no existe en la LEC actual para inmuebles). El procedimiento entra en una nueva fase procesal donde el protagonista exclusivo es el <strong>ejecutante</strong> (quien reclamaba la deuda).
                </p>

                {/* H2 2 */}
                <h2 className="text-3xl mt-16 mb-8">Qué opciones tiene el acreedor</h2>
                <p>
                    Según el artículo 671 de la Ley de Enjuiciamiento Civil, si no hay ningún postor, el acreedor tiene un plazo de <strong>20 días hábiles</strong> para pedir la adjudicación del bien.
                </p>
                <p>
                    Aquí es donde muchos inversores se confunden. El acreedor no puede quedarse el bien "gratis" ni por el precio que quiera. La ley fija unos mínimos estrictos para evitar el enriquecimiento injusto y proteger al deudor.
                </p>

                <div className="bg-brand-50 p-6 rounded-xl border border-brand-100 my-8 not-prose">
                    <h3 className="font-bold text-brand-900 mb-2 flex items-center gap-2">
                        <Info size={20} /> Dato importante
                    </h3>
                    <p className="text-brand-800 text-sm m-0">
                        Si el acreedor NO pide la adjudicación en esos 20 días, se levanta el embargo (a instancia del ejecutado) y el bien queda libre de esta ejecución concreta. Esto es rarísimo que ocurra con bancos, pero puede pasar con comunidades de propietarios o particulares.
                    </p>
                </div>

                {/* H2 3 */}
                
<GuideMobileCTA />
<h2 className="text-3xl mt-16 mb-8 flex items-center gap-3">
                    <Building2 className="text-slate-700" /> Puede el banco adjudicarse el inmueble
                </h2>
                <p>
                    Sí, y es lo más habitual. Si nadie puja, el banco se lo queda. Pero, ¿a qué precio? La Ley distingue si es vivienda habitual o no:
                </p>

                <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <CheckCircle size={20} className="text-green-600"/> Vivienda Habitual
                        </h3>
                        <p className="text-sm text-slate-600">
                            El banco debe adjudicársela por el <strong>70% del valor de tasación</strong>.
                        </p>
                        <p className="text-xs text-slate-500 mt-2 border-t border-slate-100 pt-2">
                            *Excepción: Si la deuda total (principal + intereses + costas) es inferior al 70%, se lo puede quedar por el <strong>60%</strong>.
                        </p>
                    </div>
                    
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                            <Gavel size={20} className="text-brand-600"/> No Vivienda Habitual
                        </h3>
                        <p className="text-sm text-slate-600">
                            (Locales, segundas residencias, naves). El banco puede pedir la adjudicación por el <strong>50% del valor de tasación</strong> o por la cantidad que se le deba por todos los conceptos.
                        </p>
                    </div>
                </div>

                <p>
                    Por este motivo, muchas veces no ves pujas en subastas donde el tipo es muy alto. Los inversores saben que el banco se lo quedará al 50% o 70% y prefieren no inmovilizar su <Link to={ROUTES.DEPOSIT} className="text-brand-700 font-bold hover:underline">depósito del 5%</Link> sabiendo que no tienen margen.
                </p>

                <figure className="my-12">
                    <img 
                        src={IMG_BANK} 
                        alt="Entidad bancaria o acreedor adjudicándose el bien"
                        width="800"
                        height="450"
                        className="rounded-2xl shadow-lg w-full object-cover"
                    />
                    <figcaption className="text-center text-sm text-slate-500 mt-2">Los bancos acumulan stock inmobiliario a través de las subastas desiertas.</figcaption>
                </figure>

                {/* H2 4 */}
                <h2 className="text-3xl mt-16 mb-8 flex items-center gap-3">
                    <TrendingDown className="text-red-500" /> Cómo afecta al valor futuro
                </h2>
                <p>
                    Si el banco se adjudica el bien, este pasa a formar parte de sus activos adjudicados (REO). Posteriormente, lo pondrá a la venta en el mercado libre (a través de inmobiliarias o servicers).
                </p>
                <p>
                    <strong>¿Será más barato entonces?</strong> No necesariamente.
                </p>
                <ul className="list-disc pl-6 space-y-3 mb-6">
                    <li>El banco intentará venderlo a precio de mercado para recuperar pérdidas.</li>
                    <li>Ya no tendrá cargas anteriores (se habrán purgado con la adjudicación), lo que lo hace más atractivo para el comprador final.</li>
                    <li>Posiblemente el banco ya haya iniciado el desalojo de ocupantes.</li>
                </ul>
                <p>
                    Comprar en subasta suele ser más barato que esperar a que el banco lo revenda, pero exige asumir los riesgos que explicamos en nuestra guía sobre <Link to={ROUTES.ANALYSIS} className="text-brand-700 font-bold hover:underline">cómo analizar una subasta</Link>.
                </p>

                {/* H2 5 */}
                <h2 className="text-3xl mt-16 mb-8">Oportunidades en "segundas subastas"</h2>
                <p>
                    El concepto clásico de "segunda" o "tercera" subasta presencial con bajada de precio desapareció hace años. Hoy el proceso es único.
                </p>
                <p>
                    Sin embargo, existen situaciones excepcionales:
                </p>
                <div className="space-y-4 not-prose my-6">
                    <div className="flex gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <div className="bg-slate-100 p-2 h-fit rounded text-slate-700"><Percent size={20} /></div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-base">Concurso de Acreedores</h4>
                            <p className="text-sm text-slate-600 m-0">En liquidaciones concursales (empresas en quiebra) sí pueden celebrarse planes de liquidación con subastas sucesivas o venta directa si la primera queda desierta.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                        <div className="bg-slate-100 p-2 h-fit rounded text-slate-700"><AlertCircle size={20} /></div>
                        <div>
                            <h4 className="font-bold text-slate-900 text-base">AEAT / Seguridad Social</h4>
                            <p className="text-sm text-slate-600 m-0">En subastas administrativas, si queda desierta, a veces se abre un periodo de "adjudicación directa" donde se puede presentar oferta en sobre cerrado durante 6 meses.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-brand-900 text-white p-8 rounded-2xl my-12 not-prose">
                    <h3 className="font-serif text-xl font-bold mb-4">¿Quieres saber si el banco va a pujar?</h3>
                    <p className="text-brand-100 text-lg leading-relaxed mb-6">
                        Es vital conocer la deuda real. Si la deuda es superior al 70% del valor, el banco defenderá su posición. Si es baja, podría dejarla escapar.
                    </p>
                    <Link to={ROUTES.ANALYSIS} className="inline-block bg-white text-brand-900 font-bold px-6 py-3 rounded-lg hover:bg-brand-50 transition-colors">
                        Aprende a calcular la deuda real del banco
                    </Link>
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
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-8">Preguntas Frecuentes sobre Subastas Desiertas (FAQ)</h2>
              <div className="space-y-4">
                  
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all shadow-sm">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          <span className="text-lg pr-4">¿Por qué una subasta del BOE queda desierta sin pujas?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-left">
                          Generalmente ocurre cuando el análisis financiero de los inversores detecta que la deuda que subsiste (cargas preferentes), sumada al valor mínimo de adjudicación, exige un importe total superior al valor de mercado o cuando hay riesgos jurídicos graves como ocupaciones consolidadas indañables.
                      </div>
                  </details>
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all shadow-sm">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          <span className="text-lg pr-4">¿Cuál es el plazo del crédito ejecutante para reclamar la adjudicación?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-left">
                          Según el artículo 671 de la Ley de Enjuiciamiento Civil (LEC), el banco o acreedor ejecutante dispone de un plazo de 20 días hábiles desde el cierre de la subasta desierta para solicitar la adjudicación del inmueble por el 50% (si no es vivienda habitual) o por el 70% (vivienda habitual) de su valor de tasación.
                      </div>
                  </details>
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all shadow-sm">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          <span className="text-lg pr-4">¿Puedo comprar un piso después de que la subasta quede desierta?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-left">
                          Sí. Frecuentemente, el banco se adjudica la vivienda (Adjudicación de Inmuebles, ADJ) y la cede a terceros a través de fondos buitre o mediante "Cesión de Remate" antes de que se inscriba el decreto en el registro. Suele ser una excelente oportunidad extrajudicial de inversión inmobiliaria.
                      </div>
                  </details>
                  <details className="group bg-white border border-slate-200 rounded-xl open:border-brand-200 open:ring-1 open:ring-brand-100 transition-all shadow-sm">
                      <summary className="flex items-center justify-between p-6 cursor-pointer font-bold text-slate-800 group-hover:text-brand-700">
                          <span className="text-lg pr-4">¿Qué le sucede al ejecutado (deudor) si el banco no reclama el inmueble?</span>
                          <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </summary>
                      <div className="px-6 pb-6 text-slate-600 leading-relaxed border-t border-slate-100 pt-4 text-left">
                          Al no mediar solicitud de adjudicación por parte del acreedor, se procede, bajo petición del Letrado judicial, al alzamiento del embargo que originó el expediente (liberando momentáneamente la carga para esa ejecución concreta), aunque la deuda personal monetaria subyacente seguirá viva y pendiente de cobro futuro.
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
                    Lecturas Relacionadas
                </h4>
                <nav className="space-y-4">
                    <Link to={ROUTES.RULE_70} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Regla del 70%</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to={ROUTES.GUIDE_PILLAR} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Funcionamiento Subastas</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to={ROUTES.DEPOSIT} className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Depósito del 5%</span>
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

export default AuctionEmptyGuide;