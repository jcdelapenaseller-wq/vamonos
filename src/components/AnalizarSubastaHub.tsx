import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  UploadCloud, 
  ShieldCheck, 
  FileText, 
  Search, 
  CheckCircle, 
  Star, 
  Scale, 
  Cpu, 
  BookOpen, 
  CreditCard, 
  ChevronDown, 
  ArrowRight,
  ShieldAlert,
  Shield,
  Home,
  Gavel,
  Info,
  Landmark,
  AlertTriangle,
  UserX,
  FileLock,
  Zap,
  Lock,
  Download,
  Eye,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../contexts/UserContext';
import LoadAnalysisBlock from './LoadAnalysisBlock';
import SoftGateModal from './SoftGateModal';
import PaymentModal from './PaymentModal';
import Header from './Header';
import Footer from './Footer';

const AnalizarSubastaHub: React.FC = () => {
  const { plan, user, isLogged } = useUser();
  const location = useLocation();
  const uploaderRef = useRef<HTMLDivElement>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [showUploader, setShowUploader] = useState(false);

  useEffect(() => {
    // SEO Meta Tags
    document.title = "Analizador de Nota Simple y Cargas Registrales | Activos Off-Market";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Detecta cargas, hipotecas y embargos en tu nota simple. IA jurídica especializada para subastas. Informe profesional en minutos.');
    }

    const metaRobots = document.querySelector('meta[name="robots"]');
    if (metaRobots) {
      metaRobots.setAttribute('content', 'index, follow, max-image-preview:large');
    }

    // Canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', 'https://activosoffmarket.es/analizar-subasta');

    // Open Graph
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Analiza tu nota simple antes de pujar | IA Jurídica');
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', 'Detecta cargas, hipotecas y embargos en tu nota simple. IA jurídica especializada para subastas.');

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', 'https://activosoffmarket.es/og-analisis.jpg');

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', 'https://activosoffmarket.es/analizar-subasta');

    // JSON-LD Structured Data
    const scriptId = 'seo-structured-data';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const structuredData = [
      {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": "Analizador de nota simple",
        "applicationCategory": "FinanceApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "2.99",
          "priceCurrency": "EUR"
        }
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Para qué sirve analizar una nota simple?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sirve para detectar cargas, hipotecas y embargos que el comprador debe asumir tras la subasta, evitando sorpresas legales."
            }
          },
          {
            "@type": "Question",
            "name": "¿Detecta cargas ocultas?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Identifica todas las cargas inscritas en el registro, incluyendo afecciones fiscales y limitaciones que no aparecen a simple vista."
            }
          },
          {
            "@type": "Question",
            "name": "¿Sirve para subastas BOE?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sí, es ideal para analizar la certificación de cargas y la nota simple antes de pujar en cualquier subasta del BOE."
            }
          }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Analizador de Nota Simple",
        "description": "Herramienta de IA para el análisis de cargas registrales en subastas."
      },
      {
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
            "name": "Analizar Subasta",
            "item": "https://activosoffmarket.es/analizar-subasta"
          }
        ]
      }
    ];
    script.text = JSON.stringify(structuredData);

    return () => {
      // Cleanup if needed
    };
  }, []);

  const usage = user?.analysisUsed || 0;
  const planLimit = plan === 'free' ? 1 : plan === 'basic' ? 3 : 5;
  const isBlocked = isLogged && usage >= planLimit;

  const handleAnalyzeClick = () => {
    if (!isLogged) {
      setShowLoginModal(true);
    } else if (isBlocked) {
      setShowPaymentModal(true);
    } else {
      setShowUploader(true);
      setTimeout(() => {
        uploaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const scrollToUploader = () => {
    if (!showUploader) {
      handleAnalyzeClick();
    } else {
      uploaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleShowSoftGate = () => {
    if (!isLogged) {
      setShowLoginModal(true);
    } else if (isBlocked) {
      setShowPaymentModal(true);
    }
  };

  const faqs = [
    {
      q: "¿Es ChatGPT? ¿Qué diferencia?",
      a: "No. Es un modelo de IA propietario optimizado y entrenado por juristas con miles de documentos registrales reales, capaz de interpretar el lenguaje técnico del Registro de la Propiedad. A diferencia de una IA genérica, entiende la Ley Hipotecaria española."
    },
    {
      q: "¿Sirve para subastas?",
      a: "Sí, está específicamente diseñado para subastas judiciales y administrativas en España. Analiza Notas Simples y Certificaciones de Cargas para detectar riesgos antes de que pujes."
    },
    {
      q: "¿Recibo PDF?",
      a: "Sí, tras el análisis obtienes un informe profesional descargable en formato PDF con todos los hallazgos, riesgos y la conclusión jurídica clara."
    },
    {
      q: "¿Puedo usarlo gratis? ¿Puedo usarlo sin suscripción?",
      a: "Sí, todos los usuarios registrados tienen 1 crédito FREE para probar la potencia de nuestra tecnología. Además, puedes pagar por análisis individuales sin necesidad de suscribirte a ningún plan."
    }
  ];

  return (
    <div className="bg-slate-950 min-h-screen selection:bg-brand-500/30">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-32 md:pb-48 overflow-hidden">
        {/* Premium Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-600/20 rounded-full blur-[120px] opacity-40 animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(15,23,42,0)_0%,rgba(2,6,23,1)_80%)]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            {/* Trust Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex flex-wrap justify-center gap-3 md:gap-6 px-6 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 mb-6 md:mb-8 shadow-2xl"
            >
              <div className="flex items-center gap-2 text-emerald-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                <Check size={14} strokeWidth={3} /> IA jurídica especializada
              </div>
              <div className="flex items-center gap-2 text-emerald-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                <Check size={14} strokeWidth={3} /> Juristas expertos
              </div>
              <div className="flex items-center gap-2 text-emerald-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                <Check size={14} strokeWidth={3} /> Informe profesional PDF
              </div>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-7xl font-serif font-bold text-white mb-4 md:mb-6 leading-[1.1] tracking-tight line-clamp-2 md:line-clamp-none"
            >
              Analiza tu nota simple <br className="hidden md:block" /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-blue-400">antes de pujar</span>
            </motion.h1>

            {/* SEO Hidden Content - Intro */}
            <div className="sr-only">
              <p>Analizar la nota simple antes de pujar en una subasta del BOE es el paso más crítico para cualquier inversor inmobiliario en España. Una nota simple del Registro de la Propiedad es un documento informativo que resume la situación jurídica actual de una finca. En ella se detallan la titularidad, la descripción de la propiedad y, lo más importante, las cargas registrales que pesan sobre ella.</p>
              <p>Cuando hablamos de cargas registrales, nos referimos a cualquier gravamen o limitación que afecte al dominio de la propiedad. Las más comunes son las hipotecas, los embargos judiciales o administrativos, las servidumbres y las afecciones fiscales. Ignorar estas cargas puede llevar a adquirir una propiedad con deudas que el adjudicatario de la subasta deberá asumir. Por ejemplo, una hipoteca anterior a la carga que ejecuta la subasta no se cancela, sino que permanece viva y el nuevo dueño debe hacerse cargo de ella.</p>
              <p>Nuestro analizador de nota simple utiliza inteligencia artificial jurídica entrenada específicamente en el derecho registral español y la Ley Hipotecaria. El sistema es capaz de leer y extraer automáticamente la información relevante de las notas simples y certificaciones de cargas, identificando riesgos que a menudo pasan desapercibidos para el ojo no experto. Detectamos embargos de la Seguridad Social, de la AEAT, hipotecas de rango preferente y limitaciones dispositivas.</p>
              <p>Realizar un análisis exhaustivo de las cargas antes de participar en subastas judiciales o notariales permite calcular con precisión el coste real de la inversión. No se trata solo del precio de la puja, sino de la suma de las cargas que permanecen y los gastos de cancelación. Con nuestro informe profesional, obtendrás una visión clara de la viabilidad jurídica de la operación, evitando sorpresas legales y financieras que podrían arruinar tu rentabilidad.</p>
            </div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base md:text-2xl text-slate-400 mb-4 leading-relaxed max-w-2xl px-4 md:px-0"
            >
              Detecta cargas, embargos y riesgos legales con IA jurídica especializada + revisión experta.
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-[10px] md:text-sm font-bold text-brand-400 uppercase tracking-[0.2em] mb-8 md:mb-12"
            >
              Entrenada en derecho registral español
            </motion.p>

            {/* Hero CTA / Uploader */}
            <AnimatePresence mode="wait">
              {!showUploader ? (
                <motion.div 
                  key="cta-button"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: 0.3 }}
                  className="w-full max-w-md"
                >
                  <button 
                    onClick={handleAnalyzeClick}
                    className="w-full py-6 md:py-8 bg-brand-600 text-white rounded-[24px] md:rounded-[32px] font-black text-2xl md:text-3xl hover:bg-brand-500 transition-all shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:shadow-[0_20px_60px_rgba(37,99,235,0.4)] hover:-translate-y-1 flex items-center justify-center gap-4 uppercase tracking-wider"
                  >
                    <UploadCloud size={32} />
                    Analizar cargas
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="uploader-block"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full max-w-2xl relative group px-2 md:px-0"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-brand-500 to-blue-500 rounded-[36px] blur opacity-20"></div>
                  <div ref={uploaderRef} className="relative bg-white/80 backdrop-blur-xl p-1.5 md:p-3 rounded-[32px] shadow-2xl overflow-hidden border border-white/20">
                    <LoadAnalysisBlock 
                      boeId="manual-upload" 
                      initialStep="upload"
                      isIntegrated={true}
                      noMargin={true}
                      analysisType="cargas"
                      isStandalone={true}
                      onShowSoftGate={handleShowSoftGate}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Social Proof below CTA */}
            <div className="flex flex-col items-center gap-6 mt-12">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                <div className="flex items-center gap-4">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-6 md:h-8" referrerPolicy="no-referrer" />
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 md:w-[18px] md:h-[18px]" fill="currentColor" />)}
                    </div>
                    <span className="text-white font-bold text-lg md:text-xl">4.9</span>
                  </div>
                </div>
                <span className="text-slate-400 font-medium text-base md:text-lg text-center">Usado por más de 1.000 inversores y ahorradores</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="py-24 bg-white rounded-t-[60px] relative z-20 -mt-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6">Cómo funciona el análisis de cargas</h2>
            <p className="text-slate-500 text-lg">Tres pasos para tu seguridad jurídica al analizar nota simple online</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: "1", title: "Subes nota simple o certificado", desc: "Sube el PDF del registro o la certificación de cargas del BOE.", icon: <UploadCloud className="text-brand-600" size={32} /> },
              { step: "2", title: "IA jurídica analiza", desc: "Detectamos cargas, embargos y riesgos automáticamente en segundos.", icon: <Search className="text-brand-600" size={32} /> },
              { step: "3", title: "Recibes informe profesional", desc: "Obtén un PDF estructurado con la conclusión jurídica clara.", icon: <FileText className="text-brand-600" size={32} /> }
            ].map((item, i) => (
              <div key={i} className="relative group">
                <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 shadow-sm transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-2 group-hover:bg-white h-full">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-500 border border-slate-100">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-lg">{item.desc}</p>
                </div>
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-xl rotate-12 group-hover:rotate-0 transition-transform duration-500">
                  {item.step}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Qué incluye el informe */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full -mr-16 -mt-16"></div>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-8">Analizar nota simple: qué incluye el informe</h2>
                <ul className="space-y-6">
                  {[
                    { title: "Resumen ejecutivo", desc: "Conclusión jurídica inmediata sobre la viabilidad de la puja." },
                    { title: "Desglose de cargas", desc: "Listado detallado de hipotecas, embargos y afecciones fiscales." },
                    { title: "Cargas preferentes", desc: "Identificación de deudas que NO se cancelan tras la subasta." },
                    { title: "Alertas de riesgo", desc: "Avisos sobre caducidad de anotaciones o defectos registrales." }
                  ].map((item, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-1">
                        <Check size={14} strokeWidth={3} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">{item.title}</h4>
                        <p className="text-slate-500">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-2xl md:text-4xl font-serif font-bold text-slate-900 mb-6">IA entrenada en derecho registral español</h3>
              <p className="text-lg text-slate-500 mb-8 leading-relaxed">
                Nuestro sistema no solo extrae datos; interpreta la situación jurídica de la finca basándose en la Ley Hipotecaria. Detectamos riesgos que otros pasan por alto, dándote la seguridad necesaria para invertir en subastas BOE.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-600 shadow-sm">Basado en Ley Hipotecaria</div>
                <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-600 shadow-sm">Revisión experta</div>
                <div className="px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm font-bold text-slate-600 shadow-sm">IA Jurídica</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qué analiza */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4 md:mb-6">Qué analiza nuestra IA jurídica</h2>
            <p className="text-slate-500 text-base md:text-lg">Cobertura total de riesgos registrales y certificación de cargas</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { title: "Hipotecas", icon: <Home size={24} /> },
              { title: "Embargos", icon: <Gavel size={24} /> },
              { title: "Cargas preferentes", icon: <Shield size={24} /> },
              { title: "Servidumbres", icon: <Info size={24} /> },
              { title: "Deudas ocultas", icon: <Landmark size={24} /> },
              { title: "Riesgos jurídicos", icon: <AlertTriangle size={24} /> },
              { title: "Limitaciones", icon: <FileLock size={24} /> }
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-3 md:gap-4 p-6 md:p-8 bg-slate-50 border border-slate-100 rounded-[24px] md:rounded-[32px] shadow-sm hover:shadow-md hover:border-brand-200 transition-all group">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-white text-slate-400 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:text-brand-600 transition-colors">
                  {React.cloneElement(item.icon as React.ReactElement, { size: window.innerWidth < 768 ? 20 : 24 })}
                </div>
                <span className="font-bold text-slate-900 text-base md:text-lg">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciación */}
      <section className="py-20 md:py-32 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500 opacity-10 blur-[120px] rounded-full"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-widest mb-6 md:mb-8 border border-brand-500/30">
                Tecnología + Derecho
              </div>
              <h2 className="text-3xl md:text-6xl font-serif font-bold mb-6 md:mb-8 leading-tight">Ahorra tiempo e invierte con ventaja</h2>
              <p className="text-lg md:text-xl text-slate-400 mb-8 md:mb-12 leading-relaxed">
                Nuestra IA ha sido entrenada específicamente por juristas expertos en derecho registral e hipotecario español. No solo lee texto, entiende las implicaciones legales de cada asiento registral.
              </p>
              
              <ul className="grid grid-cols-1 gap-6">
                {[
                  "Aplicación ley hipotecaria",
                  "Interpretación registral",
                  "Clasificación jurídica cargas",
                  "Recomendación legal",
                  "Informe para inversores"
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-4 group">
                    <div className="w-8 h-8 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 group-hover:bg-brand-500 group-hover:text-white transition-all">
                      <Check size={18} strokeWidth={3} />
                    </div>
                    <span className="text-slate-200 text-lg font-medium">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { title: "IA jurídica", icon: <Cpu size={32} /> },
                  { title: "Ley hipotecaria", icon: <Scale size={32} /> },
                  { title: "Derecho registral", icon: <BookOpen size={32} /> },
                  { title: "Revisión experta", icon: <ShieldCheck size={32} /> }
                ].map((item, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-xl p-10 rounded-[40px] border border-white/10 flex flex-col items-center text-center group hover:bg-white/10 transition-all">
                    <div className="text-brand-400 mb-6 group-hover:scale-110 transition-transform duration-500">
                      {item.icon}
                    </div>
                    <span className="text-sm font-bold uppercase tracking-widest text-slate-300">{item.title}</span>
                  </div>
                ))}
              </div>
              {/* Decorative Glow */}
              <div className="absolute -inset-4 bg-brand-500/20 blur-[60px] -z-10 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-4 md:mb-6">Precio del análisis de cargas</h2>
            <p className="text-slate-500 text-base md:text-lg">Sin suscripciones, paga solo por lo que necesitas para ver cargas nota simple</p>
          </div>

          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-[32px] md:rounded-[48px] border-2 border-slate-900 p-8 md:p-16 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-slate-900 text-white px-6 md:px-10 py-2 md:py-3 rounded-bl-[24px] md:rounded-bl-[32px] text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
                Producto único
              </div>
              
              <div className="mb-8 md:mb-10">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 md:mb-3">Análisis de cargas</h3>
                <p className="text-slate-500 text-base md:text-lg">Informe jurídico detallado en PDF</p>
              </div>

              <div className="flex items-baseline gap-2 md:gap-3 mb-8 md:mb-12">
                <span className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tighter">2,99€</span>
                <span className="text-slate-400 font-bold uppercase text-[10px] md:text-sm tracking-widest">/ Informe</span>
              </div>

              <ul className="space-y-4 md:space-y-6 mb-10 md:mb-12">
                {[
                  "Detección hipotecas",
                  "Embargos y deudas",
                  "Riesgos ocupación",
                  "Recomendación jurídica",
                  "Informe PDF profesional"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 md:gap-4">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={3} />
                    </div>
                    <span className="text-slate-700 text-base md:text-lg font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={scrollToUploader}
                className="w-full py-4 md:py-6 bg-slate-900 text-white rounded-[16px] md:rounded-[24px] font-bold text-lg md:text-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 mb-6 md:mb-8 flex items-center justify-center gap-3"
              >
                Analizar nota simple <ArrowRight size={20} />
              </button>

              <div className="text-center pt-6 md:pt-8 border-t border-slate-100">
                <Link to="/pro" className="block text-lg md:text-xl text-brand-600 font-black hover:text-brand-700 transition-colors mb-2">
                  Gratis con tu plan BASIC o PRO
                </Link>
                <Link to="/pro" className="inline-flex items-center gap-2 text-slate-400 font-bold hover:underline text-sm md:text-base">
                  Ver todos los planes <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Reassurance Grid */}
            <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center">
              {[
                { text: "Sin suscripción", icon: <Lock size={18} />, color: "text-blue-500", bg: "bg-blue-50" },
                { text: "Pago único", icon: <CreditCard size={18} />, color: "text-emerald-500", bg: "bg-emerald-50" },
                { text: "Informe inmediato", icon: <Zap size={18} />, color: "text-amber-500", bg: "bg-amber-50" },
                { text: "Datos confidenciales", icon: <ShieldCheck size={18} />, color: "text-brand-500", bg: "bg-brand-50" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 md:gap-3 group">
                  <div className={`w-10 h-10 md:w-12 md:h-12 ${item.bg} rounded-xl md:rounded-2xl flex items-center justify-center ${item.color} shadow-sm group-hover:scale-110 transition-all duration-300`}>
                    {item.icon}
                  </div>
                  <span className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Simple CTA Section */}
      <section className="py-16 md:py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <button 
            onClick={scrollToUploader}
            className="w-full md:w-auto px-12 py-5 bg-brand-600 text-white rounded-2xl font-bold text-xl hover:bg-brand-700 transition-all shadow-xl shadow-brand-200 flex items-center justify-center gap-3 mx-auto"
          >
            Analizar cargas <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6">Preguntas frecuentes sobre nota simple</h2>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "¿Para qué sirve analizar una nota simple?",
                a: "Analizar la nota simple antes de pujar evita sorpresas legales. Sirve para detectar cargas registrales, hipotecas nota simple y embargos registro propiedad que el comprador debe asumir tras la subasta."
              },
              {
                q: "¿Detecta cargas ocultas?",
                a: "Nuestra IA jurídica especializada identifica todas las cargas inscritas en el registro, incluyendo afecciones fiscales, servidumbres y limitaciones que no aparecen a simple vista en una lectura rápida."
              },
              {
                q: "¿Sirve para subastas BOE?",
                a: "Sí, está optimizado para analizar tanto la nota simple informativa como la certificación de cargas del BOE en subastas judiciales, administrativas y notariales."
              },
              {
                q: "¿Incluye informe jurídico?",
                a: "Sí, tras el análisis obtienes un informe profesional descargable en PDF con la clasificación jurídica de las cargas y una conclusión clara sobre los riesgos registrales detectados."
              },
              {
                q: "¿Necesito enlace de subasta?",
                a: "No es necesario. Solo tienes que subir el PDF de la nota simple o la certificación de cargas para que nuestra IA realice el análisis inmediato."
              },
              {
                q: "¿Cuánto tarda el análisis?",
                a: "El proceso es inmediato. La IA procesa el documento en segundos y genera el informe profesional al instante, ahorrándote horas de revisión manual."
              }
            ].map((faq, i) => (
              <details key={i} className="group bg-slate-50 rounded-[32px] border border-slate-100 overflow-hidden transition-all duration-300 hover:bg-white hover:shadow-xl hover:border-brand-100">
                <summary className="flex items-center justify-between p-8 cursor-pointer list-none">
                  <span className="text-xl font-bold text-slate-900 pr-8">{faq.q}</span>
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-open:rotate-180 transition-transform duration-500">
                    <ChevronDown size={20} className="text-slate-400" />
                  </div>
                </summary>
                <div className="px-8 pb-8 text-slate-500 text-lg leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Hidden Content - Final */}
      <div className="sr-only">
        <p>Entender qué es una nota simple y cómo interpretar las cargas registrales es fundamental para el éxito en las subastas públicas. La nota simple informativa es el documento que emite el Registro de la Propiedad para dar publicidad a los asientos vigentes sobre una finca. Aunque no tiene la fe pública de una certificación, es la herramienta más ágil para conocer el estado de una propiedad.</p>
        <p>Las cargas registrales son anotaciones que indican que la propiedad responde de una deuda o está sujeta a una limitación. En el contexto de las subastas del BOE, es vital distinguir entre cargas posteriores (que se cancelan tras la subasta) y cargas anteriores o preferentes (que subsisten). La Ley Hipotecaria española establece el principio de prioridad registral: 'prior tempore, potior iure' (primero en el tiempo, mejor en el derecho). Esto significa que si compras una casa en una subasta por un embargo posterior a una hipoteca, la hipoteca seguirá existiendo y tú serás el responsable de pagarla.</p>
        <p>Los riesgos al pujar sin un análisis previo son múltiples. Además de las hipotecas anteriores, puedes encontrarte con embargos preventivos, prohibiciones de disponer, condiciones resolutorias o incluso derechos de superficie. Otro aspecto crítico es la certificación de cargas, un documento más extenso que el juzgado solicita al registro al inicio del procedimiento de apremio. Analizar tanto la nota simple actualizada como la certificación de cargas es la única forma de tener una seguridad jurídica plena.</p>
        <p>¿Cómo analizar una nota simple de forma efectiva? Primero, verifica la descripción de la finca para asegurar que coincide con la realidad física. Segundo, comprueba la titularidad y el estado civil de los dueños (por ejemplo, si es vivienda habitual y hay cónyuges no deudores). Tercero, y más importante, desglosa cada una de las cargas por fecha de inscripción y tipo de procedimiento.</p>
        <p>Nuestro servicio de análisis de cargas mediante IA jurídica simplifica este proceso complejo. El sistema identifica automáticamente la naturaleza de cada anotación, calcula la vigencia de las afecciones fiscales y alerta sobre riesgos específicos como la caducidad de las anotaciones de embargo. Este nivel de detalle es esencial para inversores que buscan profesionalizar su actividad en subastas judiciales, administrativas y notariales.</p>
        <p>En España, el mercado de subastas ofrece grandes oportunidades, pero solo para aquellos que hacen sus deberes. La transparencia del registro de la propiedad es nuestra mayor aliada, pero su lenguaje técnico puede ser una barrera. Al utilizar tecnología especializada, democratizamos el acceso a la inversión segura, permitiendo que tanto ahorradores como inversores profesionales tomen decisiones basadas en datos y no en suposiciones. Recuerda: en una subasta, lo que no ves en la nota simple es lo que más caro te puede salir.</p>
      </div>

      {/* Final CTA */}
      <section className="py-20 md:py-32 relative overflow-hidden mx-4 md:mx-10 mb-10 rounded-[40px] md:rounded-[60px]">
        <div className="absolute inset-0 bg-slate-900"></div>
        <div className="absolute top-0 right-0 w-full h-full opacity-20">
          <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-brand-600 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600 rounded-full blur-[150px]"></div>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-7xl font-serif font-bold text-white mb-6 md:mb-8 tracking-tight">¿Tienes una nota simple?</h2>
          <p className="text-lg md:text-2xl text-slate-400 mb-10 md:mb-16 max-w-2xl mx-auto leading-relaxed">Descubre qué cargas tiene y evita sorpresas desagradables antes de pujar.</p>
          <button 
            onClick={scrollToUploader}
            className="w-full md:w-auto px-8 md:px-12 py-5 md:py-7 bg-brand-500 text-white rounded-[20px] md:rounded-[28px] font-bold text-xl md:text-2xl hover:bg-brand-400 transition-all shadow-2xl shadow-brand-500/20 flex items-center justify-center gap-4 mx-auto group"
          >
            <UploadCloud size={32} className="group-hover:scale-110 transition-transform" />
            Subir nota simple
          </button>
          <p className="mt-8 md:mt-10 text-slate-500 text-[10px] md:text-sm font-bold uppercase tracking-[0.3em]">Informe profesional en menos de 2 minutos</p>
        </div>
      </section>

      {/* Modals for the funnel */}
      <SoftGateModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        origin="limit_analysis"
      />
      
      <PaymentModal 
        isOpen={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)} 
        type="cargas"
        auctionId="manual-upload"
      />
    </div>
  );
};

export default AnalizarSubastaHub;

