import React, { useEffect, useState } from 'react';
import { Calendar, Clock, ChevronRight, ArrowRight, BookOpen, AlertTriangle, Lightbulb, Info, FileText, Scale, Landmark, MapPin, ArrowUpRight, Search, ShieldAlert, CheckCircle2, BadgeAlert, TrendingUp, Wallet, Percent, AlertOctagon, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { ROUTES } from '@/constants/routes';
import SaaSCtaBlock from '@/components/SaaSCtaBlock';

const ComoComprarSubastaPage: React.FC = () => {
  
  // Dynamic Date
  const currentDate = new Date();
  const currentMonthYear = currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });
  const schemaDate = currentDate.toISOString();
  
  // State for read time
  const [readTime, setReadTime] = useState(6);

  // Images
  const IMG_FEATURED = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200&h=630";

  const faqData = [
    {
      question: "¿Cuánto dinero necesito para participar en una subasta del BOE?",
      answer: "Necesitas disponer del 5% del 'Tipo de Subasta' (valor a efectos de subasta) para ingresarlo como depósito previo obligatorio. Además, si ganas, debes disponer de la totalidad del remate restante más los impuestos (el I.T.P., que suele oscilar entre el 6% y el 10%) en un plazo de 40 días hábiles. Depender de una hipoteca bancaria tradicional para pagar el remate es casi imposible por plazos."
    },
    {
      question: "¿Cómo sé qué deudas hereda la vivienda subastada?",
      answer: "Revisando meticulosamente la 'Certificación de Cargas' expedida por el Registro de la Propiedad. Heredarás obligatoriamente todas las cargas, embargos o hipotecas inscritas ANTES de la carga concreta por la que se está ejecutando la subasta. El juzgado solo borra la carga ejecutada y las posteriores."
    },
    {
      question: "¿Qué ocurre si me adjudico una subasta y luego me echo atrás o no puedo pagar?",
      answer: "Perderás íntegramente el depósito del 5% que consignaste. Además, la Ley de Enjuiciamiento Civil (Art. 653) establece que si al repetirse la subasta el nuevo remate es inferior al tuyo, el juzgado podrá exigirte que pagues la diferencia con el importe de tu depósito confiscado."
    },
    {
      question: "¿Qué pasa si el inmueble o vivienda que gano está ocupado?",
      answer: "Es tu responsabilidad y riesgo. El juzgado no entrega viviendas vacías garantizadas ni te da la posesión inmediata automáticamente. Si la vivienda está habitada (ya sea por el propio deudor u ocupantes sin título legítimo), deberás instar al propio juzgado a realizar el lanzamiento o plantear un desahucio civil por precario, lo cual retrasará meses o años que puedas usar o vender la casa."
    },
    {
      question: "¿Puedo visitar la casa por dentro antes de pujar en el portal del BOE?",
      answer: "En el 99% de las subastas judiciales forzosas, no. Se compra bajo el concepto legal de 'cuerpo cierto', asumiendo el estado físico y estructural en el que se encuentre la propiedad sin garantías de indemnización por vicios ocultos."
    }
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  useEffect(() => {
    window.scrollTo(0, 0);

    // Read Time Calculation
    const article = document.querySelector('article');
    if (article) {
      const text = article.innerText;
      const words = text.trim().split(/\s+/).length;
      const time = Math.ceil(words / 200);
      setReadTime(Math.max(4, time));
    }

    // SEO Optimization is handled by Helmet
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-600 selection:bg-brand-100 selection:text-brand-900">
      <Helmet>
        <title>Cómo comprar en una subasta judicial en España | Guía completa 2026</title>
        <meta name="description" content="Guía completa para comprar en subastas judiciales del BOE: requisitos, riesgos, depósitos y estrategia para evitar errores y pagar menos." />
        <link rel="canonical" href="https://activosoffmarket.es/como-comprar-subasta" />
        <meta property="og:title" content="Cómo comprar en una subasta judicial en España | Guía completa 2026" />
        <meta property="og:description" content="Guía completa para comprar en subastas judiciales del BOE: requisitos, riesgos, depósitos y estrategia para evitar errores y pagar menos." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://activosoffmarket.es/como-comprar-subasta" />
        <meta property="og:image" content={IMG_FEATURED} />
        <meta property="og:site_name" content="Activos Off-Market" />
      </Helmet>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* HEADER SECTION */}
      <header className="bg-white pt-28 pb-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
            <nav className="flex items-center text-sm text-slate-500 mb-8 font-medium flex-wrap gap-2" aria-label="Breadcrumb">
                <Link to={ROUTES.HOME} className="hover:text-brand-600 transition-colors">Inicio</Link>
                <ChevronRight size={14} />
                <Link to={ROUTES.GUIDE_HUB} className="hover:text-brand-600 transition-colors">Guías</Link>
                <ChevronRight size={14} />
                <span className="text-brand-700 bg-brand-50 px-2 py-1 rounded-md" aria-current="page">Cómo comprar en subastas</span>
            </nav>

            <h1 className="font-serif text-3xl md:text-4xl xl:text-5xl font-bold text-slate-900 mb-4 leading-[1.1] tracking-tight max-w-6xl">
                Cómo comprar en una subasta judicial en España <span className="text-brand-700 italic">(Guía completa)</span>
            </h1>

            <div className="text-sm text-slate-500 mb-8 font-medium">
                Actualizado 2026
            </div>

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
            <article className="prose prose-lg prose-slate prose-headings:font-serif prose-headings:font-bold prose-headings:text-slate-900 prose-p:leading-loose text-left max-w-5xl space-y-6 leading-relaxed prose-p:max-w-3xl prose-headings:max-w-3xl prose-li:max-w-3xl">
                
                {/* FEATURED IMAGE */}
                <figure className="mb-12 -mt-6">
                    <img 
                        src={IMG_FEATURED} 
                        alt="Análisis profesional de subastas BOE"
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
                            <span><strong>El objetivo no es ganar:</strong> Es adjudicarte la propiedad con un margen real enorme tras descontar deudas previas y reformas.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-brand-600 font-bold mt-0.5">•</span>
                            <span><strong>La clave del éxito:</strong> La lectura correcta de la Certificación de Cargas. Si no entiendes el orden registral, heredarás las deudas del ejecutado.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-brand-600 font-bold mt-0.5">•</span>
                            <span><strong>El filtro profesional:</strong> Descarta las pujas guiadas por corazonadas. Fija tu Precio Máximo de Adjudicación (PMA) y no lo superes ni por un euro.</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-brand-600 font-bold mt-0.5">•</span>
                            <span><strong>Requisito BOE:</strong> 5% de depósito previo, disponer del capital restante en 40 días hábiles (financiación tradicional casi imposible).</span>
                        </li>
                    </ul>
                </div>

                <p className="text-xl text-slate-700 leading-relaxed font-light mb-10 first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:text-brand-700 first-letter:mr-3 first-letter:float-left">
                    El mercado de las subastas judiciales (BOE) no es Inmobiliaria 2.0. Es un terreno hostil, muy rentable para quienes dominan la técnica registral y la hoja de cálculo, y una trampa financiera letal para el comprador impulsivo.
                </p>
                
                <p>
                    Durante años, el ecosistema de las subastas estuvo controlado por subasteros, bancos y fondos buitre agrupados a la puerta de los juzgados. Tras la digitalización del Portal Único de Subastas del BOE, cualquiera con un Certificado Digital y liquidez puede participar. Pero la accesibilidad tecnológica no ha eliminado la complejidad legal: sigues comprando "a cuerpo cierto", asumiendo el estado físico del inmueble y los errores legales de tu propio análisis.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-10 text-sm text-slate-600 flex gap-4 items-start not-prose">
                     <Info className="text-brand-600 flex-shrink-0 mt-1" size={20} />
                     <div>
                         <p className="m-0 leading-relaxed">
                             Esta guía no es un folleto teórico. Está diseñada con una óptica forense y de inversión: <strong>qué buscar, cómo evitar los agujeros negros legales y cómo calcular si realmente estás haciendo un buen negocio</strong>.
                         </p>
                     </div>
                </div>

                {/* H2: POR QUÉ LA MAYORÍA PIERDE DINERO */}
                <h2 id="por-que-pierden" className="text-3xl mt-16 mb-8 flex items-center gap-3">
                    <AlertOctagon className="text-rose-600" /> Por qué la mayoría pierde dinero en subastas
                </h2>
                
                <p>
                    El error más común del inversor de fin de semana es aplicar la lógica de la compraventa tradicional al mercado de embargos. En el mercado libre, lo que ves es lo que compras, y el notario garantiza que adquieres libre de cargas. <strong>En el BOE, el riesgo se traslada del vendedor (que suele ser un deudor embargado que no coopera) al comprador.</strong>
                </p>

                <p>Hay tres agujeros negros donde desaparecen las rentabilidades y los ahorros:</p>

                <div className="grid gap-6 my-8 not-prose">
                    <div className="bg-white border text-left border-slate-200 p-6 rounded-2xl shadow-sm hover:border-rose-300 transition-colors">
                        <h3 className="font-bold text-slate-900 text-lg mb-3 flex items-center gap-2">
                            <span className="bg-rose-100 text-rose-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</span>
                            Cargas Ocultas Anteriores
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed m-0">
                            <strong>La falsa creencia:</strong> "El juzgado limpia todas las deudas". <br/>
                            <strong>La realidad:</strong> Según el Art. 674 de la LEC, solo se borran la carga que motivó la ejecución y las posteriores. Toda hipoteca, embargo o usufructo que ingresara al Registro de la Propiedad ANTES de la carga ejecutada, <em>te la quedas tú</em>. Si omites este análisis en la Certificación de Cargas, puedes pujar 100.000€ y "ganar de regalo" una hipoteca de 150.000€.
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:border-rose-300 transition-colors">
                        <h3 className="font-bold text-slate-900 text-lg mb-3 flex items-center gap-2">
                            <span className="bg-rose-100 text-rose-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</span>
                            La Trampa del Valor de Tasación (Tipo de Subasta)
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed m-0">
                            <strong>La falsa creencia:</strong> "Si el Tipo de Subasta es de 300.000€ y pujo 150.000€, ya he ganado 150.000€".<br/>
                            <strong>La realidad:</strong> Las escrituras hipotecarias previas a 2012 tenían valores de tasación a efectos de subasta infladísimos. Estás usando una métrica de hace 15 años para valorar un activo hoy. Tu puja debe basarse exclusivamente en un estudio de mercado actual (testigos comparables), <strong>jamás sobre el porcentaje del Tipo de Subasta.</strong>
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:border-rose-300 transition-colors">
                        <h3 className="font-bold text-slate-900 text-lg mb-3 flex items-center gap-2">
                            <span className="bg-rose-100 text-rose-600 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">3</span>
                            Ocupantes y Posesión Imposible
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed m-0">
                            <strong>La falsa creencia:</strong> "En cuanto pague, me dan las llaves".<br/>
                            <strong>La realidad:</strong> Si los residentes tienen un título legítimo previo (un alquiler antiguo de renta antigua, o un arrendamiento de buena fe), deberás respetarlo. Si son precaristas ("okupas"), deberás promover el lanzamiento. Cada mes extra de espera merma letalmente la Tasa Interna de Retorno (TIR) de tu inversión, más los miles de euros en IBI y cuotas de comunidad que seguirás debiendo por Afección Real.
                        </p>
                    </div>
                </div>

                <SaaSCtaBlock />

                {/* H2: PASO A PASO PROFUNDO */}
                <h2 id="paso-a-paso" className="text-3xl mt-16 mb-8 flex items-center gap-3">
                    <BookOpen className="text-brand-600" /> Paso a paso: Cómo comprar en el BOE
                </h2>

                <p>
                    A continuación, desgloso el protocolo exacto. Presta especial atención al contraste: qué hace el apostador promedio y qué hace el analista serio en cada fase.
                </p>

                <div className="space-y-12 my-12 not-prose">
                    
                    {/* PASO 1 */}
                    <div className="relative pl-8 md:pl-0">
                        <div className="hidden md:flex absolute left-0 top-0 w-12 h-12 rounded-2xl bg-brand-600 text-white items-center justify-center font-serif font-bold text-2xl shadow-lg z-10 -ml-6 -translate-x-12">
                            1
                        </div>
                        <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl shadow-sm">
                            <h3 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4">Filtrado y Selección en el BOE</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                Necesitas localizar propiedades viables en un mar de expedientes defectuosos. Usar el portal del BOE directamente es frustrante; sus filtros son opacos y la interfaz carece de agilidad.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl">
                                    <span className="text-rose-800 text-xs font-bold uppercase mb-2 block tracking-wider">El error del 90%</span>
                                    <p className="text-slate-700 text-sm m-0">Revisar a diario el portal del BOE, ilusionarse con fotos de Google Maps y basar su decisión inicial en el "dinero que tienen en el banco" vs "el Tipo de Subasta".</p>
                                </div>
                                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                                    <span className="text-emerald-800 text-xs font-bold uppercase mb-2 block tracking-wider">Metodología Pro</span>
                                    <p className="text-slate-700 text-sm m-0">Automatizar alertas. Cruzar inmediatamente la referencia catastral para tasar el inmueble, identificando de inmediato si el diferencial bruto proyectado es mayor del 25% exigido.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PASO 2 */}
                    <div className="relative pl-8 md:pl-0">
                        <div className="hidden md:flex absolute left-0 top-0 w-12 h-12 rounded-2xl bg-brand-600 text-white items-center justify-center font-serif font-bold text-2xl shadow-lg z-10 -ml-6 -translate-x-12">
                            2
                        </div>
                        <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl shadow-sm">
                            <h3 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4">Auditoría Registral (El Filtro de Fuego)</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                Sin exagerar: este documento separa a los inversores que multiplican capital de los que se arruinan en silencio. Tienes que leer la "Certificación de Cargas" anexa a la subasta, o pedir tú una Nota Simple actualizada si aquella es muy vieja.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl">
                                    <span className="text-rose-800 text-xs font-bold uppercase mb-2 block tracking-wider">El error del 90%</span>
                                    <p className="text-slate-700 text-sm m-0">No investigar la carga que se ejecuta, o creer que "Embargo Letra C" anula mágicamente la "Hipoteca Inscripción 2ª" que estaba dos páginas antes en el registro.</p>
                                </div>
                                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                                    <span className="text-emerald-800 text-xs font-bold uppercase mb-2 block tracking-wider">Metodología Pro</span>
                                    <p className="text-slate-700 text-sm m-0">Identificar quirúrgicamente qué Juzgado ordena qué carga. Cuantificar el capital pendiente exacto de todas las anotaciones registrales anteriores y sumarlo al gasto de la operación final.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PASO 3 */}
                    <div className="relative pl-8 md:pl-0">
                        <div className="hidden md:flex absolute left-0 top-0 w-12 h-12 rounded-2xl bg-brand-600 text-white items-center justify-center font-serif font-bold text-2xl shadow-lg z-10 -ml-6 -translate-x-12">
                            3
                        </div>
                        <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl shadow-sm">
                            <h3 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4">Estudio Financiero (Cálculo del PMA)</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                El P.M.A. (Precio Máximo de Adjudicación) es la línea sagrada. Debes contemplar los impuestos (el ITP se paga no sobre la puja en subasta, muchas veces, sino sobre el mayor valor, como el Valor de Referencia de Catastro en muchas Comunidades, mucho cuidado), IBI cuotas de la comunidad y adecuación.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl">
                                    <span className="text-rose-800 text-xs font-bold uppercase mb-2 block tracking-wider">El error del 90%</span>
                                    <p className="text-slate-700 text-sm m-0">Pujar compitiendo con otros. Sentir "adrenalina" y meter 5.000€ más en el último minuto de la subasta "porque la quiero", arruinando su rentabilidad neta.</p>
                                </div>
                                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                                    <span className="text-emerald-800 text-xs font-bold uppercase mb-2 block tracking-wider">Metodología Pro</span>
                                    <p className="text-slate-700 text-sm m-0">Uso de simuladores que desglosan ITP y márgenes. Entran a la subasta fría y robóticamente; pujan su PMA. Si se pasa 1€, la subasta es historia.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PASO 4 */}
                    <div className="relative pl-8 md:pl-0">
                        <div className="hidden md:flex absolute left-0 top-0 w-12 h-12 rounded-2xl bg-brand-600 text-white items-center justify-center font-serif font-bold text-2xl shadow-lg z-10 -ml-6 -translate-x-12">
                            4
                        </div>
                        <div className="bg-white border border-slate-200 p-6 md:p-8 rounded-3xl shadow-sm">
                            <h3 className="text-xl font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4">Consignación y Puja Telemática</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                Solo necesitas entrar al Portal con Certificado Electrónico, consignar el depósito previo obligatorio (5% del Tipo de Subasta, retenido temporalmente por la entidad adscrita) y establecer tu posición final.
                            </p>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl">
                                    <span className="text-rose-800 text-xs font-bold uppercase mb-2 block tracking-wider">El error del 90%</span>
                                    <p className="text-slate-700 text-sm m-0">Pedir dinero prestado o creer que el banco le dará una hipoteca mágica para pagar el remate total si resultase ganador, y perder el 5% de depósito inicial.</p>
                                </div>
                                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                                    <span className="text-emerald-800 text-xs font-bold uppercase mb-2 block tracking-wider">Metodología Pro</span>
                                    <p className="text-slate-700 text-sm m-0">Ya tienen consolidada la disponibilidad del 100% liquidez en cuenta u operaciones puente formales, y conocen perfectamente con qué porcentaje de la tasación lograrán la adjudicación firme directa (Art 670 de LEC).</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>


                {/* CÓMO ANALIZAR CORRECTAMENTE - SAAS INTEGRATION */}
                <h2 id="como-analizar" className="text-3xl mt-16 mb-8 flex items-center gap-3">
                    <Search className="text-brand-600" /> Analiza Subastas de Forma Técnica
                </h2>

                <p>
                    Ningún inversor profesional audita subastas leyendo a simple vista interminables faxes judiciales adjuntados al edicto. El volumen de PDFs es inabarcable. Si vas en serio con rentabilizar tu primer activo, necesitas pasar cada expediente por un tamiz financiero y jurídico riguroso avalado por métricas.
                </p>

                <div className="bg-slate-950 rounded-2xl md:rounded-3xl p-8 md:p-10 relative overflow-hidden not-prose shadow-2xl mt-16 mb-16 border border-slate-800">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-center">
                        <div className="space-y-6 max-w-xl">
                            <div>
                                <span className="text-brand-400 font-bold uppercase tracking-wider text-xs mb-3 block">Herramienta de Análisis Inteligente</span>
                                <h3 className="text-2xl md:text-3xl font-semibold text-white leading-tight">
                                    Audita Cargas, Simulaciones Fiscales y Rentabilidad Netizada Automáticamente
                                </h3>
                            </div>
                            <p className="text-slate-400 text-base leading-relaxed">
                                Descubre los agujeros que no ves. Cruza importes pendientes, embargos y tasas con el valor de mercado para desvelar el <strong>riesgo patrimonial efectivo</strong> antes de que comprometas ni tu depósito bancario ni tu tiempo, indicando al céntimo el Punto de Equilibrio o la T.A.E global esperada.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                                <Link to={ROUTES.ANALIZAR_SUBASTA} className="inline-flex items-center justify-center bg-brand-600 hover:bg-brand-500 text-white px-8 py-3.5 rounded-xl font-bold transition-all duration-200 w-full sm:w-auto shadow-lg shadow-brand-500/20">
                                    <Search size={18} className="mr-2 hidden sm:inline" />
                                    Analizar expediente en curso
                                </Link>
                                <Link to={ROUTES.PRO} className="inline-flex items-center justify-center bg-transparent border border-slate-700 hover:bg-slate-800 hover:border-slate-600 text-slate-300 px-6 py-3.5 rounded-xl font-medium transition-all duration-200 w-full sm:w-auto text-sm">
                                    Ver características PRO
                                </Link>
                            </div>
                        </div>
                        
                        <div className="bg-slate-800/80 hover:bg-slate-800 p-6 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all duration-300 shadow-inner h-fit max-w-sm mx-auto md:max-w-none w-full group">
                            <div className="flex justify-between items-center border-b border-slate-700/80 pb-4 mb-5">
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Métricas Clave</span>
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-300 font-medium">Descuento Real</span>
                                    <span className="text-emerald-400 font-bold text-lg">+ 34.2%</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-300 font-medium">Cargas Heredadas</span>
                                    <span className="text-rose-400 font-bold text-lg">14.050 €</span>
                                </div>
                                <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-700/50">
                                    <span className="text-white font-medium">PMA Seguro</span>
                                    <span className="text-white font-bold text-xl bg-slate-900 px-4 py-2 rounded-lg tracking-wide shadow-inner border border-slate-700/50 group-hover:border-slate-600 transition-all duration-300">165.400 €</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* DIFERENCIACIÓN USUARIO */}
                <h2 id="diferenciacion" className="text-3xl mt-16 mb-8 flex items-center gap-3">
                    <CheckCircle2 className="text-brand-600" /> Define tu Perfil Estratégico
                </h2>
                <p>Las reglas del juego financiero son diferentes dependiendo del objetivo que persigas a medio plazo. No puedes pujar bajo una mentalidad de especulador cortoplacista si necesitas disponer habitualmente la vivienda como hogar principal.</p>

                <div className="grid md:grid-cols-2 gap-6 my-10 not-prose">
                    <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
                                <TrendingUp size={20} />
                            </div>
                            <h4 className="font-bold text-slate-900 text-lg">Inversor (Flipping o Alquiler)</h4>
                        </div>
                        <ul className="text-sm text-slate-600 leading-relaxed mb-0 list-disc pl-5 space-y-2">
                            <li>Busca rentabilidad financiera por encima del 20% TIR o 5-8% de yield en alquileres brutos.</li>
                            <li>La ubicación es una mera variable del excel; evitan apegos urbanos.</li>
                            <li>Precisan de velocidad: si un lanzamiento o desahucio se va a alargar 14 meses e inmoviliza su capital orgánico de reinversión sistemática, desechan el lote.</li>
                        </ul>
                    </div>
                    <div className="bg-brand-50 border border-brand-200 p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0">
                                <CheckCircle2 size={20} />
                            </div>
                            <h4 className="font-bold text-brand-900 text-lg">Comprador Primera Vivienda</h4>
                        </div>
                        <ul className="text-brand-800 text-sm leading-relaxed mb-0 list-disc pl-5 space-y-2">
                            <li>El descuento no es especulativo, permite evitar la hipoteca del "gap" inicial frente a la compra a constructor.</li>
                            <li>Es crítico buscar adjudicaciones sobre lotes con características pacíficas (ej: viviendas donde el deudor entrega las llaves voluntariamente), para evitar conflictos largos.</li>
                            <li>Aceptan ganar menos en términos comparables y pueden permitirse pujar unos miles de euros más alto porque prorratearán ese precio menor sobre 30 años de residencia.</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 not-prose">
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to={ROUTES.ANALIZAR_SUBASTA} className="inline-flex items-center justify-center gap-2 bg-brand-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-brand-700 transition-colors shadow-sm w-full sm:w-auto">
                            Analizar subasta en curso <Search size={18} />
                        </Link>
                        <Link to={ROUTES.PRO} className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 font-bold py-3 px-8 rounded-xl hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm w-full sm:w-auto">
                            Ver Planes Pro
                        </Link>
                    </div>
                </div>

                {/* FAQ SECTION */}
                <h2 id="faq" className="text-3xl mt-20 mb-8 flex items-center gap-3">
                    <HelpCircle className="text-brand-600" /> Preguntas frecuentes (FAQ)
                </h2>
                
                <div className="space-y-4 not-prose">
                    {faqData.map((faq, index) => (
                        <details key={index} className="group bg-white border border-slate-200 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                            <summary className="flex items-center justify-between p-6 cursor-pointer text-slate-900 font-bold bg-slate-50 hover:bg-slate-100 transition-colors transition-all focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-inset">
                                {faq.question}
                                <span className="ml-4 flex-shrink-0 transition-transform duration-300 group-open:rotate-180 text-brand-600">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                </span>
                            </summary>
                            <div className="p-6 text-slate-600 text-sm leading-relaxed border-t border-slate-100 bg-white">
                                {faq.answer}
                            </div>
                        </details>
                    ))}
                </div>

            </article>
        </main>
        
        {/* SIDEBAR */}
        <aside className="lg:col-span-4">
          <div className="sticky top-28 space-y-10 max-h-[calc(100vh-120px)] overflow-auto pr-2 custom-scrollbar">

            {/* ÍNDICE DE CONTENIDOS (TOC) */}
            <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm mb-8">
                <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                    Índice de contenidos
                </h2>
                <ul className="space-y-2 list-none p-0 m-0">
                        <li>
                            <a href="#por-que-pierden" className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent">
                                <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Errores Comunes y Pérdidas</span>
                                <ChevronRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity group-hover:text-brand-500" />
                            </a>
                        </li>
                        <li>
                            <a href="#paso-a-paso" className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent">
                                <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Paso a paso en el BOE</span>
                                <ChevronRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity group-hover:text-brand-500" />
                            </a>
                        </li>
                        <li>
                            <a href="#como-analizar" className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent">
                                <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Cómo analizar correctamente</span>
                                <ChevronRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity group-hover:text-brand-500" />
                            </a>
                        </li>
                        <li>
                            <a href="#diferenciacion" className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent">
                                <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Perfil: Inversor vs Particular</span>
                                <ChevronRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity group-hover:text-brand-500" />
                            </a>
                        </li>
                        <li>
                            <a href="#faq" className="group flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent">
                                <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Preguntas frecuentes</span>
                                <ChevronRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity group-hover:text-brand-500" />
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
                    to={ROUTES.ANALIZAR_SUBASTA}
                    className="block w-full bg-brand-500 text-white font-bold py-4 px-4 rounded-xl text-center hover:bg-brand-600 transition-all flex items-center justify-center gap-2"
                >
                    Analizar subasta en curso <ArrowRight size={16}/>
                </Link>
                <Link 
                    to={ROUTES.PRO}
                    className="block w-full text-slate-300 font-bold py-3 mt-3 px-4 rounded-xl text-center hover:bg-slate-800 border border-slate-700 transition-all flex items-center justify-center gap-2 text-sm"
                >
                    Ver Planes Pro
                </Link>
            </div>

            {/* SATELLITE NAVIGATION */}
            <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
                <h4 className="font-bold text-slate-900 mb-6 flex items-center gap-2 text-sm uppercase tracking-wide">
                    <BookOpen size={18} className="text-brand-600"/>
                    Guías Relacionadas
                </h4>
                <nav className="space-y-4">
                    <Link to="/subastas-judiciales-espana" className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Subastas Judiciales</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to="/cargas-subasta-judicial-cancelacion" className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Cargas Registrales</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                    <Link to="/deposito-subasta-judicial-5-por-ciento" className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Depósito y Consignación</span>
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-brand-500"/>
                    </Link>
                     <Link to="/vivienda-ocupada-subasta-judicial" className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <span className="text-slate-600 text-sm font-medium group-hover:text-brand-700">Riesgo: Vivienda Ocupada</span>
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

export default ComoComprarSubastaPage;
