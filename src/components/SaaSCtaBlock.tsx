import React from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const SaaSCtaBlock: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-12 my-12 shadow-xl relative overflow-hidden">
      <div className="absolute top-[-50%] right-[-10%] w-[60%] h-[150%] bg-brand-600/20 rounded-full blur-[80px] opacity-50"></div>
      
      <div className="grid md:grid-cols-2 gap-10 items-center relative z-10">
        <div>
          <h3 className="font-serif text-3xl font-bold text-white mb-4">¿Preparado para pujar con seguridad?</h3>
          <p className="text-slate-300 text-lg mb-6 leading-relaxed">
            Nuestra plataforma te automatiza el cálculo de rentabilidad, cargas e ITP para que no cometas los errores que arruinan al 90% de los principiantes. Además, si tienes dudas graves, puedes solicitar una <span className="text-brand-300 font-semibold">auditoría 1 a 1</span>.
          </p>
        </div>
        
        <div className="flex flex-col gap-4">
          <Link
            to={ROUTES.PRO}
            className="w-full bg-brand-500 text-white font-bold py-4 rounded-xl text-lg hover:bg-brand-600 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            Ver Planes y Herramientas <ArrowRight size={20} />
          </Link>
          <div className="flex items-center justify-center gap-2 mt-2 text-slate-400 text-sm">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>Evita sorpresas. Optimiza tu inversión.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaaSCtaBlock;

