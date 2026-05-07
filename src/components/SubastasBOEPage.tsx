import React, { useEffect } from 'react';
import { GuideTOC } from './GuideTOC';
import { GuideMobileCTA } from './GuideMobileCTA';
import { Link } from 'react-router-dom';
import { CheckCircle, ChevronRight, Calendar, Clock, Gavel, Building2, ShieldCheck, ArrowRight, AlertTriangle, Search, Scale, BookOpen, Calculator, Info, Globe, AlertCircle } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import SaaSCtaBlock from "@/components/SaaSCtaBlock";

const SubastasBOEPage: React.FC = () => {
  
  // Dynamic Date
  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const schemaDate = currentDate.toISOString();

  // Images
  const IMG_HERO = "https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&q=80&w=1200&h=630"; 
  const IMG_PORTAL = "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800&h=450";

  useEffect(() => {
    // 1. Scroll top
    window.scrollTo(0, 0);

    // 2. SEO Meta Tags
    document.title = "Subastas BOE en España: Cómo Funciona y Riesgos | Activos";
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', "Qué son las subastas del BOE, cómo funcionan los remates, riesgos ocultos de las cargas registrales y cuánto cuesta participar de forma segura.");
    }

    // Open Graph Tags
    const setMeta = (property: string, content: string) => {
        let element = document.head.querySelector(`meta[property="${property}"]`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute('property', property);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    };

    setMeta('og:title', "Subastas BOE en España: Guía y Riesgos");
    setMeta('og:description', "Qué son las subastas del BOE, cómo funcionan, riesgos de cargas y cómo participar.");
    setMeta('og:type', "article");
    setMeta('og:url', "https://activosoffmarket.es/subastas-boe/");
    setMeta('og:image', IMG_HERO);
    setMeta('og:site_name', "Activos Off-Market");

    // Schema.org Structured Data
    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Article",
          "headline": "Subastas BOE en España: Cómo Funcionan y Cómo Invertir con Seguridad",
          "description": "Descubre qué son, cómo funcionan, cuánto cuesta participar y los principales riesgos de invertir en el portal de subastas del BOE.",
          "image": [IMG_HERO],
          "datePublished": "2024-01-15T09:00:00+01:00",
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
          }
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "¿Qué son las subastas del BOE?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Es el mecanismo oficial y telemático del Estado español para la venta forzosa de bienes (inmuebles, vehículos, etc.) con el fin de saldar deudas impagadas de sus propietarios."
              }
            },
            {
              "@type": "Question",
              "name": "¿Cuánto cuesta participar en una subasta del BOE?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Participar requiere consignar un depósito preventivo del 5% del valor de tasación fijado en el edicto. Si pierdes la subasta, se devuelve íntegramente. Si ganas, forma parte del precio final."
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
              "name": "Subastas BOE",
              "item": "https://activosoffmarket.es/subastas-boe/"
            }
          ]
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    script.id = 'schema-subastas-boe';
    document.head.appendChild(script);

    return () => {
        const el = document.getElementById('schema-subastas-boe');
        if (el) document.head.removeChild(el);
    };

  }, [schemaDate]);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-600 selection:bg-brand-100 selection:text-brand-900">
      
      {/* HEADER SECTION */}
      <header className="bg-white pb-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 pt-6">
            <nav className="flex items-center text-sm text-slate-500 mb-8 font-medium" aria-label="Breadcrumb">
                <Link to={ROUTES.HOME} className="hover:text-brand-600 transition-colors">Inicio</Link>
                <ChevronRight size={14} className="mx-2" />
                <span className="text-brand-700 bg-brand-50 px-2 py-1 rounded-md" aria-current="page">Subastas BOE</span>
            </nav>

            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-[1.1] tracking-tight max-w-4xl">
                Subastas BOE en España: <br/>
                <span className="text-brand-700 italic">Qué son, Riesgos y Cómo Funciona</span>
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-slate-500 text-sm border-t border-slate-100 pt-6 max-w-4xl">
                <div className="flex items-center gap-3">
                    <img src="/jose-de-la-pena-subastas-boe.jpg" alt="José de la Peña" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md bg-slate-100" />
                    <div className="flex flex-col">
                        <span className="font-bold text-slate-900 leading-none">José de la Peña</span>
                        <span className="text-xs text-brand-600 font-semibold mt-1 uppercase tracking-wide">Jurista Especializado</span>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                    <Calendar size={14} />
                    <span className="capitalize font-medium">{currentMonthYear}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                    <Clock size={14} />
                    <span className="font-medium">10 min lectura</span>
                </div>
            </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        
        {/* SIDEBAR (TOC + CTA) */}
        <aside className="lg:col-span-4 lg:order-2 space-y-8">
          <div className="sticky top-24 space-y-8">
            
            {/* EN ESTA GUÍA (TOC) */}
            <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
                <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <BookOpen size={18} className="text-brand-600"/>
                    En esta guía
                </h4>
                <nav className="space-y-1">
                    <a href="#que-son" className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 hover:text-brand-700 text-sm font-medium">
                        ¿Qué son las subastas del BOE?
                    </a>
                    <a href="#como-funcionan" className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 hover:text-brand-700 text-sm font-medium">
                        ¿Cómo funcionan?
                    </a>
                    <a href="#riesgos" className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 hover:text-brand-700 text-sm font-medium">
                        Riesgos Principales
                    </a>
                    <a href="#cuanto-cuesta" className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors text-slate-600 hover:text-brand-700 text-sm font-medium">
                        ¿Cuánto cuesta participar?
                    </a>
                </nav>
            </div>

            {/* SAAS CTA SIDEBAR */}
            <div className="bg-slate-900 text-white p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-800 relative overflow-hidden">
                <div className="absolute top-[-30%] right-[-20%] w-[80%] h-[120%] bg-brand-600/20 rounded-full blur-[60px] opacity-60 pointer-events-none"></div>
                <div className="relative z-10">
                    <span className="text-brand-300 text-xs font-bold uppercase tracking-widest mb-3 block flex items-center gap-2">
                        <ShieldCheck size={14} /> Herramienta Inversores
                    </span>
                    <h3 className="font-serif text-2xl font-bold mb-3 leading-tight text-white">
                        ¿Dudas con una puja?
                    </h3>
                    <p className="text-slate-300 mb-6 text-sm leading-relaxed">
                        Nuestro algoritmo analiza cargas registrales, ITP y valor real en segundos. Evita sorpresas y errores costosos.
                    </p>
                    <Link 
                        to={ROUTES.PRO}
                        className="block w-full bg-brand-500 text-white font-bold py-3.5 px-4 rounded-xl text-center hover:bg-brand-600 transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2 group"
                    >
                        Ver Planes Pro <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
                    </Link>
                </div>
            </div>

          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="lg:col-span-8 lg:order-1">
            
            {/* FEATURED IMAGE */}
            <figure className="mb-10 -mt-2">
                <img 
                    src={IMG_HERO} 
                    alt="Portal de Subastas del BOE en ordenador"
                    width="1200"
                    height="630"
                    loading="eager"
                    // @ts-ignore
                    fetchpriority="high"
                    className="w-full h-[300px] md:h-[400px] object-cover rounded-3xl shadow-md border border-slate-200 bg-slate-100"
                />
            </figure>

            {/* RESUMEN RÁPIDO */}
            <div className="bg-brand-50 border border-brand-100 rounded-2xl p-6 md:p-8 mb-12 shadow-sm">
                <h3 className="text-brand-900 font-bold mb-4 flex items-center gap-2">
                    <CheckCircle size={20} className="text-brand-600" /> Resumen Rápido (TL;DR)
                </h3>
                <ul className="space-y-3">
                    <li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug"><strong className="text-slate-900">Origen:</strong> El BOE centraliza la venta forzosa de embargos judiciales, Hacienda y Seguridad Social.</p>
                    </li>
                    <li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug"><strong className="text-slate-900">Barrera de entrada:</strong> Para pujar debes consignar el 5% del valor de tasación estipulado.</p>
                    </li>
                    <li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug"><strong className="text-slate-900">El gran riesgo:</strong> Las deudas anteriores NO se cancelan automáticamente; las asume el comprador.</p>
                    </li>
                    <li className="flex gap-3 text-slate-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-2 shrink-0"></div>
                        <p className="leading-snug"><strong className="text-slate-900">Posesión:</strong> No recibes las llaves al ganar; dependes del juzgado y de si el inmueble está ocupado.</p>
                    </li>
                </ul>
            </div>

