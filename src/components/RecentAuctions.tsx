import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MapPin, DollarSign, TrendingUp, ChevronRight, Calculator, Calendar, ArrowRight, Percent, Zap, ShieldCheck, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { AUCTIONS } from '../data/auctions';
import { ROUTES } from '../constants/routes';
import { getFilteredAuctions, isAuctionFinished, sortAuctions, formatDate, isAuctionActive } from '../utils/auctionHelpers';
import { AuctionCard } from './AuctionCard';
import { AuctionFilters } from './AuctionFilters';
import { AuctionData } from '../data/auctions';
import { ShareButtons } from './ShareButtons';
import { DiscoverReportsBlock } from './DiscoverReportsBlock';
import RadarPremiumCTA from './RadarPremiumCTA';
import { prefetchAuction } from '../utils/prefetch';

const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all hover:border-brand-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left font-bold text-slate-900 hover:text-brand-700 transition-colors"
      >
        <span className="text-sm md:text-base">{question}</span>
        {isOpen ? <ChevronUp size={20} className="text-brand-500" /> : <ChevronDown size={20} className="text-slate-400" />}
      </button>
      {isOpen && (
        <div className="px-5 pb-5 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-50 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
};

const SeoExpandableContent: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="mt-20 pt-12 border-t border-slate-200">
      <div className="max-w-4xl mx-auto">
        <div className={`relative overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-[2000px]' : 'max-h-[180px] md:max-h-[280px]'}`}>
          <div className="prose prose-slate max-w-none">
            <h2 className="font-serif text-xl md:text-2xl font-bold text-slate-900 mb-4">
              Subastas del BOE detectadas automáticamente
            </h2>
            <p className="text-slate-600 text-sm md:text-base mb-6">
              Nuestro sistema monitoriza diariamente el <strong>portal subastas BOE</strong> para ofrecerte las mejores <strong>oportunidades</strong> en tiempo real. Filtrar entre miles de <strong>subastas judiciales BOE</strong> puede ser una tarea titánica; por eso, centralizamos toda la información de <strong>subastas inmobiliarias en España</strong> en un solo lugar, permitiéndote detectar activos rentables de forma eficiente. Si buscas <strong>comprar piso subasta BOE</strong>, nuestra plataforma te ofrece las herramientas necesarias para un análisis riguroso. Consulta nuestra <Link to={ROUTES.GUIDE_PILLAR} className="text-brand-600 hover:underline font-medium">guía subastas BOE</Link> para empezar.
            </p>

            <h2 className="font-serif text-xl md:text-2xl font-bold text-slate-900 mb-4">
              Cómo encontrar oportunidades en subastas judiciales
            </h2>
            <p className="text-slate-600 text-sm md:text-base mb-6">
              Para localizar <strong>subastas con descuento</strong> real, es fundamental comparar el valor de subasta con el precio de mercado actual. Muchas <strong>subastas de embargos bancarios</strong> salen a licitación con tipos de salida muy atractivos, pero el éxito reside en la detección temprana de <strong>subastas inmobiliarias baratas</strong>. En Activos Off-Market, priorizamos la visibilidad de activos que permiten una inversión segura y con alto margen de beneficio. Puedes solicitar un <Link to={ROUTES.PRO} className="text-brand-600 hover:underline font-medium">análisis completo</Link> de cualquier activo en nuestros <Link to={ROUTES.PRO} className="text-brand-600 hover:underline font-medium">planes</Link>.
            </p>

            <h2 className="font-serif text-xl md:text-2xl font-bold text-slate-900 mb-4">
              Qué revisar antes de pujar en una subasta
            </h2>
            <p className="text-slate-600 text-sm md:text-base mb-6">
              Participar en <strong>subastas sin cargas</strong> ocultas es el objetivo de todo inversor que analiza <strong>subastas judiciales viviendas</strong>. Antes de realizar un depósito, es imperativo realizar un <Link to={ROUTES.CHARGES} className="text-brand-600 hover:underline font-medium">análisis de cargas</Link> exhaustivo en el Registro de la Propiedad. Asegúrate de entender la diferencia entre cargas anteriores (que se mantienen) y posteriores (que se cancelan). Un análisis técnico previo del edicto judicial te ahorrará sorpresas desagradables tras la adjudicación del inmueble.
            </p>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-slate-900 mb-3">Cómo participar en una subasta BOE:</h3>
              <ol className="list-decimal list-inside text-slate-600 text-sm md:text-base space-y-1">
                <li>Analizar el edicto judicial</li>
                <li>Revisar cargas en el Registro</li>
                <li>Estudiar la tasación oficial</li>
                <li>Definir tu puja máxima rentable</li>
              </ol>
            </div>

            <p className="text-[10px] md:text-xs text-slate-400 italic mt-8 border-t border-slate-100 pt-4">
              Nota: La participación en subastas judiciales puede implicar riesgos. Se recomienda revisar siempre el expediente completo antes de pujar.
            </p>
          </div>
          
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 to-transparent z-10" />
          )}
        </div>
        
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-4 flex items-center gap-2 text-brand-600 font-bold hover:text-brand-700 transition-colors mx-auto md:mx-0"
        >
          {isExpanded ? (
            <>Ver menos <ChevronUp size={18} /></>
          ) : (
            <>Ver más sobre subastas <ChevronDown size={18} /></>
          )}
        </button>
      </div>
    </div>
  );
};

