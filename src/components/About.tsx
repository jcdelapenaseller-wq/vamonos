import React, { useEffect } from 'react';
import { ShieldCheck, Search, X, Calculator, BookOpen, ArrowRight, Activity, LineChart, Linkedin, Star, User, Send, FileText, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const About: React.FC = () => {

  useEffect(() => {
    // SEO: E-E-A-T Optimization
    document.title = "Activos Off-Market | Análisis de subastas BOE";
    
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', "Conoce al analista detrás de Activos Off-Market. Auditoría jurídica de subastas BOE, análisis de cargas y selección de oportunidades.");
    }
    
    // Attempt canonical (for client side hydration/routing context)
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', "https://activosoffmarket.es/equipo");
    } else {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      canonical.setAttribute('href', "https://activosoffmarket.es/equipo");
      document.head.appendChild(canonical);
    }

    // Schema.org Data (AboutPage + Person)
    const schemaData = {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "Activos Off-Market | Análisis de subastas BOE",
      "url": "https://activosoffmarket.es/equipo",
      "description": "Conoce al analista detrás de Activos Off-Market. Auditoría jurídica de subastas BOE, análisis de cargas y selección de oportunidades.",
      "mainEntity": {
        "@type": "Person",
        "name": "José Carlos de la Peña",
        "jobTitle": "Analista y Jurista Especializado en Subastas BOE",
        "knowsAbout": ["Subastas BOE", "Auditoría Jurídica", "Derecho Inmobiliario", "Ejecuciones Hipotecarias", "Análisis de Cargas Registrales"],
        "url": "https://activosoffmarket.es/equipo",
        "image": "https://activosoffmarket.es/jose-de-la-pena-subastas-boe.jpg",
        "sameAs": [
          "https://www.linkedin.com/in/josecarlosdelapena/"
        ]
      }
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schemaData);
    script.id = 'equipo-schema';
    document.head.appendChild(script);

    window.scrollTo(0, 0);

    return () => {
      const existingScript = document.getElementById('equipo-schema');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <div className="bg-white font-sans text-slate-900">
      
      {/* 1. HERO: Compact & Sobrio */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-20 max-w-5xl mx-auto px-6 text-center">
        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold tracking-widest uppercase rounded-full mb-6">
          Experiencia + Rigor Jurídico
        </span>
        <h1 className="font-serif text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-slate-900 md:whitespace-nowrap">
          Inteligencia y rigor para dominar el BOE.
        </h1>
        <p className="text-slate-400 text-xs font-bold tracking-[0.2em] uppercase mb-10">
          Análisis jurídico independiente · Actualización diaria
        </p>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Análisis exhaustivo y auditoría jurídica para invertir con seguridad.
        </p>
      </section>

      {/* 2. EL ECOSISTEMA: Bento Grid Compacto */}
      <section className="py-16 bg-[#FAFAFA] border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tarjeta 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <Activity className="text-slate-400 mb-4" size={24} strokeWidth={1.5} />
              <h3 className="text-lg font-bold mb-1 tracking-tight">Rastreo Continuo</h3>
              <p className="text-slate-500 text-sm">Detección diaria de oportunidades reales.</p>
            </div>

            {/* Tarjeta 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <ShieldCheck className="text-slate-400 mb-4" size={24} strokeWidth={1.5} />
              <h3 className="text-lg font-bold mb-1 tracking-tight">Evaluación de Riesgo</h3>
              <p className="text-slate-500 text-sm">Estudio jurídico de expedientes viables.</p>
            </div>

            {/* Tarjeta 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <Calculator className="text-slate-400 mb-4" size={24} strokeWidth={1.5} />
              <h3 className="text-lg font-bold mb-1 tracking-tight">Herramientas Propias</h3>
              <p className="text-slate-500 text-sm">Cálculo de rentabilidad, ITP y pujas.</p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. QUIÉN HAY DETRÁS: Fundador & EEAT Card */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12 mb-16">
            <div className="w-full md:w-5/12">
              <div className="aspect-[4/5] w-full relative rounded-2xl overflow-hidden bg-slate-100">
                <img
                  src="/jose-de-la-pena-subastas-boe.jpg"
                  alt="José Carlos de la Peña - Analista subastas BOE"
                  className="object-cover w-full h-full"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="w-full md:w-7/12">
              <h2 className="font-serif text-3xl font-bold mb-6 tracking-tight">Análisis y criterio jurídico.</h2>
              <p className="text-slate-500 text-lg leading-relaxed mb-8">
                Fundada y operada por José Carlos de la Peña, jurista especialista en subastas judiciales. Con más de 12 años de trayectoria auditando y participando en expedientes de ejecución hipotecaria y embargos.
              </p>
              <blockquote className="border-l-2 border-slate-300 pl-6">
                <p className="font-serif text-xl text-slate-700 leading-snug italic">
                  "El análisis de cargas ocultas y la viabilidad posesoria separan una rentabilidad real de un concurso de acreedores."
                </p>
              </blockquote>
            </div>
          </div>

          <div className="p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm bg-white flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="flex-1">
              <h2 className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-2">Dirección de Análisis</h2>
              <h3 className="font-serif text-2xl font-bold text-slate-900 mb-1">José Carlos de la Peña</h3>
              <p className="text-brand-700 text-sm font-medium mb-1">Analista de subastas BOE · Experto en viabilidad jurídica</p>
              <p className="text-slate-400 text-xs font-medium mb-4 italic">Especialización exclusiva en Derecho Procesal e Inversión Inmobiliaria</p>
              
              <div className="text-slate-500 text-sm leading-relaxed mb-6 max-w-xl">
                <p className="mb-3">Expedientes analizados sistemáticamente, detectando cargas encubiertas, discrepancias registrales y bloqueos posesorios antes del remate.</p>
                <p>Auditoría jurídica sobre bases de la Ley de Enjuiciamiento Civil enfocada a fondos patrimoniales e inversores privados, asegurando el control sobre edictos, valoraciones e incidencias previas al juzgado.</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a 
                  href="https://linkedin.com/in/josecarlosdelapena/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  <Linkedin size={16} />
                  <span>Perfil Profesional</span>
                </a>
                <a 
                  href="https://calendly.com/activosoffmarket" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  <User size={16} />
                  <span>Agendar consulta</span>
                </a>
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col items-center md:items-end md:pl-8 md:border-l border-slate-100">
              <span className="font-bold text-slate-900 text-lg text-center md:text-right uppercase tracking-wider mb-4 pt-2">Expedientes<br/>analizados</span>
              
              <div className="flex items-center gap-3 mb-2 pt-4 border-t border-slate-100">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                  <Star size={14} fill="currentColor" />
                </div>
              </div>
              <span className="text-2xl font-bold text-slate-900 mb-1">4.9/5</span>
              <span className="text-[10px] text-slate-400 text-center md:text-right uppercase tracking-wider font-bold">Google Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3.1. ENLAZADO DE AUTORIDAD (EEAT & SEO Link Building) */}
      <section className="pb-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link to="/analisis" className="flex items-center p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 hover:border-slate-200 transition-colors group">
              <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 mr-5 group-hover:scale-105 transition-transform">
                <FileText className="text-brand-600" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  Informes de Análisis <ArrowRight size={16} className="text-brand-600 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all"/>
                </h4>
                <p className="text-xs text-slate-500 mt-1">Casos de estudio y valoración de activos reales.</p>
              </div>
            </Link>
            
            <a href="/noticias-subastas/provincia/madrid" className="flex items-center p-6 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-slate-100 hover:border-slate-200 transition-colors group">
              <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 mr-5 group-hover:scale-105 transition-transform">
                <MapPin className="text-brand-600" size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 flex items-center gap-2">
                  Subastas en Madrid <ArrowRight size={16} className="text-brand-600 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all"/>
                </h4>
                <p className="text-xs text-slate-500 mt-1">Nuestras alertas sobre mercado de alto impacto.</p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* 4. INDEPENDENCIA: Contraste oscuro compacto */}
      <section className="py-20 bg-[#111111] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-serif text-3xl font-bold mb-12 tracking-tight">Independencia radical.</h2>
          
          <ul className="space-y-4 text-lg text-slate-300 font-light text-left max-w-lg mx-auto">
            <li className="flex items-start gap-4">
              <X className="text-slate-500 mt-1 flex-shrink-0" size={18} />
              <span>No somos agencia inmobiliaria.</span>
            </li>
            <li className="flex items-start gap-4">
              <X className="text-slate-500 mt-1 flex-shrink-0" size={18} />
              <span>No vendemos propiedades.</span>
            </li>
            <li className="flex items-start gap-4">
              <X className="text-slate-500 mt-1 flex-shrink-0" size={18} />
              <span>No cobramos a éxito.</span>
            </li>
            <li className="flex items-start gap-4 pt-4 border-t border-slate-800">
              <span className="text-slate-500 mt-1 flex-shrink-0">—</span>
              <span className="text-white font-medium">Nuestro único incentivo es ofrecerte un análisis técnico veraz.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 5. NUESTRO ENFOQUE: Línea de tiempo compacta */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="font-serif text-3xl font-bold mb-16 text-center tracking-tight">Nuestro enfoque.</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
            {/* Línea conectora (solo desktop) */}
            <div className="hidden md:block absolute top-6 left-6 right-6 h-[1px] bg-slate-200 -z-10"></div>
            
            <div className="relative bg-transparent pt-2">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest mb-4 block">01</span>
              <h3 className="text-base font-bold mb-2">Primera revisión</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Descarte de expedientes sin margen.</p>
            </div>
            
            <div className="relative bg-transparent pt-2">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest mb-4 block">02</span>
              <h3 className="text-base font-bold mb-2">Revisión jurídica</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Nota Simple y embargos ocultos.</p>
            </div>
            
            <div className="relative bg-transparent pt-2">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest mb-4 block">03</span>
              <h3 className="text-base font-bold mb-2">Situación posesoria</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Análisis de ocupantes y edicto.</p>
            </div>
            
            <div className="relative bg-transparent pt-2">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest mb-4 block">04</span>
              <h3 className="text-base font-bold mb-2">Evaluación económica</h3>
              <p className="text-slate-500 text-xs leading-relaxed">Cálculo de rentabilidad real.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. SIGUIENTES PASOS: Tarjetas fantasma compactas */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://calendly.com/activosoffmarket" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <User size={20} />
              Agendar consulta
            </a>
            <a 
              href="https://t.me/activosoffmarket" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 px-8 rounded-xl transition-all"
            >
              <Send size={20} className="text-sky-500" />
              Canal Gratuito
            </a>
          </div>
          <p className="text-center text-slate-400 text-xs mt-8">
            Análisis técnico independiente · Sin conflictos de interés
          </p>
        </div>
      </section>

    </div>
  );
};

export default About;