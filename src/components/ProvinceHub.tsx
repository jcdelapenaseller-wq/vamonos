import React, { useEffect, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ChevronRight, MapPin, TrendingUp, Filter, ShieldCheck, Clock, Zap, Search, BarChart3, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet';
import { ROUTES } from '@/constants/routes';
import { AUCTIONS } from '../data/auctions';
import { getFilteredAuctions } from '../utils/auctionHelpers';
import { isAuctionFinished, sortAuctions, isAuctionActive } from '../utils/auctionHelpers';
import { normalizeProvince, normalizePropertyType, normalizeLocationLabel } from '../utils/auctionNormalizer';
import { trackConversion } from '../utils/tracking';
import { AuctionCard } from './AuctionCard';
import Header from './Header';
import Footer from './Footer';

import RadarPremiumCTA from './RadarPremiumCTA';

// Import existing guides
import AuctionMadridGuide from './AuctionMadridGuide';
import AuctionBarcelonaGuide from './AuctionBarcelonaGuide';
import AuctionValenciaGuide from './AuctionValenciaGuide';
import AuctionSevillaGuide from './AuctionSevillaGuide';

const CITY_GUIDES: Record<string, React.FC> = {
  'madrid': AuctionMadridGuide,
  'barcelona': AuctionBarcelonaGuide,
  'valencia': AuctionValenciaGuide,
  'sevilla': AuctionSevillaGuide,
};

const ProvinceHub: React.FC = () => {
  const { province } = useParams<{ province: string }>();
  if (!province) return <Navigate to={ROUTES.HOME} replace />;
  const provinceName = province.charAt(0).toUpperCase() + province.slice(1);
  const normalizedProvinceParam = province?.toLowerCase() || '';
  
  const GuideComponent = (CITY_GUIDES[normalizedProvinceParam] as React.FC | undefined) || null;

  const provinceAuctions = useMemo(() => {
    if (!province) return [];
    const filtered = Object.entries(AUCTIONS).filter(([_, a]) => {
      if (!isAuctionActive(a) || a.assetCategory === 'vehiculo') return false;
      const p = normalizeProvince(a.province || a.city).toLowerCase();
      return p === normalizedProvinceParam || p.includes(normalizedProvinceParam) || normalizedProvinceParam.includes(p);
    });
    return sortAuctions(filtered);
  }, [province, normalizedProvinceParam]);

  const activeAuctions = useMemo(() => {
    return provinceAuctions;
  }, [provinceAuctions]);

  const zones = useMemo(() => {
    const zoneSet = new Set<string>();
    provinceAuctions.forEach(([_, data]: [string, any]) => {
      if (data.zone && !isAuctionFinished(data.auctionDate)) {
        zoneSet.add(data.zone);
      }
    });
    return Array.from(zoneSet).sort();
  }, [provinceAuctions]);

  const propertyTypes = useMemo(() => {
    const typeSet = new Set<string>();
    provinceAuctions.forEach(([_, data]: [string, any]) => {
      if (data.propertyType && !isAuctionFinished(data.auctionDate)) {
        typeSet.add(normalizePropertyType(data.propertyType));
      }
    });
    return Array.from(typeSet).sort();
  }, [provinceAuctions]);

  const marketStats = useMemo(() => {
    if (activeAuctions.length === 0) return null;
    let validAuctionsCount = 0;
    const totalDiscount = activeAuctions.reduce((acc, [_, a]) => {
      if (a.appraisalValue && a.claimedDebt !== undefined && a.claimedDebt !== null && a.appraisalValue > a.claimedDebt) {
        const discount = 1 - a.claimedDebt / a.appraisalValue;
        if (a.claimedDebt !== 0 && discount <= 0.85) {
          validAuctionsCount++;
          return acc + discount;
        }
      }
      return acc;
    }, 0);
    
    const typeCounts: Record<string, number> = {};
    activeAuctions.forEach(([_, a]) => {
      if (a.propertyType) {
        const type = normalizePropertyType(a.propertyType);
        typeCounts[type] = (typeCounts[type] || 0) + 1;
      }
    });
    const dominantType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'inmueble';

    if (validAuctionsCount === 0) return { avgDiscount: 0, totalActive: activeAuctions.length, dominantType };
    
    const avgDiscount = (totalDiscount / validAuctionsCount) * 100;
    return {
      avgDiscount: Math.round(avgDiscount),
      totalActive: activeAuctions.length,
      dominantType
    };
  }, [activeAuctions]);

  const topOpportunities = useMemo(() => {
    return activeAuctions
      .map(([slug, data]: [string, any]) => {
        const valorReferencia = data.valorTasacion || data.valorSubasta || data.appraisalValue;
        const cantidadReclamada = data.claimedDebt;
        let ratio = (valorReferencia && cantidadReclamada !== undefined && cantidadReclamada !== null) 
          ? Math.round(((valorReferencia - cantidadReclamada) / valorReferencia) * 100)
          : 0;
        if (cantidadReclamada === 0 || ratio > 85) {
          ratio = 0;
        }
        return { slug, data, ratio };
      })
      .filter(item => item.ratio > 40)
      .sort((a, b) => b.ratio - a.ratio)
      .slice(0, 3);
  }, [activeAuctions]);

  const seoContent = useMemo(() => {
    if (!marketStats) return null;
    
    const { totalActive, avgDiscount, dominantType } = marketStats;
    const typeLabel = dominantType.toLowerCase();
    
    // Determine market profile with more nuance
    let profile: 'high-competition' | 'medium-volume' | 'undervalued-gems' | 'stable-market' = 'stable-market';
    if (totalActive > 50) profile = 'high-competition';
    else if (totalActive > 20) profile = 'medium-volume';
    else if (avgDiscount > 35) profile = 'undervalued-gems';

    const worthIt = totalActive > 10 && avgDiscount > 20 
      ? `Sí, ${provinceName} es actualmente un mercado atractivo. La combinación de ${totalActive} activos y un descuento medio del ${avgDiscount}% indica que hay margen suficiente para cubrir gastos de gestión y obtener plusvalías.`
      : `Es un mercado para especialistas. Con ${totalActive} subastas, las oportunidades son escasas y requieren un análisis quirúrgico para encontrar activos que realmente tengan un descuento real tras liquidar cargas.`;

    const variations = {
      'high-competition': {
        context: `El mercado en ${provinceName} es de alta rotación, predominando los embargos bancarios y ejecuciones hipotecarias de gran demanda. El perfil típico es el del inversor profesional que busca liquidez rápida.`,
        worthIt: worthIt,
        advice: `Debido al alto volumen de postores en ${provinceName}, es fundamental no entrar en guerras de pujas que reduzcan tu margen por debajo del 15% neto.`
      },
      'medium-volume': {
        context: `Mercado equilibrado con una mezcla de pisos de banco y herencias yacentes. Es ideal para inversores medianos que buscan menos ruido que en las capitales principales.`,
        worthIt: worthIt,
        advice: `En ${provinceName}, las subastas de seguridad social suelen tener menos competencia que las hipotecarias, revisa bien los edictos administrativos.`
      },
      'undervalued-gems': {
        context: `Detectamos activos con descuentos inusualmente altos. Muchas subastas en ${provinceName} quedan desiertas en primera convocatoria por falta de visibilidad, lo que genera oportunidades únicas.`,
        worthIt: worthIt,
        advice: `No te asustes por tasaciones bajas; en esta zona el valor de mercado real suele estar muy por encima de lo que marca el edicto si sabes filtrar por barrios.`
      },
      'stable-market': {
        context: `Mercado de goteo constante. La mayoría de las subastas en ${provinceName} son liquidaciones concursales o divisiones de cosa común, lo que suele implicar procesos más limpios jurídicamente.`,
        worthIt: worthIt,
        advice: `La paciencia es tu mejor aliada en ${provinceName}. Al haber menos volumen, la clave es disparar solo cuando el descuento supere el 40%.`
      }
    };

    const selected = variations[profile];

    return {
      context: selected.context,
      worthIt: selected.worthIt,
      advice: selected.advice,
      checkpoints: [
        { title: "Auditoría de Cargas", desc: "En la provincia de León y similares, las deudas de comunidad y el IBI pueden comerse el margen si no revisas el certificado de deuda.", link: ROUTES.ANALISIS_CARGAS },
        { title: "Estado de Ocupación", desc: "Crucial verificar si hay posesión o si el inmueble está ocupado de hecho para calcular los tiempos de lanzamiento.", link: ROUTES.COMO_COMPRAR },
        { title: "Punto de Equilibrio", desc: "No ajustes tu puja al 70%; calcula tu precio máximo real incluyendo impuestos y posible reforma.", link: ROUTES.CALCULAR_PUJA }
      ],
      faqs: [
        {
          q: `¿Cuánto dinero mínimo necesito para invertir en ${provinceName}?`,
          a: `Depende del activo, pero con depósitos que suelen rondar los 3.000€ - 8.000€ en ${typeLabel}s, puedes empezar a participar. Recuerda que debes tener el 100% del capital si no dispones de hipoteca preconcedida.`
        },
        {
          q: `¿Hay muchos pisos ocupados en las subastas de ${provinceName}?`,
          a: `Como en cualquier provincia, aproximadamente el 60% de los inmuebles judiciales salen sin posesión garantizada. Es vital filtrar aquellos que están libres de ocupantes si buscas rentabilidad inmediata.`
        },
        {
          q: `¿Dónde hay más oportunidades de subastas en ${provinceName}?`,
          a: `Históricamente, las zonas con mayor volumen de ejecución son aquellas con mayor densidad de población, aunque los mejores márgenes suelen aparecer en poblaciones de segundo cinturón.`
        }
      ]
    };
  }, [marketStats, provinceName]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [province]);

  const canonicalUrl = `https://activosoffmarket.es/subastas/${normalizedProvinceParam}`;
  const metaTitle = `Subastas BOE en ${provinceName} | Pisos, locales y oportunidades reales`;
  const metaDesc = `Descubre ${marketStats?.totalActive || 0} subastas activas en ${provinceName} con descuentos medios del ${marketStats?.avgDiscount || 0}%. Analiza oportunidades reales del BOE antes de pujar.`;
  const robotsContent = activeAuctions.length > 0 ? "index, follow" : "noindex, follow";

  return (
    <>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content={robotsContent} />
        <meta property="og:title" content={metaTitle} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
      </Helmet>
      {/* SEO Guide Section (Top) */}
      {GuideComponent !== null ? (
        <div className="city-guide-wrapper">
          <GuideComponent />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 pt-12 pb-16">
          <nav className="flex items-center text-sm text-slate-500 mb-8 font-medium" aria-label="Breadcrumb">
            <Link to={ROUTES.HOME} className="hover:text-brand-600 transition-colors">Inicio</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-brand-700 bg-brand-50 px-2 py-1 rounded-md capitalize">Subastas en {province}</span>
          </nav>
          
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight capitalize">
            Invertir en subastas en {province}
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-6">
              <div className="text-lg text-slate-600 leading-relaxed space-y-4">
                {activeAuctions.length > 0 ? (
                  <>
                    <p>
                      Actualmente analizamos {marketStats?.totalActive || 0} subastas activas en <span className="capitalize font-medium">{province}</span>. 
                      Con un descuento medio detectado en el mercado del {marketStats?.avgDiscount || 0}%, el tipo de activo predominante es <span className="capitalize">{marketStats?.dominantType.toLowerCase()}</span>.
                    </p>
                    <p>
                      Invertir en subastas inmobiliarias en {province} permite acceder a activos por debajo del valor de mercado, pero requiere experiencia en el análisis registral de cargas y deudas.
                    </p>
                  </>
                ) : (
                  <>
                    <p>
                      En este momento no hay subastas activas que cumplan nuestros criterios de calidad en <span className="capitalize font-medium">{province}</span>. 
                    </p>
                    <p>
                      Cómo prepararte para próximas subastas en {province}: mantente alerta, estudia la situación inmobiliaria de la zona y ten tu certificado digital listo para cuando surja la oportunidad.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* SEO Data Block */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="font-bold text-slate-900">Perfil de inversión en {province}</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Subastas activas</span>
                  <span className="font-bold">{activeAuctions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Descuento medio</span>
                  <span className="font-bold">{marketStats?.avgDiscount || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Tipo dominante</span>
                  <span className="font-bold capitalize">{marketStats?.dominantType.toLowerCase() || 'inmueble'}</span>
                </div>
              </div>
              <Link to={ROUTES.ANALIZAR_SUBASTA} className="block w-full text-center py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700">
                Analizar una subasta
              </Link>
              <Link to={ROUTES.GUIDE_HUB} className="block w-full text-center py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200">
                Ver guías técnicas
              </Link>
            </div>
          </div>

          {/* Mini FAQ */}
          <div className="mt-16 bg-slate-100/50 p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Preguntas frecuentes sobre subastas</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-bold mb-2">¿Cómo participar?</h4>
                <p className="text-sm text-slate-600 leading-relaxed">Necesitas certificado digital o Cl@ve PIN, registro en el Portal Único de Subastas del BOE y consignar el 5% del valor de subasta.</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">¿Principales riesgos?</h4>
                <p className="text-sm text-slate-600 leading-relaxed">Las cargas ocultas, la posesión del inmueble (ocupantes) y deudas preferentes (comunidad/IBI) si no se analizan correctamente.</p>
              </div>
              <div>
                <h4 className="font-bold mb-2">¿Cuánto se necesita?</h4>
                <p className="text-sm text-slate-600 leading-relaxed">Además del 5% del depósito inicial, debes contar con fondos para pagar el remate total, impuestos (ITP/IVA) y posibles gastos de saneamiento.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Auctions Section (Bottom) */}
      <section className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-200">
        {/* NEW OPTIMIZED HEADER BLOCK */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {GuideComponent !== null ? (
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-900 mb-4 capitalize leading-tight">
                Subastas BOE en {province}: oportunidades, precios y análisis
              </h2>
            ) : (
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-900 mb-4 capitalize leading-tight">
                Subastas BOE en {province}: oportunidades, precios y análisis
              </h1>
            )}
            <p className="text-slate-600 text-lg max-w-3xl mb-8 leading-relaxed">
              Actualmente hay <span className="font-bold text-slate-900">{marketStats?.totalActive || 0}</span> subastas activas en <span className="capitalize font-bold text-slate-900">{province}</span> con un descuento medio del <span className="font-bold text-emerald-600">-{marketStats?.avgDiscount || 0}%</span>. Analizamos las mejores oportunidades para inversores y compradores.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-brand-300 transition-colors">
                <div className="bg-brand-50 p-3 rounded-xl text-brand-600">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Subastas activas</p>
                  <p className="text-2xl font-bold text-slate-900">{marketStats?.totalActive || 0}</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-brand-300 transition-colors">
                <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Descuento medio</p>
                  <p className="text-2xl font-bold text-slate-900">-{marketStats?.avgDiscount || 0}%</p>
                </div>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:border-brand-300 transition-colors">
                <div className="bg-amber-50 p-3 rounded-xl text-amber-600">
                  <BarChart3 size={24} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tipo dominante</p>
                  <p className="text-2xl font-bold text-slate-900 capitalize">{marketStats?.dominantType.toLowerCase() || 'inmueble'}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-6 p-6 bg-slate-900 text-white rounded-3xl overflow-hidden relative border border-slate-800">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 blur-3xl rounded-full translate-x-1/3 -translate-y-1/3" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="bg-brand-500/20 p-2 rounded-lg">
                  <Zap className="text-brand-400" size={20} fill="currentColor" />
                </div>
                <p className="text-sm md:text-base font-medium text-slate-200">
                  <span className="text-white font-bold">¡Ojo!</span> Las mejores oportunidades vuelan. El 40% de los activos se adjudican antes de los últimos 5 días.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:ml-auto relative z-10 w-full lg:w-auto">
                <Link 
                  to={ROUTES.ANALIZAR_SUBASTA} 
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 text-xs font-bold bg-brand-600 text-white px-5 py-2.5 rounded-xl hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20"
                >
                  <Search size={14} /> Analizar expediente
                </Link>
                <Link 
                  to={ROUTES.COMO_COMPRAR} 
                  className="flex-1 lg:flex-none flex items-center justify-center gap-2 text-xs font-bold bg-slate-800 text-slate-200 px-5 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-750 transition-all"
                >
                  <ArrowRight size={14} /> Cómo comprar
                </Link>
              </div>
            </div>

            {/* DYNAMIC SEO CONTEXT & EXPERT ADVICE */}
            {seoContent && (
              <div className="space-y-12 mt-12 pt-12 border-t border-slate-100">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">¿Merece la pena invertir en {provinceName}?</h3>
                    <p className="text-slate-600 leading-relaxed text-lg">
                      {seoContent.worthIt}
                    </p>
                    <div className="mt-6 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-2">Contexto del mercado local</h4>
                      <p className="text-slate-600 leading-relaxed">
                        {seoContent.context}
                      </p>
                    </div>
                  </div>
                  <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 h-fit">
                    <div className="flex items-center gap-2 mb-3 text-amber-800">
                      <ShieldCheck size={20} className="text-amber-600" />
                      <h4 className="font-bold">Consejo experto en {provinceName}</h4>
                    </div>
                    <p className="text-sm text-amber-900 leading-relaxed italic">
                      "{seoContent.advice}"
                    </p>
                  </div>
                </div>

                <div>
                  <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8">Qué debes revisar antes de pujar en {provinceName}</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {seoContent.checkpoints.map((point, idx) => (
                      <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <h4 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-100 text-brand-600 text-xs">{idx + 1}</span>
                          {point.title}
                        </h4>
                        <p className="text-sm text-slate-600 mb-4 leading-relaxed line-clamp-3">
                          {point.desc}
                        </p>
                        <Link to={point.link} className="inline-flex items-center text-xs font-bold text-brand-600 hover:text-brand-700 gap-1 group-hover:gap-2 transition-all">
                          Saber más <ArrowRight size={14} />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        <div>
          <div className="bg-slate-50/95 backdrop-blur-sm -mx-6 px-6 pt-4 pb-2 mb-12 border-b border-slate-200/50">
            <RadarPremiumCTA 
              location={province} 
              variant="bar"
              origin="listing"
            />
            
            {/* Filters moved here for sticky behavior */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-4">
              {zones.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <MapPin size={12} /> Por zona
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {zones.slice(0, 8).map(zone => (
                      <Link 
                        key={zone}
                        to={`/subastas/${normalizedProvinceParam}/${zone.toLowerCase().replace(/\s+/g, '-')}`}
                        className="bg-white border border-slate-200 px-3 py-1 rounded-lg text-xs font-medium hover:border-brand-500 hover:text-brand-700 transition-all shadow-sm"
                      >
                        {zone}
                      </Link>
                    ))}
                    {zones.length > 8 && <span className="text-[10px] text-slate-400 self-center ml-1">+{zones.length - 8} más</span>}
                  </div>
                </div>
              )}

              {propertyTypes.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <Filter size={12} /> Por tipo
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {propertyTypes.map(type => (
                      <span 
                        key={type}
                        className="bg-white border border-slate-200 px-3 py-1 rounded-lg text-xs font-medium text-slate-600 capitalize shadow-sm"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {topOpportunities.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-serif font-bold text-slate-900 capitalize">
                Mejores oportunidades en {province}
              </h2>
              <button 
                onClick={() => document.getElementById('all-auctions')?.scrollIntoView({ behavior: 'smooth' })}
                className="hidden md:flex items-center gap-2 text-brand-600 font-medium hover:text-brand-700 transition-colors"
              >
                Ver todas las oportunidades <ChevronRight size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {(() => {
                let newBadgeCount = 0;
                return topOpportunities.map(({ slug, data }: { slug: string, data: any }) => {
                  const showNewBadge = data.isNew && newBadgeCount < 6;
                  if (showNewBadge) newBadgeCount++;
                  return <AuctionCard key={slug} slug={slug} data={data} showNewBadge={showNewBadge} />;
                });
              })()}
            </div>
            <button 
              onClick={() => document.getElementById('all-auctions')?.scrollIntoView({ behavior: 'smooth' })}
              className="mt-6 w-full md:hidden flex justify-center items-center gap-2 bg-brand-50 text-brand-700 font-bold px-4 py-3 rounded-xl border border-brand-100 hover:bg-brand-100 transition-colors"
            >
              Ver todas las oportunidades <ChevronRight size={18} />
            </button>
          </div>
        )}

        <div id="all-auctions" className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pt-8 border-t border-slate-200">
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2 capitalize">
              Todas las subastas en {province}
            </h2>
            <p className="text-slate-500">
              {activeAuctions.length} oportunidades analizadas actualmente.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Link 
              to={`/subastas/${normalizedProvinceParam}/oportunidades`}
              onClick={() => trackConversion(province || 'general', 'listing', 'listado')}
              className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 font-bold px-4 py-2 rounded-xl border border-brand-100 hover:bg-brand-100 transition-colors"
            >
              <TrendingUp size={18} /> Ver Oportunidades
            </Link>
          </div>
        </div>

        {provinceAuctions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(() => {
              let newBadgeCount = 0;
              return provinceAuctions.map(([slug, data]: [string, any]) => {
                const showNewBadge = data.isNew && newBadgeCount < 6;
                if (showNewBadge) newBadgeCount++;
                return <AuctionCard key={slug} slug={slug} data={data} showNewBadge={showNewBadge} />;
              });
            })()}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter className="text-slate-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No hay subastas activas en este momento</h3>
            <p className="text-slate-500 max-w-md mx-auto">
              Actualmente no hay subastas que cumplan nuestros criterios de calidad en la provincia de {province}. Vuelve pronto o suscríbete a nuestras alertas.
            </p>
          </div>
        )}
        {/* DYNAMIC MICRO FAQ SECTION */}
        {seoContent && (
          <div className="mt-16 pt-16 border-t border-slate-200">
            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-8 border-l-4 border-brand-600 pl-4">
              Preguntas sobre subastas en {provinceName}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {seoContent.faqs.map((faq, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <h4 className="font-bold text-slate-900 mb-3 text-lg leading-tight">{faq.q}</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default ProvinceHub;