const RecentAuctions: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredAuctions, setFilteredAuctions] = useState<Record<string, AuctionData>>(AUCTIONS);
  const [sortBy, setSortBy] = useState<string>('recent');
  
  const currentPage = useMemo(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? Number(pageParam) : 1;
  }, [searchParams]);

  console.log("currentPage", currentPage);

  const itemsPerPage = 12;
  
  const sortedAuctions = sortAuctions(Object.entries(filteredAuctions), sortBy);
  
  // Calculate total active auctions (without filters)
  const totalActiveAuctions = useMemo(() => {
    return Object.values(AUCTIONS).filter(a => isAuctionActive(a)).length;
  }, []);

  console.log('RecentAuctions: Total AUCTIONS keys:', Object.keys(AUCTIONS).length);
  const auctionsWithBadges = useMemo(() => {
    let newBadgeCount = 0;
    return sortedAuctions.map(([slug, data]) => {
      const showNewBadge = data.isNew && newBadgeCount < 6;
      if (showNewBadge) newBadgeCount++;
      return { slug, data, showNewBadge };
    });
  }, [sortedAuctions]);
  
  // Pagination logic
  const totalPages = Math.ceil(auctionsWithBadges.length / itemsPerPage);
  const safePage = Math.min(currentPage, totalPages || 1);
  const paginatedAuctions = useMemo(() => {
    const startIndex = (safePage - 1) * itemsPerPage;
    const result = auctionsWithBadges.slice(startIndex, startIndex + itemsPerPage);
    console.log('RecentAuctions: paginatedAuctions:', result);
    return result;
  }, [auctionsWithBadges, safePage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      if (page === 1) {
        params.delete('page');
      } else {
        params.set('page', page.toString());
      }
      return params;
    }, { replace: false });
  };

  const handleFilterChange = useCallback((newFiltered: Record<string, AuctionData>) => {
    setFilteredAuctions(newFiltered);
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      return params;
    }, { replace: false });
  }, [setSearchParams]);

  const handleSortChange = useCallback((newSort: string) => {
    setSortBy(newSort);
    setSearchParams(prev => {
      const params = new URLSearchParams(prev);
      return params;
    }, { replace: false });
  }, [setSearchParams]);
  
  const activeCount = Object
    .values(filteredAuctions)
    .filter(a => isAuctionActive(a))
    .length;
  const hasFilters = activeCount !== totalActiveAuctions;

  const featuredAuctions = useMemo(() => {
    return Object.entries(AUCTIONS)
      .filter(([_, data]) => isAuctionActive(data) && data.valorTasacion)
      .sort(([_, a], [__, b]) => {
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        return (b.valorTasacion || 0) - (a.valorTasacion || 0);
      })
      .slice(0, 3);
  }, []);

  const getSortLabel = (sort: string) => {
    switch (sort) {
      case 'oldest': return 'Más antiguas';
      case 'value_high': return 'Mayor valor';
      case 'value_low': return 'Menor valor';
      default: return '';
    }
  };

  const sortLabel = getSortLabel(sortBy);

  const marketStats = useMemo(() => {
    const auctions = Object.values(AUCTIONS);
    const total = auctions.length;
    const madrid = auctions.filter(a => a.province?.toLowerCase() === 'madrid').length;
    const barcelona = auctions.filter(a => a.province?.toLowerCase() === 'barcelona').length;
    const valencia = auctions.filter(a => a.province?.toLowerCase() === 'valencia').length;
    
    return { total, madrid, barcelona, valencia };
  }, []);

  useEffect(() => {
    if (safePage > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
    
    // Meta Title
    document.title = "Subastas BOE: Últimas oportunidades inmobiliarias en España";
    
    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', "Subastas inmobiliarias del BOE detectadas automáticamente. Encuentra oportunidades con descuento, analiza cargas y revisa el expediente antes de pujar.");

    // Open Graph Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', "Subastas BOE en España | Oportunidades inmobiliarias");

    // Open Graph Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', "Listado actualizado de subastas inmobiliarias del BOE. Detecta oportunidades, revisa riesgos y analiza antes de pujar.");

    // SEO Pagination: noindex,follow for page > 1
    let robotsMeta = document.querySelector('meta[name="robots"]');
    if (safePage > 1) {
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
      }
      robotsMeta.setAttribute('content', 'noindex,follow');
    } else if (robotsMeta) {
      robotsMeta.setAttribute('content', 'index,follow');
    }

    // Canonical link: always base URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', window.location.origin + window.location.pathname);
  }, [safePage]);

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-600">
      <script type="application/ld+json">
        {JSON.stringify([
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": window.location.origin
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Subastas Recientes",
                "item": window.location.origin + window.location.pathname
              }
            ]
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Últimas subastas inmobiliarias en España",
            "description": "Listado de las subastas judiciales y administrativas más recientes detectadas en España.",
            "numberOfItems": activeCount,
            "itemListElement": paginatedAuctions.map(({ slug, data }, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "url": `${window.location.origin}/subasta/${slug}`,
              "name": `${data.propertyType} en ${data.city || data.province}`
            }))
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "¿Cómo encontrar oportunidades reales en el listado de subastas?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Las mejores oportunidades se encuentran analizando la diferencia entre el valor de tasación y el precio de mercado actual. Es vital filtrar por activos con cargas cancelables y revisar el estado ocupacional del inmueble."
                }
              },
              {
                "@type": "Question",
                "name": "¿Qué riesgos hay que revisar en el BOE antes de pujar?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Es imprescindible revisar las cargas preferentes en la certificación de dominio y cargas, el estado de ocupación, posibles deudas de comunidad o IBI, y si el edicto contiene errores en la descripción del activo."
                }
              },
              {
                "@type": "Question",
                "name": "¿Es necesario contar con un abogado para participar en subastas?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Aunque cualquier persona con certificado digital puede pujar, se recomienda encarecidamente contar con asesoramiento legal o técnico para la revisión del expediente judicial y asegurar que la adjudicación sea firme y libre de cargas inesperadas."
                }
              }
            ]
          }
        ])}
      </script>
      <header className="bg-white border-b border-slate-200 pt-6 md:pt-8 pb-8 md:pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center text-xs md:text-sm text-slate-500 mb-4 md:mb-6 font-medium" aria-label="Breadcrumb">
            <Link 
              to={ROUTES.HOME} 
              className="hover:text-brand-600 transition-colors"
            >
              Inicio
            </Link>
            <ChevronRight size={12} className="mx-1.5 md:mx-2" />
            <span className="text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md" aria-current="page">Subastas Recientes</span>
          </nav>

          <h1 className="font-serif text-3xl md:text-5xl font-bold text-slate-900 mb-3 md:mb-4 leading-tight">
            Últimas subastas BOE e inmuebles detectados en España
          </h1>
          <div className="min-h-[24px] md:min-h-0 flex items-center gap-2 text-slate-500 text-xs md:text-sm mb-6 font-medium">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Actualizado hoy · <b className="text-slate-900">{activeCount}</b> subastas detectadas
          </div>

          <ShareButtons 
            title="Últimas subastas inmobiliarias detectadas en España" 
            className="-mt-1" 
            province="España"
            origin="listing"
          />
        </div>
      </header>

      <div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-slate-50/95 -mx-6 px-6 pt-4 pb-2 mb-6 border-b border-slate-200/50">
            <RadarPremiumCTA 
              location="España" 
              variant="bar"
              origin="listing"
            />
            <AuctionFilters auctions={AUCTIONS} onFilteredChange={handleFilterChange} onSortChange={handleSortChange} />
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12">
        {/* Bloque A: Trust Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 border-b border-slate-200 pb-8">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
              <Zap size={18} />
            </div>
            <p className="text-xs md:text-sm font-medium text-slate-700">Detección en tiempo real de nuevos edictos del BOE</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
              <ShieldCheck size={18} />
            </div>
            <p className="text-xs md:text-sm font-medium text-slate-700">Análisis técnico de cargas y riesgos catastrales</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600 shrink-0">
              <FileText size={18} />
            </div>
            <p className="text-xs md:text-sm font-medium text-slate-700">Acceso directo a datos clave del expediente judicial</p>
          </div>
        </div>

        {!hasFilters && featuredAuctions.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="text-brand-500" size={24} />
                Subastas destacadas hoy
              </h2>
              <div className="hidden md:block h-px flex-grow mx-6 bg-slate-200" />
            </div>
            <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-3 md:gap-6 pb-1 md:pb-0 snap-x snap-mandatory scroll-smooth scrollbar-none">
              {featuredAuctions.map(([slug, data]) => (
                <div key={`featured-${slug}`} className="min-w-[85%] max-w-[85%] md:min-w-0 md:max-w-none snap-center">
                  <AuctionCard slug={slug} data={data} showImage={false} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-100 text-brand-700 font-bold px-3 py-1.5 rounded-lg shadow-sm w-fit text-xs md:text-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500"></span>
            </span>
            {hasFilters 
              ? `Mostrando ${activeCount} de ${totalActiveAuctions} subastas` 
              : `${totalActiveAuctions} subastas activas ahora`}
          </div>

          {sortLabel && (
            <div className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-600 text-xs px-2.5 py-1 rounded-md w-fit">
              <span className="font-medium">Orden:</span> {sortLabel}
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {paginatedAuctions.length > 0 ? paginatedAuctions.map(({ slug, data, showNewBadge }) => (
            <AuctionCard key={slug} slug={slug} data={data} showNewBadge={showNewBadge} showImage={false} />
          )) : (
            <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-lg">No se han encontrado subastas con los filtros actuales.</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
              >
                Reiniciar filtros
              </button>
            </div>
          )}
        </div>

        {/* Bloque B: Editorial SEO + FAQ */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-slate max-w-none mb-12">
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 mb-6">Inversión inteligente en subastas inmobiliarias</h2>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                El mercado de subastas judiciales y administrativas en España representa una de las vías más eficientes para la adquisición de activos inmobiliarios con descuentos que a menudo superan el 30% o 40% sobre su valor de tasación oficial. No obstante, navegar por el Portal de Subastas del BOE requiere una metodología rigurosa para evitar riesgos jurídicos y financieros. 
              </p>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                En Activos Off-Market, simplificamos este proceso mediante la monitorización constante de nuevos edictos, permitiendo a nuestros usuarios detectar oportunidades en tiempo real sin necesidad de revisar manualmente miles de publicaciones diarias. Nuestro enfoque se centra en la transparencia y el análisis técnico, cruzando datos de Catastro y Registro para identificar posibles cargas preferentes o situaciones posesorias complejas. Antes de participar en cualquier puja, es fundamental realizar una revisión exhaustiva del expediente judicial y contar con una estrategia de puja máxima definida. Nuestra plataforma no solo lista activos, sino que proporciona el contexto necesario para que cada inversión se realice con la máxima seguridad jurídica y rentabilidad potencial.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Preguntas frecuentes sobre subastas</h3>
              <FaqItem 
                question="¿Cómo encontrar oportunidades reales en el listado de subastas?"
                answer="Las mejores oportunidades se encuentran analizando la diferencia entre el valor de tasación y el precio de mercado actual. Es vital filtrar por activos con cargas cancelables y revisar el estado ocupacional del inmueble antes de comprometer capital."
              />
              <FaqItem 
                question="¿Qué riesgos hay que revisar en el BOE antes de pujar?"
                answer="Es imprescindible revisar las cargas preferentes en la certificación de dominio y cargas, el estado de ocupación, posibles deudas de comunidad o IBI, y si el edicto contiene errores en la descripción del activo que puedan invalidar la subasta."
              />
              <FaqItem 
                question="¿Es necesario contar con un abogado para participar en subastas?"
                answer="Aunque cualquier persona con certificado digital puede pujar, se recomienda encarecidamente contar con asesoramiento legal o técnico para la revisión del expediente judicial y asegurar que la adjudicación sea firme y libre de cargas inesperadas tras el decreto de adjudicación."
              />
            </div>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex flex-wrap justify-center items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-10 h-10 rounded-lg font-bold transition-all ${
                  safePage === page
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-200'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-brand-500 hover:text-brand-600'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}

        <div className="mt-20 bg-brand-900 rounded-[2.5rem] p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-800 rounded-full -mr-32 -mt-32 opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-700 rounded-full -ml-32 -mb-32 opacity-30 blur-3xl"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <TrendingUp className="text-brand-400 mx-auto mb-6" size={48} />
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-6">
              ¿Quieres saber cuánto pujar por estas subastas?
            </h2>
            <p className="text-brand-100 mb-10 text-lg leading-relaxed">
              No dejes tu inversión al azar. Utiliza nuestra calculadora profesional para determinar tu puja máxima rentable basándote en números reales.
            </p>
            <Link 
              to="/calculadora-subastas" 
              className="inline-flex items-center gap-3 bg-white text-brand-900 font-bold py-5 px-10 rounded-2xl hover:bg-brand-50 transition-all shadow-xl text-lg"
            >
              Ir a la Calculadora <Calculator size={22} />
            </Link>
          </div>
        </div>

        <div className="mt-12 bg-emerald-50 border border-emerald-100 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white shrink-0">
              <Percent size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">¿Buscas las mejores oportunidades?</h3>
              <p className="text-slate-600">Hemos seleccionado los activos con mayor margen de beneficio potencial.</p>
            </div>
          </div>
          <Link 
            to="/subastas-descuento-50" 
            className="bg-emerald-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-emerald-700 transition-all whitespace-nowrap"
          >
            Subastas con más del 50% de descuento
          </Link>
        </div>

        <div className="mt-20 pt-12 border-t border-slate-200">
          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-8 text-center">
            Hub de contenido y subastas por ciudad
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <Link 
              to={ROUTES.NOTICIAS_SUBASTAS_INDEX} 
              className="flex items-center justify-between bg-white border border-slate-200 p-6 rounded-2xl hover:border-brand-500 hover:shadow-md transition-all group"
            >
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-brand-600">Noticias de Subastas</h3>
                <p className="text-sm text-slate-500">Actualidad y avisos del BOE</p>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-brand-600" />
            </Link>
            <Link 
              to={ROUTES.HIGH_DISCOUNT} 
              className="flex items-center justify-between bg-white border border-slate-200 p-6 rounded-2xl hover:border-brand-500 hover:shadow-md transition-all group"
            >
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-brand-600">Subastas con Descuento</h3>
                <p className="text-sm text-slate-500">Más del 50% sobre tasación</p>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-brand-600" />
            </Link>
            <Link 
              to={ROUTES.GUIDE_PILLAR} 
              className="flex items-center justify-between bg-white border border-slate-200 p-6 rounded-2xl hover:border-brand-500 hover:shadow-md transition-all group"
            >
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-brand-600">Guía de Inversión</h3>
                <p className="text-sm text-slate-500">Aprende a pujar con seguridad</p>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-brand-600" />
            </Link>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Explorar por ciudad</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link 
              to="/subastas-en/madrid" 
              className="bg-white border border-slate-200 p-4 rounded-xl text-center hover:border-brand-500 hover:text-brand-700 transition-all font-bold shadow-sm"
            >
              Madrid
            </Link>
            <Link 
              to="/subastas-en/barcelona" 
              className="bg-white border border-slate-200 p-4 rounded-xl text-center hover:border-brand-500 hover:text-brand-700 transition-all font-bold shadow-sm"
            >
              Barcelona
            </Link>
            <Link 
              to="/subastas-en/valencia" 
              className="bg-white border border-slate-200 p-4 rounded-xl text-center hover:border-brand-500 hover:text-brand-700 transition-all font-bold shadow-sm"
            >
              Valencia
            </Link>
            <Link 
              to="/subastas-en/sevilla" 
              className="bg-white border border-slate-200 p-4 rounded-xl text-center hover:border-brand-500 hover:text-brand-700 transition-all font-bold shadow-sm"
            >
              Sevilla
            </Link>
          </div>
        </div>

        <SeoExpandableContent />

        <div className="mt-24">
          <DiscoverReportsBlock />
        </div>
      </main>
    </div>
  );
};

export default RecentAuctions;
