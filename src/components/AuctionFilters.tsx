import React, { useState, useMemo, useEffect } from 'react';
import { MapPin, Map, Activity, Building2, ArrowUpDown } from 'lucide-react';
import { AuctionData } from '../data/auctions';
import { getComputedStatus, getAuctionType, isAuctionActive } from '../utils/auctionHelpers';

interface AuctionFiltersProps {
  auctions: Record<string, AuctionData>;
  onFilteredChange: (filtered: Record<string, AuctionData>, params: any) => void;
  onSortChange?: (sort: string, params: any) => void;
  initialCity?: string;
  initialProvince?: string;
  initialStatus?: string;
  initialType?: string;
  initialSort?: string;
}

export const AuctionFilters: React.FC<AuctionFiltersProps> = ({ 
  auctions, 
  onFilteredChange, 
  onSortChange,
  initialCity = '',
  initialProvince = '',
  initialStatus = '',
  initialType = '',
  initialSort = 'recent'
}) => {
  const [city, setCity] = useState(initialCity);
  const [province, setProvince] = useState(initialProvince);
  const [status, setStatus] = useState<string>(initialStatus);
  const [type, setType] = useState<string>(initialType);
  const [sortBy, setSortBy] = useState<string>(initialSort);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const normalizeText = (str: string) =>
    str
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .trim();

  const filteredAuctions = useMemo(() => {
    return Object.entries(auctions).reduce((acc, [slug, data]) => {
      if (data.assetCategory === 'vehiculo') return acc;
      if (city && data.city && normalizeText(data.city) !== normalizeText(city)) return acc;
      if (province && data.province?.toLowerCase() !== province.toLowerCase()) return acc;
      if (status) {
        if (getComputedStatus(data) !== status) return acc;
      }
      if (type && getAuctionType(data.boeId) !== type) return acc;
      acc[slug] = data;
      return acc;
    }, {} as Record<string, AuctionData>);
  }, [auctions, city, province, status, type]);

  useEffect(() => {
    onFilteredChange(filteredAuctions, { city, province, status, type, sortBy });
  }, [filteredAuctions, onFilteredChange, city, province, status, type, sortBy]);

  useEffect(() => {
    if (onSortChange) {
      onSortChange(sortBy, { city, province, status, type, sortBy });
    }
  }, [sortBy, onSortChange, city, province, status, type, sortBy]);

  const clearFilters = () => {
    setCity('');
    setProvince('');
    setStatus('');
    setType('');
    setSortBy('recent');
  };

  const hasActiveFilters = city || province || status || type || sortBy !== 'recent';

  const cities = useMemo(() => {
    const rawCities = Object.values(auctions).map(a => a.city).filter(Boolean) as string[];
    
    // Normalizar nombres eliminando tildes antes de deduplicar
    const normalizedSet = new Set(
      rawCities.map(c => c.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim())
    );
    
    return Array.from(normalizedSet)
      .map(c => c.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '))
      .sort((a, b) => a.localeCompare(b, 'es'));
  }, [auctions]);
  const provinces = useMemo(() => {
    const uniqueProvinces = Array.from(new Set(Object.values(auctions).map(a => a.province).filter(Boolean))) as string[];
    return uniqueProvinces.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
  }, [auctions]);
  const types = useMemo(() => Array.from(new Set(Object.values(auctions).map(a => getAuctionType(a.boeId)).filter(Boolean))), [auctions]);

  const selectBaseClass = "appearance-none border border-slate-300 bg-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all w-full pl-9 pr-8";
  const selectSizeClass = isScrolled ? "py-1.5 text-xs rounded-lg" : "py-2 md:py-2.5 text-xs md:text-sm rounded-lg md:rounded-xl";

  return (
    <div className={`sticky top-[72px] md:top-[80px] z-40 transition-all duration-300 mb-8 ${isScrolled ? 'bg-white/95 shadow-md md:rounded-2xl border-b md:border border-slate-200/50 p-2 md:p-3 -mx-6 px-6 md:mx-0 md:px-3' : 'bg-slate-50 p-3 md:p-6 rounded-2xl border border-slate-200 shadow-sm'}`}>
      <div className={`grid gap-2 md:gap-3 ${onSortChange ? 'grid-cols-2 md:grid-cols-6' : 'grid-cols-2 md:grid-cols-4'}`}>
        <div className="hidden md:block col-span-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin size={16} className="text-slate-400" />
          </div>
          <select value={city} onChange={e => setCity(e.target.value)} className={`${selectBaseClass} ${selectSizeClass}`}>
            <option value="">Municipio</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
            <ArrowUpDown size={14} className="text-slate-400" />
          </div>
        </div>
        
        <div className="col-span-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Map size={16} className="text-slate-400" />
          </div>
          <select value={province} onChange={e => setProvince(e.target.value)} className={`${selectBaseClass} ${selectSizeClass}`}>
            <option value="">Provincia</option>
            {provinces.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
            <ArrowUpDown size={14} className="text-slate-400" />
          </div>
        </div>

        <div className="col-span-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Activity size={16} className="text-slate-400" />
          </div>
          <select value={status} onChange={e => setStatus(e.target.value)} className={`${selectBaseClass} ${selectSizeClass}`}>
            <option value="">Situación</option>
            <option value="active">En curso</option>
            <option value="upcoming">Próxima apertura</option>
            <option value="suspended">Pausada</option>
            <option value="closed">Finalizada</option>
          </select>
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
            <ArrowUpDown size={14} className="text-slate-400" />
          </div>
        </div>
        
        <div className="hidden md:block col-span-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Building2 size={16} className="text-slate-400" />
          </div>
          <select value={type} onChange={e => setType(e.target.value)} className={`${selectBaseClass} ${selectSizeClass}`}>
            <option value="">Tipo de subasta</option>
            {types.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
            <ArrowUpDown size={14} className="text-slate-400" />
          </div>
        </div>

        {onSortChange && (
          <div className="col-span-2 md:col-span-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ArrowUpDown size={16} className="text-slate-400" />
            </div>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={`${selectBaseClass} ${selectSizeClass} font-medium`}>
              <option value="recent">Más recientes</option>
              <option value="oldest">Más antiguas</option>
              <option value="value_high">Mayor valor</option>
              <option value="value_low">Menor valor</option>
            </select>
          </div>
        )}

        {hasActiveFilters && (
          <div className="col-span-2 md:col-span-1 flex items-center justify-center md:justify-start">
            <button 
              onClick={clearFilters}
              className={`text-slate-500 hover:text-slate-800 transition-colors underline decoration-slate-300 hover:decoration-slate-500 underline-offset-2 ${isScrolled ? 'text-xs py-1' : 'text-sm py-2'}`}
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
