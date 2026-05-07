import React from 'react';
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from 'react-router-dom';
import { ROUTES } from "@/constants/routes";

export const GuideMobileCTA: React.FC = () => {
    return (
        <div className="my-10 block lg:hidden not-prose">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-600/20 rounded-full blur-3xl"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-center gap-2 text-brand-300 text-xs font-bold uppercase tracking-widest mb-3">
                        <ShieldCheck size={14} /> Herramienta Pro
                    </div>
                    <h3 className="font-serif font-bold text-white text-xl mb-2">¿Dudas con esta subasta?</h3>
                    <p className="text-slate-300 text-sm mb-6 leading-relaxed">Nuestro algoritmo analiza cargas registrales e impuestos en segundos para que pujes con seguridad.</p>
                    <Link to={ROUTES.ANALIZAR_SUBASTA} className="bg-brand-500 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-brand-600 transition-colors flex items-center justify-center gap-2 w-full">
                        Analizar subasta <ArrowRight size={16}/>
                    </Link>
                </div>
            </div>
        </div>
    );
};
