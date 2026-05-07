import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle,  Gavel, Send, Calculator, CheckSquare, Crown, MapPin, Briefcase, Tag, Target, User, ArrowRight, BookOpen, X, Calendar, Search, TrendingUp  } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  console.log("checklist modal:", isChecklistModalOpen);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/' + hash);
    } else {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        const y = element.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  const handleChecklistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    
    // Simulate success as MailerLite is removed
    setTimeout(() => {
      setIsSuccess(true);
      setIsSubmitting(false);
      setTimeout(() => {
        setIsChecklistModalOpen(false);
        setIsSuccess(false);
        setEmail('');
      }, 3000);
    }, 800);
  };

  return (
    <footer id="main-footer" className="bg-slate-950 text-slate-400 pt-20 pb-10 md:pt-24 md:pb-12 mb-16 md:mb-0 border-t border-slate-900 font-sans relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Col 1: Autoridad (Span 4) */}
          <div className="lg:col-span-4 space-y-6">
            <Link 
              to="/" 
              className="flex items-center gap-3 text-white hover:opacity-80 transition-opacity w-fit"
            >
              <div className="bg-brand-600/20 p-2 rounded-lg">
                <Gavel size={24} className="text-brand-500" />
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight">Activos Off-Market</span>
            </Link>
            
            <div className="prose prose-invert prose-sm max-w-sm">
                <h3 className="text-slate-200 font-bold text-base mb-3">Especialistas en subastas judiciales</h3>
                <p className="text-slate-400 leading-relaxed">
                    Transformamos la complejidad de las subastas del BOE en información clara y accionable para inversores prudentes. Análisis exhaustivo y seguridad jurídica.
                </p>
            </div>

            <div className="pt-2">
              <Link 
                to={ROUTES.RECENT_AUCTIONS}
                className="inline-flex items-center gap-2 text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors group"
              >
                Ver subastas activas
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Col 2: Herramientas & Recursos (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-base mb-6">Recursos</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to={ROUTES.REPORTS_INDEX} className="hover:text-white transition-colors">Reportajes y Análisis</Link></li>
              <li><Link to={ROUTES.NOTICIAS_SUBASTAS_INDEX} className="hover:text-white transition-colors">Noticias de subastas</Link></li>
              <li><Link to={ROUTES.GLOSSARY} className="hover:text-white transition-colors">Glosario de términos</Link></li>
              <li><Link to="/equipo" className="hover:text-white transition-colors">Quiénes somos</Link></li>
            </ul>
          </div>

          {/* Col 3: Oportunidades & Guías (Span 3) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-base mb-6 flex items-center gap-2">
                Oportunidades
            </h4>
            <ul className="space-y-4 text-sm mb-8">
              <li>
                <Link 
                  to={ROUTES.MADRID} 
                  className="flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <MapPin size={16} className="text-slate-600 group-hover:text-brand-400 transition-colors" />
                  <span>Subastas en Madrid</span>
                </Link>
              </li>
              <li>
                <Link 
                  to={ROUTES.BARCELONA} 
                  className="flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <MapPin size={16} className="text-slate-600 group-hover:text-brand-400 transition-colors" />
                  <span>Subastas en Barcelona</span>
                </Link>
              </li>
              <li>
                <Link 
                  to={ROUTES.VALENCIA} 
                  className="flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <MapPin size={16} className="text-slate-600 group-hover:text-brand-400 transition-colors" />
                  <span>Subastas en Valencia</span>
                </Link>
              </li>
              <li>
                <Link 
                  to={ROUTES.SEVILLA} 
                  className="flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <MapPin size={16} className="text-slate-600 group-hover:text-brand-400 transition-colors" />
                  <span>Subastas en Sevilla</span>
                </Link>
              </li>
            </ul>

            <h4 className="text-slate-300 font-bold text-sm mb-4 flex items-center gap-2">
              <BookOpen size={14} className="text-slate-500" /> Guías
            </h4>
            <ul className="space-y-3 text-sm">
              <li><Link to={ROUTES.GUIDE_PILLAR} className="hover:text-white transition-colors">Subastas judiciales en España</Link></li>
              <li><Link to={ROUTES.ANALYSIS} className="hover:text-white transition-colors">Cómo analizar una subasta</Link></li>
              <li><Link to={ROUTES.CHARGES} className="hover:text-white transition-colors">Cargas en subasta judicial</Link></li>
            </ul>
          </div>

          {/* Col 4: Servicios (Span 2) */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-base mb-6 flex items-center gap-2">
                Servicios
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link 
                  to={ROUTES.ANALISIS_CARGAS} 
                  className="flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <Search size={16} className="text-slate-600 group-hover:text-brand-400 transition-colors" />
                  <span>Analizar Cargas</span>
                </Link>
              </li>
              <li>
                <Link 
                  to={ROUTES.CALCULATOR} 
                  className="flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <Calculator size={16} className="text-slate-600 group-hover:text-brand-400 transition-colors" />
                  <span>Calculadora PRO</span>
                </Link>
              </li>
              <li>
                <Link 
                  to={ROUTES.CONSULTORIA} 
                  className="flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <Calendar size={16} className="text-slate-600 group-hover:text-brand-400 transition-colors" />
                  <span>Consultoría</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/pro" 
                  className="flex items-center gap-2 hover:text-white transition-colors group"
                >
                  <Crown size={16} className="text-slate-600 group-hover:text-brand-400 transition-colors" />
                  <span>Planes</span>
                </Link>
              </li>
              <li>
                <a href="https://t.me/activosoffmarket" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-white transition-colors group">
                  <Send size={16} className="text-slate-600 group-hover:text-brand-400 transition-colors" />
                  <span>Alertas Telegram</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-800/60 pt-8 flex flex-col gap-8">
          
          {/* Mini CTAs */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 text-xs font-medium">
            <Link 
              to={ROUTES.CALCULATOR}
              className="px-4 py-2 rounded-full bg-slate-900 border border-slate-800 hover:border-brand-500/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-all flex items-center gap-2"
            >
              <Calculator size={14} className="text-brand-500" />
              Calculadora PRO
            </Link>
            <Link 
              to={ROUTES.RECENT_AUCTIONS}
              className="px-4 py-2 rounded-full bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800 text-slate-300 hover:text-white transition-all flex items-center gap-2"
            >
              <Gavel size={14} className="text-emerald-500" />
              Subastas activas
            </Link>
          </div>

          {/* Copyright & Legal */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Activos Off-Market. Todos los derechos reservados.</p>
            
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              <Link to={ROUTES.LEGAL} className="hover:text-slate-400 transition-colors">Aviso Legal</Link>
              <Link to={ROUTES.PRIVACY} className="hover:text-slate-400 transition-colors">Privacidad</Link>
              <Link to={ROUTES.COOKIES} className="hover:text-slate-400 transition-colors">Cookies</Link>
              <Link to={ROUTES.TERMS} className="hover:text-slate-400 transition-colors">Términos</Link>
              <Link to={ROUTES.CONTACT} className="hover:text-slate-400 transition-colors">Contacto</Link>
              <a href="https://t.me/activosoffmarket" target="_blank" rel="noopener noreferrer" className="hover:text-slate-400 transition-colors flex items-center gap-1.5 ml-2">
                <Send size={12} /> Telegram
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Checklist Modal
      <div 
        className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm transition-all duration-300 border-4 border-red-500
        ${isChecklistModalOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
      >
          <div className="bg-white rounded-2xl p-6 md:p-8 max-w-md w-full relative shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsChecklistModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckSquare size={24} className="text-brand-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Descarga el Checklist BOE</h3>
              <p className="text-slate-600 text-sm">
                Recibe gratis la lista de comprobación paso a paso para analizar cualquier subasta judicial sin dejarte nada.
              </p>
            </div>

            {isSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                <CheckCircle size={32} className="text-emerald-500 mx-auto mb-3" />
                <h4 className="text-emerald-800 font-bold mb-1">¡Enviado correctamente!</h4>
                <p className="text-emerald-600 text-sm">Revisa tu bandeja de entrada (y la carpeta de spam por si acaso).</p>
              </div>
            ) : (
              <form onSubmit={handleChecklistSubmit} className="space-y-4">
                <div>
                  <label htmlFor="checklist-email" className="sr-only">Tu mejor email</label>
                  <input
                    type="email"
                    id="checklist-email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Tu mejor email"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all text-slate-900"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={18} />
                      Enviar Checklist
                    </>
                  )}
                </button>
                <p className="text-xs text-center text-slate-500 mt-4">
                  Al descargar aceptas la política de privacidad. Cero spam.
                </p>
              </form>
            )}
          </div>
        </div>
      */}
    </footer>
  );
};

export default Footer;