<GuideTOC />

            <article className="prose prose-lg prose-slate text-justify max-w-4xl space-y-6 prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900 prose-p:leading-relaxed prose-li:leading-relaxed prose-a:text-brand-700 prose-a:font-semibold prose-a:no-underline hover:prose-a:underline">
                
                {/* H2: QUÉ SON */}
                <h2 id="que-son" className="text-3xl mt-2 flex items-center gap-3 scroll-mt-28">
                    <Globe className="text-brand-600 shrink-0" /> ¿Qué son las subastas del BOE?
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6">
                    Las subastas del BOE son el mecanismo oficial del Estado para vender bienes embargados con el fin de saldar deudas que sus propietarios no han podido pagar.
                </p>
                <p>
                    Desde 2015, todas estas licitaciones se centralizan en el Portal Electrónico de Subastas de la Agencia Estatal Boletín Oficial del Estado. Funciona como un <em>marketplace</em> oficial donde diferentes organismos publican los bienes embargados para que cualquier ciudadano pueda pujar por ellos de forma 100% telemática y anónima.
                </p>
                <p>
                    El gran atractivo es el <strong>precio</strong>. Las adjudicaciones suelen cerrarse con descuentos muy significativos respecto al mercado libre, ya que no existe un "precio de reserva" convencional.
                </p>

                {/* H2: COMO FUNCIONAN */}
                <h2 id="como-funcionan" className="text-3xl mt-16 flex items-center gap-3 scroll-mt-28">
                    <Building2 className="text-brand-600 shrink-0" /> ¿Cómo funcionan y qué tipos hay?
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6">
                    El portal agrupa tres grandes bloques de subastas, y cada una se rige por leyes distintas. Confundirlas es el primer gran error.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 not-prose">
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col h-full hover:border-brand-300 hover:shadow-md transition-all">
                        <Gavel className="text-brand-600 mb-4" size={28} />
                        <h3 className="font-bold text-slate-900 text-lg mb-2">1. Judiciales</h3>
                        <p className="text-slate-600 text-sm mb-4 flex-grow">
                            Derivan de embargos o impagos de hipotecas (bancos) en juzgados. Son las más seguras a nivel de cancelación de cargas gracias a la orden directa del juez.
                        </p>
                        <Link to={ROUTES.GUIDE_PILLAR} className="text-brand-700 font-bold text-sm hover:underline flex items-center gap-1 mt-auto group">
                            Ver funcionamiento <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                        </Link>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col h-full hover:border-brand-300 hover:shadow-md transition-all">
                        <Building2 className="text-brand-600 mb-4" size={28} />
                        <h3 className="font-bold text-slate-900 text-lg mb-2">2. Agencia Tributaria</h3>
                        <p className="text-slate-600 text-sm mb-4 flex-grow">
                            Administrativas. Derivan de deudas con Hacienda. Tienen particularidades en la purga de cargas y no garantizan posesión física tan ágilmente.
                        </p>
                        <Link to={ROUTES.COMPARISON} className="text-brand-700 font-bold text-sm hover:underline flex items-center gap-1 mt-auto group">
                            Comparar con judiciales <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
                        </Link>
                    </div>
                    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col h-full hover:border-brand-300 hover:shadow-md transition-all">
                        <ShieldCheck className="text-brand-600 mb-4" size={28} />
                        <h3 className="font-bold text-slate-900 text-lg mb-2">3. Seguridad Social</h3>
                        <p className="text-slate-600 text-sm mb-4 flex-grow">
                            Venta de patrimonio empresarial o privado para saldar cuotas impagadas de la Seguridad Social. Muy similares a las de Hacienda en su gestión.
                        </p>
                    </div>
                </div>

                {/* H2: RIESGOS */}
                
