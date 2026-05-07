import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, DollarSign, ChevronRight, Percent, Calculator, Building2, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useUser } from '../contexts/UserContext';
import { AuctionData } from '../data/auctions';
import { isAuctionFinished, getComputedStatus, isCapital, calculateDiscount, isConflictZone } from '../utils/auctionHelpers';
import { normalizeLocationLabel, normalizePropertyType, normalizeCity, normalizeProvince } from '../utils/auctionNormalizer';
import { ROUTES } from '@/constants/routes';
import { trackConversion } from '../utils/tracking';
import { prefetchAuction } from '../utils/prefetch';

import { getImageForPropertyType } from '../constants/auctionImages';

interface AuctionCardProps {
  slug: string;
  data: AuctionData;
  showNewBadge?: boolean;
  showImage?: boolean;
}

export const AuctionCard: React.FC<AuctionCardProps> = ({ slug, data, showNewBadge, showImage }) => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { isFavorite, toggleFavorite, isLoaded, isToggling } = useFavorites();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const id = slug;
  const valorReferencia = data.valorTasacion || data.valorSubasta || data.appraisalValue;
  const cantidadReclamada = data.claimedDebt;

  const computedStatus = getComputedStatus(data);
  const isFinished = computedStatus === 'closed';
  const isSuspended = computedStatus === 'suspended';
  const isUpcoming = computedStatus === 'upcoming';
  const isActive = computedStatus === 'active';
  
  const pricePerM2 = data.pricePerM2 || (data.surface && valorReferencia ? Math.round(valorReferencia / data.surface) : null);

  const city = normalizeCity(data) || '';
  const province = normalizeProvince(data.province || data.city);

  // Badges Logic
  const oppRatio = data.opportunityRatio || 0;
  const isRecienPublicada = data.publishedAt ? (new Date().getTime() - new Date(data.publishedAt).getTime()) < (48 * 60 * 60 * 1000) : false;
  const isCapitalCity = isCapital(data);
  const discount = calculateDiscount(data.valorTasacion, data.valorSubasta, data.claimedDebt);
  const isConflict = isConflictZone(data);
  const isTopLocation = isCapitalCity;
  const isClosingSoon = data.auctionDate ? (new Date(data.auctionDate).getTime() - new Date().getTime()) < (3 * 24 * 60 * 60 * 1000) && (new Date(data.auctionDate).getTime() - new Date().getTime()) > 0 : false;

  // Left Badges: Max 2
  // Prio: Discount > Opportunity > Conflict > RecienPublicada
  const leftBadges = [];
  
  if (discount && discount >= 10 && discount <= 80) {
    leftBadges.push({ label: `-${discount}% DTO`, color: getDiscountColor(discount) });
  }
  
  const opp = getOpportunityBadge();
  if (opp && leftBadges.length < 2) {
    leftBadges.push(opp);
  }
  
  if (isConflict && leftBadges.length < 2) {
    leftBadges.push({ label: "⚠️ Revisar zona", color: "text-rose-700 bg-rose-50 border-rose-200" });
  } else if (isRecienPublicada && leftBadges.length < 2) {
    leftBadges.push({ label: "✨ Recién publicada", color: "text-brand-700 bg-brand-50 border-brand-200" });
  }

  // Right Badges: Max 2
  // Prio 1: Status (always visible)
  // Prio 2: FOMO (Soon) > Location
  const rightBadges = [];
  if (isClosingSoon && !isFinished) {
    rightBadges.push({ label: "⏳ Termina pronto", color: "text-rose-700 bg-rose-50 border-rose-200 animate-pulse" });
  } else if (isTopLocation) {
    rightBadges.push({ label: "📍 Ubicación Top", color: "text-violet-700 bg-violet-50 border-violet-200" });
  }

  function getDiscountColor(d: number) {
    if (d >= 70) return "text-rose-700 bg-rose-50 border-rose-200";
    if (d >= 50) return "text-amber-700 bg-amber-50 border-amber-200";
    if (d >= 30) return "text-blue-700 bg-blue-50 border-blue-200";
    return "text-slate-700 bg-slate-50 border-slate-200";
  }

  function getOpportunityBadge() {
    if (oppRatio >= 0.60) return { label: "🔥 Top oportunidad", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    if (oppRatio >= 0.50) return { label: "⭐ Buena oportunidad", color: "text-amber-700 bg-amber-50 border-amber-200" };
    if (oppRatio >= 0.25) return { label: "🧐 Interesante", color: "text-slate-600 bg-slate-50 border-slate-200" };
    return null;
  }

  const locationLabel = normalizeLocationLabel(data);
  const imageUrl = getImageForPropertyType(data.propertyType, slug);

  return (
    <div className="relative h-full flex w-full">
      <Link 
        to={`/subasta/${id}`}
        className={`cursor-pointer w-full bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col relative group ${isFinished ? 'opacity-70 grayscale-[0.3]' : ''}`}
      >
        {/* Left: Commercial Badges (Max 2) */}
        <div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-1.5 pointer-events-none">
          {leftBadges.slice(0, 2).map((badge, idx) => (
            <span key={idx} className={`inline-flex items-center text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border shadow-sm ${badge.color}`}>
              {badge.label}
            </span>
          ))}
        </div>

        {/* Right: Status + FOMO (Max 2) */}
        <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-1.5 pointer-events-none">
          {rightBadges.slice(0, 1).map((badge, idx) => (
             <span key={idx} className={`inline-flex items-center text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border shadow-sm ${badge.color}`}>
               {badge.label}
             </span>
          ))}
          <div className="flex flex-col items-end pointer-events-auto">
            {isFinished ? (
              <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border border-slate-300 shadow-sm">Finalizada</span>
            ) : isSuspended ? (
              <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border border-amber-200 shadow-sm">Pausada</span>
            ) : isUpcoming ? (
              <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border border-blue-200 shadow-sm">Próxima apertura</span>
            ) : (
              <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider border border-emerald-200 shadow-sm">En curso</span>
            )}
          </div>
        </div>

        <div className="p-4 pt-20 flex-grow flex flex-col relative">
          <div className="relative">
            <div className="block mb-3 pr-8">
              <div className="flex items-start justify-between gap-2">
                <h2 className="flex-1 min-w-0 text-base md:text-lg font-bold text-slate-900 leading-tight group-hover:text-brand-600 transition-colors line-clamp-2">
                  {(() => {
                    const type = normalizePropertyType(data.propertyType);
                    const streetClean = data.address?.split(',')[0]?.trim();
                    const hasStreet = streetClean && streetClean.length > 5 && streetClean.toLowerCase() !== city.toLowerCase();
                    return hasStreet ? `${type} en ${streetClean} · ${city}` : `${type} en subasta · ${city}`;
                  })()}
                </h2>
              </div>
              {isUpcoming && (
                <div className="mt-1.5 text-[10px] font-medium text-blue-600 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                  Disponible próximamente
                </div>
              )}
            </div>
          </div>
 
          <div className="space-y-2 mb-4 flex-grow">
            <div className="flex items-center justify-between gap-2 text-slate-600 text-xs md:text-sm">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />
                <span className="font-medium leading-snug">
                  {province && province !== city ? province : city}
                </span>
              </div>
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!user?.id) {
                    navigate('/login', { state: { returnTo: window.location.pathname } });
                    return;
                  }
                  const { limitReached } = await toggleFavorite(slug);
                  if (limitReached) {
                    setShowPremiumModal(true);
                  }
                }}
                disabled={isToggling}
                className="z-20 p-2 opacity-80 hover:opacity-100 transition-all hover:scale-110"
              >
                {isFavorite(slug) ? (
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                ) : (
                  <Heart className="w-5 h-5 text-slate-400 drop-shadow-sm" />
                )}
              </button>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100 mt-2">
              {valorReferencia && (
                <div className="flex justify-between items-center text-xs md:text-sm mb-1">
                  <span className="text-slate-500">Tasación:</span>
                  <span className="font-bold text-slate-900">{valorReferencia.toLocaleString('es-ES', {style: 'currency', currency: 'EUR', maximumFractionDigits: 0})}</span>
                </div>
              )}

              {cantidadReclamada !== undefined && cantidadReclamada !== null && (
                <div className={`flex justify-between items-center text-xs md:text-sm ${pricePerM2 ? 'mb-1' : ''}`}>
                  <span className="text-slate-500">Deuda:</span>
                  <span className="font-bold text-rose-700/90">{cantidadReclamada.toLocaleString('es-ES', {style: 'currency', currency: 'EUR', maximumFractionDigits: 0})}</span>
                </div>
              )}

              {pricePerM2 ? (
                <div className="flex justify-between items-center text-xs md:text-sm">
                  <span className="text-slate-500">Precio m²:</span>
                  <span className="font-bold text-slate-700">💸 {pricePerM2.toLocaleString('es-ES')} €/m²</span>
                </div>
              ) : null}

              <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  trackConversion(province, 'listing', 'calculator_from_card_click', { precio: cantidadReclamada || 0 });
                  navigate(`${ROUTES.CALCULATOR}?tasacion=${valorReferencia || 0}&precio=${cantidadReclamada || 0}&ccaa=${province}`);
                }}
                className="w-full mt-2.5 pt-2.5 border-t border-slate-200/60 flex items-center justify-center gap-1.5 text-[10px] font-bold text-brand-600 hover:text-brand-700 transition-colors group/calc relative z-20"
              >
                <Calculator size={12} className="group-hover/calc:scale-110 transition-transform" />
                Calcular puja máxima
              </button>
            </div>
          </div>

          <div className="mt-auto pt-1">
            {isActive && !isFinished && !isSuspended && !isUpcoming && (
              <div className="text-center mb-1.5">
                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Disponible ahora</span>
              </div>
            )}
            <div 
              className={`w-full inline-flex items-center justify-center font-bold py-3 px-5 rounded-xl transition-all ${isFinished ? 'bg-slate-100 text-slate-500 group-hover:bg-slate-200' : isSuspended ? 'bg-amber-100 text-amber-700 group-hover:bg-amber-200' : 'bg-brand-600 text-white group-hover:bg-brand-700 shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5'}`}
            >
              {isFinished ? 'Ver resultado' : isSuspended ? 'Ver detalles' : 'Ver oportunidad'}
              <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
      
      
      {/* PREMIUM MODAL */}
      <AnimatePresence>
        {showPremiumModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowPremiumModal(false);
              }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden cursor-default"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                  <Heart size={32} className="fill-red-500" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-3">Has guardado 3 oportunidades</h3>
                <p className="text-slate-600 mb-8">
                  Pasa a PRO para guardar oportunidades ilimitadas y activar alertas avanzadas.
                </p>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowPremiumModal(false);
                      window.location.href = ROUTES.PRO;
                    }}
                    className="w-full py-3.5 px-6 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors"
                  >
                    Ver PRO
                  </button>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowPremiumModal(false);
                    }}
                    className="w-full py-3.5 px-6 rounded-xl bg-slate-50 text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
