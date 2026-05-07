import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import Hero from './Hero';
import { DiscoverReportsBlock } from './DiscoverReportsBlock';
import RecentAuctionsHome from './RecentAuctionsHome';
import SocialProof from './SocialProof';
import Pricing from './Pricing';
import Process from './Process';
import Opportunities from './Opportunities';
import { ArrowRight } from 'lucide-react';
import FAQ from './FAQ';
import FinalCTA from './FinalCTA';
import { trackConversion } from '../utils/tracking';

const Home: React.FC = () => {
  React.useEffect(() => {
    document.title = "Activos Off-Market | Expertos en Subastas Judiciales y BOE";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', "Encuentra las mejores oportunidades en subastas judiciales, BOE y AEAT en España. Análisis técnico, jurídico y financiero para inversores inmobiliarios.");
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Hero />
      <DiscoverReportsBlock />
      <RecentAuctionsHome />
      <SocialProof />
      <Pricing />

      <Process />
      <Opportunities />

      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-6 text-center">
            Cómo funcionan las subastas del BOE
          </h2>
          <p className="text-lg text-slate-600 mb-12 text-center max-w-3xl mx-auto">
            Participar con garantías requiere entender el ecosistema jurídico y financiero para localizar activos y minimizar el riesgo.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-brand-200 transition-colors">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Qué es una subasta judicial</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Es un procedimiento público donde se liquida un activo para el pago a acreedores. Todo ocurre a través del Portal de Subastas del BOE, que marca un valor de subasta inicial sobre el que los inversores pujan electrónicamente.
              </p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-brand-200 transition-colors">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Riesgos principales</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                El importe de remate no es tu único coste. Es vital identificar las cargas registrales anteriores, los riesgos de ocupación sin título y las posibles deudas ocultas como el IBI o la comunidad comunitaria.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 hover:border-brand-200 transition-colors">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Cómo analizar correctamente</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                Un análisis riguroso exige interpretar la certificación de cargas actualizada del registro correspondiente, contrastar el edicto de ejecución y evaluar todos los datos antes de concretar tu postura.
              </p>
            </div>
          </div>
          
          <div className="mt-10 text-center max-w-4xl mx-auto">
            <p className="text-xs text-slate-400">
              El análisis de subastas requiere revisión jurídica de cargas, situación posesoria y riesgos económicos. La información mostrada tiene carácter informativo y no constituye asesoramiento financiero.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-brand-900 rounded-3xl p-8 md:p-12 text-center text-white flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6">Herramienta gratuita: Calculadora de rentabilidad en subastas judiciales</h2>
            <Link 
              to={ROUTES.CALCULATOR} 
              onClick={() => trackConversion('general', 'home', 'premium')}
              className="inline-block bg-white text-brand-900 font-bold py-4 px-8 rounded-xl hover:bg-brand-50 transition-all"
            >
              Calcular inversión
            </Link>
        </div>
      </div>
      <FAQ />
      <FinalCTA />
    </>
  );
};

export default Home;