<GuideMobileCTA />
<h2 id="riesgos" className="text-3xl mt-16 flex items-center gap-3 scroll-mt-28">
                    <AlertTriangle className="text-amber-500 shrink-0" /> Los 3 riesgos letales del BOE
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6">
                    El BOE no es una plataforma de venta tradicional. No revisa si el bien está ocupado ni si debes asumir hipotecas millonarias del antiguo propietario.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10 not-prose">
                    <div className="bg-white border text-left border-red-100 p-6 rounded-2xl shadow-sm hover:border-red-200 transition-colors">
                        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-4">
                            <Search size={24} />
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg mb-2">Cargas Ocultas Registrales</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            El riesgo número uno. Las deudas anotadas en el registro con fecha anterior al embargo <strong>NO se borran</strong>. Si compras un inmueble por 50.000€ y arrastra una hipoteca previa de 100.000€, deberás pagarla para no perder la casa.
                        </p>
                    </div>
                    
                    <div className="bg-white border text-left border-amber-100 p-6 rounded-2xl shadow-sm hover:border-amber-200 transition-colors">
                        <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
                            <AlertCircle size={24} />
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg mb-2">Posesión y Ocupas</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Nadie te da las llaves en mano. Tu adjudicación aporta el título de propiedad, pero la posesión física requiere un trámite judicial ("lanzamiento") que puede demorarse meses si hay inquilinos u okupas.
                        </p>
                    </div>

                    <div className="bg-white border text-left border-blue-100 p-6 rounded-2xl shadow-sm md:col-span-2 hover:border-blue-200 transition-colors">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                            <Scale size={24} />
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg mb-2">Pérdida del Depósito</h3>
                        <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
                            Si eres el máximo pujador, se te requerirá el pago del remate total. Si en 40 días hábiles no logras financiación y no pagas, quiebras la subasta, perdiendo íntegramente tu depósito inicial del 5%.
                        </p>
                    </div>
                </div>

                <div className="my-12 not-prose">
                    <SaaSCtaBlock />
                </div>

                {/* H2: CUÁNTO CUESTA */}
                <h2 id="cuanto-cuesta" className="text-3xl mt-16 flex items-center gap-3 scroll-mt-28">
                    <Calculator className="text-brand-600 shrink-0" /> ¿Cuánto cuesta participar?
                </h2>
                <p className="text-xl text-slate-600 leading-relaxed font-medium mb-6">
                    A diferencia de inscribirse en un listado, participar activamente emitiendo una oferta tiene un requisito financiero ineludible.
                </p>

                <p>
                    La Ley de Enjuiciamiento Civil exige constituir una fianza previa para poder participar. Este filtro evita pujadores fraudulentos y asegura la seriedad viabilizando el proceso.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:p-8 my-8 not-prose">
                    <div className="flex items-start gap-4">
                        <Info className="text-brand-600 mt-1 shrink-0" size={24}/>
                        <div>
                            <h3 className="font-bold text-slate-900 text-xl mb-2">El Depósito del 5%</h3>
                            <p className="text-slate-700 leading-relaxed text-sm">
                                Es obligatorio consignar el <strong>5% del Valor de Tasación</strong> estipulado en el edicto (no el 5% de tu puja máxima). Este trámite se ejecuta en el portal mediante pasarela segura.
                            </p>
                            <ul className="mt-4 space-y-2 text-sm text-slate-600">
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> <strong>Si no ganas:</strong> El dinero se devuelve íntegro automáticamente a los pocos días.</li>
                                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> <strong>Si ganas:</strong> Funciona como señal y se descuenta del precio total que tendrás que pagar.</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* H2: ANÁLISIS */}
                <h2 className="text-3xl mt-16 mb-8">El Secreto: Análisis de rentabilidad previo</h2>
                <p>
                    Nunca confíes ciegamente en los datos del BOE. El "Valor de Subasta" suele estar desactualizado. El verdadero trabajo de un inversor es realizar una <em>Due Diligence</em> exhaustiva antes de pujar.
                </p>

                <div className="bg-white border-l-4 border-brand-600 p-6 shadow-sm my-8 not-prose rounded-r-2xl">
                    <h3 className="font-bold text-brand-900 text-lg mb-4">Hoja de ruta básica del inversor:</h3>
                    <ol className="list-decimal pl-5 space-y-3 text-slate-700 text-sm font-medium">
                        <li>Solicitar y auditar la <strong>Certificación de Cargas</strong> en el Registro.</li>
                        <li>Identificar el importe exacto de pasivos anteriores ("cargas preferentes").</li>
                        <li>Estimar el coste impositivo (ITP o IVA según el caso).</li>
                        <li>Asignar un coste de riesgo si el inmueble carece de posesión pacífica.</li>
                        <li>Configurar un techo matemático de rentabilidad.</li>
                    </ol>
                </div>
                
                <hr className="my-16 border-slate-200" />

                <div className="my-12 not-prose">
                    <SaaSCtaBlock />
                </div>

            </article>
        </main>
      </div>
    </div>
  );
};

export default SubastasBOEPage;
