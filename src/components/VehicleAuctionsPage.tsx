import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Car, Zap, ShieldCheck, FileText } from 'lucide-react';
import { AUCTIONS } from '../data/auctions';
import { ROUTES } from '../constants/routes';
import { VehicleCard } from './VehicleCard';
import { isAuctionActive } from '../utils/auctionHelpers';

const VehicleAuctionsPage: React.FC = () => {
  // Filtrar solo vehículos
  const vehicleAuctions = useMemo(() => {
    return Object.entries(AUCTIONS)
      .filter(([_, data]) => data.assetCategory === 'vehiculo')
      .map(([slug, data]) => ({ slug, data }));
  }, []);

  const activeCount = useMemo(() => {
    return vehicleAuctions.filter(({ data }) => isAuctionActive(data)).length;
  }, [vehicleAuctions]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Subastas de Vehículos BOE | Coches, Motos y Furgonetas";
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', "Listado de subastas de vehículos del BOE. Encuentra coches, motos y vehículos industriales con imágenes reales y análisis técnico.");
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-600">
      <header className="bg-white border-b border-slate-200 pt-8 pb-6">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center text-xs opacity-50 mb-2 font-medium uppercase tracking-wider" aria-label="Breadcrumb">
            <Link 
              to={ROUTES.HOME} 
              className="hover:text-brand-600 transition-colors"
            >
              Inicio
            </Link>
            <ChevronRight size={10} className="mx-1.5" />
            <span aria-current="page">Subastas de Vehículos</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 md:gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600 shrink-0">
                <Car size={24} />
              </div>
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight tracking-tight">
                Subastas de vehículos
              </h1>
            </div>

            <div className="flex items-center gap-2 shrink-0 text-slate-600 font-medium text-sm md:text-base">
              <span className="tabular-nums font-bold text-slate-900">{activeCount}</span> activos hoy
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-xs md:text-sm font-medium mt-1 md:mt-2">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Actualizado hoy · Imágenes reales de Cloudinary
          </div>
        </div>
      </header>

      {/* Trust Bar */}
      <div className="bg-slate-50/50 border-b border-slate-200 py-3 md:py-4">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10">
            <div className="flex items-center gap-2 text-slate-500">
              <Zap size={16} className="text-brand-500" />
              <span className="text-xs md:text-sm font-medium">Fotos reales optimizadas</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <ShieldCheck size={16} className="text-brand-500" />
              <span className="text-xs md:text-sm font-medium">Verificación de matrícula</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <FileText size={16} className="text-brand-500" />
              <span className="text-xs md:text-sm font-medium">Datos técnicos del BOE</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        {vehicleAuctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {vehicleAuctions.map(({ slug, data }) => (
              <VehicleCard key={slug} slug={slug} data={data} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <Car size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 text-lg">No se han encontrado subastas de vehículos activas en este momento.</p>
            <p className="text-slate-400 text-sm mt-2">Vuelve a consultar más tarde, el crawler se actualiza diariamente.</p>
          </div>
        )}

        <div className="mt-20 pt-12 border-t border-slate-200 max-w-4xl mx-auto">
          <div className="prose prose-slate max-w-none">
            <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">Invertir en vehículos de subastas judiciales</h2>
            <p className="text-slate-600 leading-relaxed">
              Las subastas de vehículos del BOE ofrecen una oportunidad única para adquirir coches, motos y furgonetas a precios significativamente inferiores a los de mercado. A diferencia de las viviendas, los vehículos suelen tener un proceso de adjudicación más rápido, aunque requieren una revisión técnica minuciosa.
            </p>
            <p className="text-slate-600 leading-relaxed">
              En Activos Off-Market, procesamos los edictos de vehículos para extraer marcas, modelos y matrículas, facilitando tu labor de investigación. Siempre recomendamos verificar el estado del vehículo si es posible y revisar si existen precintos o cargas administrativas en la DGT antes de realizar una puja.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VehicleAuctionsPage;
