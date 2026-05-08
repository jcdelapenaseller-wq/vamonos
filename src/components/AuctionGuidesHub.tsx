import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Target, 
  AlertTriangle, 
  TrendingUp, 
  ChevronRight, 
  Search, 
  ArrowRight,
  ShieldCheck,
  FileText,
  Calculator,
  Gavel
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const guideSections = [
  {
    title: 'Cómo empezar en subastas',
    description: 'Conceptos fundamentales y el proceso paso a paso para tu primera puja. Entender el funcionamiento del portal de subastas del BOE es el primer paso para acceder a inmuebles con descuentos significativos.',
    icon: <BookOpen className="w-6 h-6 text-brand-600" />,
    seoText: 'Aprender cómo funcionan las subastas en España requiere conocer los plazos judiciales, la diferencia entre subastas de la AEAT y judiciales, y cómo gestionar el certificado digital para participar.',
    links: [
      { label: 'Cómo comprar en una subasta judicial', href: ROUTES.COMO_COMPRAR },
      { label: 'Guía básica de subastas judiciales', href: ROUTES.GUIDE_PILLAR },
      { label: 'Subastas Judiciales vs AEAT', href: ROUTES.COMPARISON },
      { label: 'Depósitos y consignaciones (5%)', href: ROUTES.DEPOSIT },
      { label: 'Glosario de términos técnicos', href: ROUTES.GLOSSARY },
      { label: '¿Merecen la pena las subastas?', href: ROUTES.WORTH_IT }
    ]
  },
  {
    title: 'Estrategia y pujas',
    description: 'Cómo calcular tu puja máxima y dominar la técnica de la Regla del 70%. Una estrategia de puja sólida es la diferencia entre una inversión rentable y una adjudicación con sobrecoste.',
    icon: <Target className="w-6 h-6 text-emerald-600" />,
    seoText: 'Saber qué necesitas antes de pujar incluye tener claro tu precio máximo de adjudicación (PMA) y entender el impacto de los impuestos (ITP/IVA) en el coste total de la operación.',
    links: [
      { label: 'Calculadora de puja máxima', href: ROUTES.CALCULATOR },
      { label: 'La Regla del 70% explicada', href: ROUTES.RULE_70 },
      { label: 'Cómo calcular cuánto pagar', href: ROUTES.HOW_MUCH_TO_PAY },
      { label: 'Estrategias de pujas ganadoras', href: ROUTES.MAX_BID },
      { label: '¿Qué pasa si nadie puja?', href: ROUTES.EMPTY }
    ]
  },
  {
    title: 'Riesgos y Seguridad',
    description: 'Evita los errores más comunes y aprende a detectar cargas ocultas. La seguridad jurídica en subastas judiciales depende de una auditoría previa de la certificación de cargas.',
    icon: <AlertTriangle className="w-6 h-6 text-rose-600" />,
    seoText: 'Identificar los riesgos más importantes como la posesión del inmueble (viviendas ocupadas) o deudas preferentes con la comunidad es vital para proteger tu capital.',
    links: [
      { label: 'Gestión de cargas y deudas', href: ROUTES.CHARGES },
      { label: 'Viviendas ocupadas: qué saber', href: ROUTES.OCCUPIED },
      { label: 'Errores fatales al pujar', href: ROUTES.ERRORS },
      { label: 'Cómo visitar el inmueble', href: ROUTES.VISIT }
    ]
  },
  {
    title: 'Inversión y Rentabilidad',
    description: 'Análisis financiero para inversores inmobiliarios profesionales. El mercado de subastas permite obtener activos off-market con márgenes inalcanzables en portales tradicionales.',
    icon: <TrendingUp className="w-6 h-6 text-blue-600" />,
    seoText: 'El análisis de rentabilidad en subastas debe contemplar no solo el precio de compra, sino también los gastos de saneamiento, cancelación de cargas y tiempos de posesión.',
    links: [
      { label: 'Protocolo de análisis experto', href: ROUTES.ANALYSIS },
      { label: 'Cálculo de rentabilidad real', href: ROUTES.PROFITABILITY },
      { label: 'Calculadora de rentabilidad', href: ROUTES.PROFITABILITY_CALC_GUIDE },
      { label: 'Cesión de remate explicada', href: ROUTES.ASSIGNMENT }
    ]
  }
];

