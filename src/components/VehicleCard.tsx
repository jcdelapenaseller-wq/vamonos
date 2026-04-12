import React from 'react';
import { Link } from 'react-router-dom';
import { Car, Calendar, Gavel, Tag, MapPin, ArrowRight } from 'lucide-react';
import { AuctionData } from '../data/auctions';
import { getComputedStatus } from '../utils/auctionHelpers';

interface VehicleCardProps {
  slug: string;
  data: AuctionData;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ slug, data }) => {
  const computedStatus = getComputedStatus(data);
  const isFinished = computedStatus === 'closed';
  const isSuspended = computedStatus === 'suspended';
  const isUpcoming = computedStatus === 'upcoming';
  const isActive = computedStatus === 'active';

  // Format currency
  const formatCurrency = (value: number | null | undefined) => {
    if (value == null) return 'No consta';
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
  };

  // Mask license plate (e.g., 1234-L**)
  const maskLicensePlate = (plate?: string) => {
    if (!plate) return 'Sin matrícula';
    const clean = plate.replace(/[^A-Z0-9]/ig, '').toUpperCase();
    if (clean.length >= 4) {
      return `${clean.substring(0, 4)}-${clean.substring(4, 5)}**`;
    }
    return '***';
  };

  // Format date
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'Fecha no disponible';
    
    // Handle DD-MM-YYYY format from BOE
    if (dateString.includes('-')) {
      const parts = dateString.split('-');
      if (parts[0].length === 2) { // DD-MM-YYYY
        const [day, month, year] = parts;
        const date = new Date(`${year}-${month}-${day}`);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
      } else if (parts[0].length === 4) { // YYYY-MM-DD
        const [year, month, day] = parts;
        const date = new Date(`${year}-${month}-${day}`);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          });
        }
      }
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha no disponible';

    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const title = data.brand && data.model ? `${data.brand} ${data.model}` : (data.brand || data.model || 'Vehículo');
  const imageUrl = data.images && data.images.length > 0 ? data.images[0] : null;

  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col relative group ${isFinished ? 'opacity-70 grayscale-[0.3]' : ''}`}>
      
      {/* Status Badge */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-1.5">
        {isFinished ? (
          <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border border-slate-300 shadow-sm">
            Finalizada
          </span>
        ) : isSuspended ? (
          <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border border-amber-200 shadow-sm">
            Pausada
          </span>
        ) : isUpcoming ? (
          <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border border-blue-200 shadow-sm">
            Próxima
          </span>
        ) : (
          <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border border-emerald-200 shadow-sm">
            En curso
          </span>
        )}
      </div>

      {/* Image Section */}
      <div className="relative w-full h-48 bg-slate-100 overflow-hidden aspect-video">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
            <Car className="w-12 h-12 mb-2 opacity-50" />
            <span className="text-sm font-medium">Sin imagen</span>
          </div>
        )}

        {/* Image Counter Badge */}
        {data.images && data.images.length > 1 && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Car size={10} />
            {data.images.length} fotos
          </div>
        )}
        
        {/* License Plate Badge */}
        <div className="absolute bottom-3 left-3 bg-white px-2 py-1 rounded border-2 border-slate-300 shadow-sm flex items-center gap-2">
          <div className="w-3 h-5 bg-blue-700 rounded-sm flex flex-col items-center justify-between py-[1px]">
             <span className="text-[4px] text-yellow-400 leading-none">★</span>
             <span className="text-[6px] font-bold text-white leading-none">E</span>
          </div>
          <span className="font-mono font-bold text-slate-800 tracking-widest text-sm">
            {maskLicensePlate(data.licensePlate)}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-grow flex flex-col">
        <h2 className="text-lg font-bold text-slate-900 leading-tight mb-1 line-clamp-1">
          {title}
        </h2>
        
        <div className="flex items-center text-sm text-slate-500 mb-4 gap-3">
          {data.year && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{data.year}</span>
            </div>
          )}
          {(data.city || data.province) && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{data.city || data.province}</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <Gavel className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Puja Mínima</span>
            </div>
            <div className="text-base font-bold text-slate-900">
              {formatCurrency(data.valorSubasta)}
            </div>
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
            <div className="flex items-center gap-1.5 text-slate-500 mb-1">
              <Tag className="w-4 h-4" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Valor Tasación</span>
            </div>
            <div className="text-base font-bold text-slate-900">
              {formatCurrency(data.valorTasacion)}
            </div>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-slate-100">
          <div className="text-xs text-slate-500 mb-4 text-center">
            <span className="font-medium">Cierre:</span> {formatDate(data.auctionDate)}
          </div>
          <Link 
            to={`/subasta/${slug}`}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            Ver subasta <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
};