const AuctionGuidesHub: React.FC = () => {
  useEffect(() => {
    document.title = "Guías de Subastas Judiciales en España | Activos Off-Market";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', "Aprende paso a paso cómo invertir en subastas judiciales y de la AEAT. Estrategias, riesgos, y funcionamiento técnico del BOE, sin humo.");
    }

    const canonicalUrl = 'https://activosoffmarket.es/guias-subastas';
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
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
              "name": "Guías",
              "item": canonicalUrl
            }
          ]
        },
        {
          "@type": "CollectionPage",
          "headline": "Guías de Subastas Judiciales en España",
          "description": "Aprende paso a paso cómo invertir en subastas judiciales y de la AEAT.",
          "mainEntity": {
            "@type": "ItemList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "url": `https://activosoffmarket.es${ROUTES.COMO_COMPRAR}`,
                "name": "Cómo ganar tu primera subasta"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "url": `https://activosoffmarket.es${ROUTES.ANALIZAR_SUBASTA}`,
                "name": "Guía de Análisis Experto"
              }
            ]
          }
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
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 md:pt-32 md:pb-24 border-b border-slate-100 bg-slate-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-100">
              Centro de Aprendizaje
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-6">
              Guías de Subastas Públicas
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-10">
              Todo lo que necesitas saber para invertir con seguridad en activos del BOE, 
              desde el análisis de cargas hasta la estrategia de puja máxima.
            </p>

              {/* Expanded SEO Intro Section */}
              <div className="max-w-4xl mx-auto text-left py-10 px-8 bg-white rounded-3xl border border-slate-100 shadow-sm mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-brand-50">
                    <ShieldCheck className="w-6 h-6 text-brand-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Cómo invertir en subastas con seguridad
                  </h2>
                </div>
                
                <div className="prose prose-slate text-slate-600 space-y-4 text-left max-w-5xl space-y-6 leading-relaxed prose-p:max-w-3xl prose-headings:max-w-3xl prose-li:max-w-3xl">
                  <p>
                    Las <strong>subastas públicas</strong> (judiciales, Seguridad Social o AEAT) son el mecanismo legal donde se liquidan bienes embargados para pagar deudas. Para el inversor particular, supone una entrada directa al mercado de activos <em>off-market</em> con descuentos significativos frente al precio de mercado tradicional.
                  </p>
                  <p>
                    Sin embargo, el potencial de rentabilidad siempre va atado a <strong>riesgos técnicos</strong>. ¿El principal? Las cargas registrales. Al adjudicarte un inmueble, no lo compras "limpio" por defecto. En muchos casos, heredas deudas anteriores (como hipotecas impagadas) o deudas preferentes encubiertas (IBI o cuotas de la comunidad de propietarios). Una lectura superficial de la <a href="/cargas-subasta-judicial" className="text-brand-600 font-medium hover:underline">certificación de cargas</a> puede destruir todo tu margen de beneficio.
                  </p>
                  <p>
                    Además, debes prever el estado físico y jurídico del bien. Muchas de estas viviendas se subastan <strong>ocupadas sin título</strong> o con precaristas, lo que significa que la toma de posesión requerirá un procedimiento de lanzamiento adicional que alargará la maduración de tu inversión entre 6 y 12 meses.
                  </p>
                  <p>
                    <strong>Nuestro enfoque es prudente y matemático.</strong> Antes de consignar el 5% de depósito obligatorio en el Portal del BOE, exige números fríos. Domina el <em>valor de tasación</em>, prevé el pago del Impuesto de Transmisiones Patrimoniales (ITP) correspondiente a tu comunidad, y nunca te dejes llevar por la urgencia. La rentabilidad en subastas no se gana el día de la puja, sino en el análisis previo del expediente.
                  </p>
                </div>
              </div>
          </motion.div>
        </div>
      </section>

      {/* Guide Grid */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Quick Access Links */}
          <div className="mb-16 flex flex-wrap justify-center gap-4">
            <Link 
              to={ROUTES.COMO_COMPRAR}
              className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:border-brand-500 hover:text-brand-600 transition-all shadow-sm"
            >
              Cómo ganar tu primera subasta
            </Link>
            <Link 
              to={ROUTES.ANALIZAR_SUBASTA}
              className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:border-brand-500 hover:text-brand-600 transition-all shadow-sm"
            >
              Guía de Análisis Experto
            </Link>
            <Link 
              to={ROUTES.MADRID}
              className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:border-brand-500 hover:text-brand-600 transition-all shadow-sm"
            >
              Subastas en Madrid
            </Link>
            <Link 
              to={ROUTES.BARCELONA}
              className="px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:border-brand-500 hover:text-brand-600 transition-all shadow-sm"
            >
              Subastas en Barcelona
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            {guideSections.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group flex flex-col h-full"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-white shadow-sm border border-slate-100 group-hover:shadow-md transition-all group-hover:-translate-y-1">
                    {section.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{section.title}</h2>
                    <p className="text-slate-500 leading-snug">{section.description}</p>
                  </div>
                </div>

                {/* NEW SEO text for blocks */}
                <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100 mb-6 text-sm text-slate-600 leading-relaxed">
                  {section.seoText}
                </div>
                
                <div className="grid grid-cols-1 gap-2 mt-auto">
                  {section.links.map((link, lIdx) => (
                    <Link
                      key={lIdx}
                      to={link.href}
                      className="flex items-center justify-between p-4 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-all text-slate-700 font-medium group/link"
                    >
                      <span className="group-hover/link:translate-x-1 transition-transform">{link.label}</span>
                      <ChevronRight size={18} className="text-slate-300 group-hover/link:text-brand-500 transition-colors" />
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW Final SEO Summary Section */}
      <section className="py-20 px-4 bg-slate-50/30 border-t border-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-slate text-left max-w-5xl space-y-6 leading-relaxed prose-p:max-w-3xl prose-headings:max-w-3xl prose-li:max-w-3xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Resumen estratégico para invertir en activos del BOE</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-600 leading-relaxed">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-3">Maximizar beneficios</h3>
                <p className="text-sm">
                  La clave para obtener rentabilidad en subastas inmobiliarias reside en el análisis de datos. No te bases en intuiciones; utiliza nuestra calculadora de subastas y sigue el protocolo experto para determinar si un activo es realmente una oportunidad o una trampa de liquidez. Especialmente en mercados competitivos como Madrid o Barcelona, la velocidad de análisis marca la diferencia.
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-3">Reducir la incertidumbre</h3>
                <p className="text-sm">
                  Cada subasta judicial tiene sus propias reglas. Desde el remate hasta la toma de posesión, dominar los tiempos procesales te permitirá planificar mejor tus flujos de caja y evitar retrasos innecesarios en la recuperación de tu inversión. Entender cómo funcionan las cargas posteriores y anteriores es el seguro de vida del inversor profesional.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW SEO FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">Preguntas Frecuentes sobre Subastas BOE</h2>
          
          <div className="space-y-8">
            <div className="border-b border-slate-100 pb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">¿Qué significa que una subasta sea judicial?</h3>
              <p className="text-slate-600 leading-relaxed">
                Es un proceso de venta forzosa ordenado por un juzgado para pagar una deuda. A diferencia de las subastas de la AEAT, las judiciales suelen tener plazos más largos pero ofrecen mayores garantías procesales si cuentas con un buen análisis previo.
              </p>
            </div>
            
            <div className="border-b border-slate-100 pb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">¿Se puede visitar un piso de subasta?</h3>
              <p className="text-slate-600 leading-relaxed">
                Legalmente no hay obligación de permitir visitas, ya que el inmueble suele estar en manos del deudor. Sin embargo, existen protocolos y estrategias para evaluar el estado real del activo y en algunos casos contactar con la posesión para facilitar una salida negociada.
              </p>
            </div>
            
            <div className="border-b border-slate-100 pb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-3">¿Qué cargas se heredan al adjudicarse una subasta?</h3>
              <p className="text-slate-600 leading-relaxed">
                Como regla general, el adjudicatario hereda las cargas anteriores a la que motiva la subasta y las deudas preferentes (Comunidad de Propietarios e IBI de los años correspondientes). Las cargas posteriores suelen cancelarse mediante el mandamiento de cancelación de cargas.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">¿Cuánto tiempo tarda la toma de posesión?</h3>
              <p className="text-slate-600 leading-relaxed">
                El plazo varía según el juzgado y la situación de la vivienda (vacía u ocupada). Puede oscilar entre 4 meses y más de un año. Es fundamental incluir este tiempo en tu cálculo de rentabilidad financiera.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 bg-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/50 rounded-3xl p-8 md:p-12 border border-slate-700/50 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500/0 via-brand-500 to-brand-500/0" />
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                ¿Tienes una subasta identificada?
              </h3>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto text-lg leading-relaxed">
                Calcula la viabilidad financiera y detecta riesgos antes de consignar tu depósito.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={ROUTES.ANALIZAR_SUBASTA}
                  className="w-full sm:w-auto px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <Search size={20} />
                  Analizar Subasta
                </Link>
                <Link
                  to={ROUTES.PRO}
                  className="w-full sm:w-auto px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck size={20} />
                  Acceso Pro
                </Link>
              </div>
              
              <div className="mt-8 flex flex-wrap justify-center gap-6">
                {[
                  { icon: <Calculator size={16} />, label: 'Calculadora' },
                  { icon: <FileText size={16} />, label: 'Protocolo' },
                  { icon: <Gavel size={16} />, label: 'BOE' }
                ].map((chip, cIdx) => (
                  <div key={cIdx} className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-widest font-bold">
                    {chip.icon}
                    {chip.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <div className="py-12 text-center border-t border-slate-50">
        <p className="text-slate-400 text-sm font-medium tracking-wide">
          activosoffmarket.es &bull; Especialistas en Análisis de Subastas
        </p>
      </div>
    </div>
  );
};

export default AuctionGuidesHub;
