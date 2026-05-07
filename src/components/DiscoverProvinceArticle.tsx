import React, { useEffect, useMemo } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { AUCTIONS } from '../data/auctions';
import { DISCOVER_REPORTS } from '../data/discoverReports';
import { getFilteredAuctions } from '../utils/auctionHelpers';
import { Calendar, ChevronRight, TrendingUp, MapPin, ArrowRight, Star, Zap } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { isAuctionFinished, sortActiveFirst } from '../utils/auctionHelpers';
import { normalizeProvince, normalizePropertyType, normalizeLocationLabel } from '../utils/auctionNormalizer';
import { trackConversion } from '../utils/tracking';
import { AuctionCard } from './AuctionCard';
import DiscoverSingleAuctionArticle from './DiscoverSingleAuctionArticle';
import { generateEditorialArticle, shouldGenerateDiscoverArticle } from '../utils/editorialGenerator';
import PremiumValueBlock from './PremiumValueBlock';
import { ShareButtons } from './ShareButtons';
import { getImageForPropertyType } from '../constants/auctionImages';

import { getAllowedProvincesForToday, isProvinceEligible, isHighQualityProvinceArticle } from '../utils/discoverLimits';

const DiscoverProvinceArticle: React.FC = () => {
  const { province } = useParams<{ province: string }>();
  
  const isEligible = useMemo(() => {
    if (!province) return false;
    return isProvinceEligible(province, AUCTIONS);
  }, [province]);

  const isHighQuality = useMemo(() => {
    if (!province) return false;
    return isHighQualityProvinceArticle(province, AUCTIONS);
  }, [province]);

  const allowedProvinces = useMemo(() => getAllowedProvincesForToday(), []);
  const normalizedProvinceParam = useMemo(() => {
    if (!province) return '';
    return normalizeProvince(province.replace(/-/g, ' ')).toLowerCase();
  }, [province]);

  const isAllowed = useMemo(() => {
    if (!province || !isEligible) return false;
    return allowedProvinces.some(allowed => normalizeProvince(allowed).toLowerCase() === normalizedProvinceParam);
  }, [normalizedProvinceParam, allowedProvinces, isEligible]);

  if (!isAllowed) {
    return <Navigate to="/noticias-subastas" replace />;
  }

  const provinceAuctions = useMemo(() => {
    if (!province) return [];
    const filtered = Object.entries(AUCTIONS).filter(([_, a]) => {
      const p = normalizeProvince(a.province || a.city).toLowerCase();
      return p === normalizedProvinceParam || p.includes(normalizedProvinceParam) || normalizedProvinceParam.includes(p);
    });
    return sortActiveFirst(filtered, (item) => item[1].auctionDate);
  }, [province, normalizedProvinceParam]);

  const provinceName = useMemo(() => {
    if (provinceAuctions.length > 0) {
      return normalizeProvince(provinceAuctions[0][1].province || provinceAuctions[0][1].city);
    }
    if (!province) return '';
    return province.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }, [provinceAuctions, province]);

  const sortedProvinceAuctions = useMemo(() => {
    if (provinceAuctions.length === 0) return [];

    // 1. Filter active auctions first
    const active = provinceAuctions.filter(([_, a]) => !isAuctionFinished(a.auctionDate));
    
    // 2. Preferred: NEW (published < 48h) or ENDING_SOON (closing < 3 days)
    const now = new Date().getTime();
    const preferred = active.filter(([_, a]) => {
      const isNew = a.publishedAt ? (now - new Date(a.publishedAt).getTime()) < (48 * 60 * 60 * 1000) : false;
      const isEndingSoon = a.auctionDate ? (new Date(a.auctionDate).getTime() - now) < (3 * 24 * 60 * 60 * 1000) && (new Date(a.auctionDate).getTime() - now) > 0 : false;
      return isNew || isEndingSoon;
    });

    const pool = preferred.length > 0 ? preferred : (active.length > 0 ? active : provinceAuctions);

    // 3. Sort by criteria: Housing > Opportunity Score > Date
    return [...pool].sort((a, b) => {
      const aData = a[1];
      const bData = b[1];

      // Housing priority
      const aIsHousing = normalizePropertyType(aData.propertyType).toLowerCase().includes('vivienda');
      const bIsHousing = normalizePropertyType(bData.propertyType).toLowerCase().includes('vivienda');
      if (aIsHousing && !bIsHousing) return -1;
      if (!aIsHousing && bIsHousing) return 1;

      // Opportunity Score priority (if exists)
      const aScore = (aData as any).opportunityScore || 0;
      const bScore = (bData as any).opportunityScore || 0;
      if (aScore !== bScore) return bScore - aScore;

      // Date priority (closer to now)
      const aTime = aData.auctionDate ? new Date(aData.auctionDate).getTime() : 0;
      const bTime = bData.auctionDate ? new Date(bData.auctionDate).getTime() : 0;
      return aTime - bTime;
    });
  }, [provinceAuctions]);

  const featuredAuction = useMemo(() => sortedProvinceAuctions[0] || null, [sortedProvinceAuctions]);
  
  const activeAuctions = useMemo(() => {
    return provinceAuctions.filter(([_, data]) => !isAuctionFinished(data.auctionDate));
  }, [provinceAuctions]);

  const recentlyAdjudicated = useMemo(() => {
    if (provinceAuctions.length === 0) return [];
    return provinceAuctions
      .filter(([_, a]) => a.auctionResultStatus === 'adjudicated' && a.finalPrice)
      .sort((a, b) => {
        const aTime = a[1].resultCheckedAt ? new Date(a[1].resultCheckedAt).getTime() : 0;
        const bTime = b[1].resultCheckedAt ? new Date(b[1].resultCheckedAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 3);
  }, [provinceAuctions]);

  const featuredOpportunity = useMemo(() => {
    if (activeAuctions.length === 0) return null;
    
    const now = new Date().getTime();
    const urgent = activeAuctions.filter(([_, a]) => {
      const isNew = a.publishedAt ? (now - new Date(a.publishedAt).getTime()) < (48 * 60 * 60 * 1000) : false;
      const isEndingSoon = a.auctionDate ? (new Date(a.auctionDate).getTime() - now) < (3 * 24 * 60 * 60 * 1000) && (new Date(a.auctionDate).getTime() - now) > 0 : false;
      return isNew || isEndingSoon;
    });

    const pool = urgent.length > 0 ? urgent : activeAuctions;

    return [...pool].sort((a, b) => {
      const aScore = (a[1] as any).opportunityScore || 0;
      const bScore = (b[1] as any).opportunityScore || 0;
      return bScore - aScore;
    })[0];
  }, [activeAuctions]);
  
  const topExamples = useMemo(() => 
    sortedProvinceAuctions.slice(0, 3).map(([id, data]) => ({ id, data })), 
    [sortedProvinceAuctions]
  );

  const stats = useMemo(() => {
    if (activeAuctions.length === 0) return null;
    
    let maxDiscount = 0;
    
    activeAuctions.forEach(([_, a]) => {
      if (a.appraisalValue && a.claimedDebt !== undefined && a.claimedDebt !== null && a.appraisalValue > a.claimedDebt) {
        const discount = Math.round((1 - a.claimedDebt / a.appraisalValue) * 100);
        if (a.claimedDebt !== 0 && discount <= 85 && discount > maxDiscount) {
          maxDiscount = discount;
        }
      }
    });
    
    return {
      totalActive: activeAuctions.length,
      maxDiscount
    };
  }, [activeAuctions]);

  const housingPercentage = useMemo(() => {
    const provinceAuctions = Object.values(AUCTIONS).filter(a => a.province === provinceName);
    if (provinceAuctions.length === 0) return 0;
    const housing = provinceAuctions.filter(a => a.propertyType === 'VIVIENDA').length;
    return Math.round((housing / provinceAuctions.length) * 100);
  }, [provinceName]);

  const getStatus = (date?: string) => {
    if (!date) return { label: 'Desconocido', sentence: 'Estado no disponible.' };
    const d = new Date(date);
    const today = new Date();
    if (isAuctionFinished(date)) return { label: 'Finalizada', sentence: 'Resumen de resultados de la subasta.' };
    if (d > today) return { label: 'Próximamente', sentence: 'Análisis previo a la apertura.' };
    return { label: 'Activa', sentence: 'Análisis de la oportunidad actual.' };
  };

  // Seeded PRNG for consistency
  const getSeededRandom = (seedStr: string) => {
    let h = 0;
    for (let i = 0; i < seedStr.length; i++) {
      h = Math.imul(31, h) + seedStr.charCodeAt(i) | 0;
    }
    const s = Math.abs(h) / 2147483647;
    return () => s;
  };

  const pickRandom = <T,>(arr: T[], randomFn: () => number): T => {
    return arr[Math.floor(randomFn() * arr.length)];
  };

  const shuffleArray = <T,>(array: T[], randomFn: () => number): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(randomFn() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const content = useMemo(() => {
    const total = stats?.totalActive || 0;
    const maxDesc = stats?.maxDiscount || 0;
    const bestDeal = featuredAuction?.[1];
    const bestType = bestDeal ? normalizePropertyType(bestDeal.propertyType).toLowerCase() : 'inmueble';
    const bestCity = bestDeal ? (bestDeal.city || provinceName) : provinceName;
    const slugBase = provinceName.toLowerCase().replace(/\s+/g, '-');
    const dynamicImage = getImageForPropertyType('default', `${slugBase}-0-${provinceName}`);

    const random = getSeededRandom(provinceName);

    // Dynamic Theme Selection
    const themes = ['RISKS', 'FAMILIES', 'LOCAL_MARKET', 'NO_BID', 'MYTHS', 'OPPORTUNITY'];
    const selectedTheme = pickRandom(themes, random);

    const titleVariants = [
      `Ojo a estas subastas en ${provinceName}: hay descuentos poco habituales`,
      `Este inmueble en ${provinceName} podría venderse muy por debajo de su valor`,
      `Lo que está pasando con estas subastas en ${provinceName} no es normal`,
      `Detectada oportunidad en ${provinceName} con un ${maxDesc}% de descuento`,
      `Análisis del mercado de subastas en ${provinceName}: nuevas entradas`,
      `¿Oportunidad real? Desgranamos las subastas activas en ${provinceName}`,
      `Guía para comprar en subasta en ${provinceName}: lo que nadie te cuenta`,
      `Subastas judiciales en ${provinceName}: mitos y realidades del mercado`
    ];

    const imageTitleVariants = [
      `Subastas Interesantes en ${provinceName}`,
      `Oportunidades en ${provinceName}`,
      `Mercado subastas ${provinceName}`,
      `Viviendas en subasta en ${provinceName}`,
      `Gran Oportunidad en ${provinceName}`
    ];

    const leadVariants = {
      'RISKS': `El mercado inmobiliario en ${provinceName} atraviesa una etapa de reajuste donde las oportunidades más rentables ya no se encuentran en los canales tradicionales de compraventa. En este contexto, las ejecuciones judiciales se han consolidado como una vía alternativa de inversión patrimonial. ¿Es realmente seguro adquirir una vivienda o un activo comercial mediante el sistema de subastas del Estado? Aunque históricamente ha existido un halo de opacidad en torno a este sector, el actual portal del BOE ofrece un marco de transparencia operativa sin precedentes. Sin embargo, el verdadero reto no está en pujar, sino en la fase previa de due diligence. Actualmente, nuestro radar técnico monitoriza un total de ${total} subastas activas en la región, abarcando diversas tipologías como ${bestType}s, locales comerciales y suelo urbano. Estas oportunidades esconden márgenes de seguridad que pueden llegar hasta un ${maxDesc}% de descuento frente al mercado libre, pero exigen una lectura meticulosa de los edictos. Las diferencias entre el valor de tasación oficial, a menudo desfasado, y la deuda real reclamada son el terreno donde el inversor cualificado extrae toda su rentabilidad. En este análisis profundo, vamos a desgranar cómo el perfil técnico permite filtrar activos con cargas ocultas y centrarse únicamente en aquellos expedientes de ${provinceName} que ofrecen una ecuación riesgo-beneficio verdaderamente favorable. La clave del éxito en la compra de un inmueble judicial reside en identificar, antes que nadie, la situación posesoria real y la estructura de cargas preferentes que no se liquidan con el remate.`,
      
      'FAMILIES': `Encontrar rentabilidad en el mercado libre de ${provinceName} se ha convertido en una tarea compleja debido la estabilización de precios y la contracción de la oferta de calidad. Es aquí donde las subastas públicas y extrajudiciales irrumpen como un canal primario de prospección para el inversor y el ahorrador exigente. ¿Sabías que el ahorro técnico conseguido en adjudicaciones recientes permite a muchas familias y patrimonialistas saltarse la dependencia del crédito bancario tradicional? Con los precios de los distritos demandados tocando su techo cíclico, el BOE actúa como un mecanismo de ajuste de liquidez. A día de hoy, hemos identificado un volumen operativo de ${total} activos en proceso de licitación pública en toda la provincia. Dentro de esta cartera destacan inmuebles catalogados como ${bestType}, que históricamente han demostrado ser un valor seguro contra la inflación y la volatilidad económica. El descuento latente detectado en los expedientes más interesantes de ${provinceName} roza un diferencial del ${maxDesc}%. Este margen de seguridad no es fruto del azar, sino de la dinámica de los juzgados y de los procesos de ejecución que finalizan. Para acceder a estos retornos es imperativo comprender que no se está comprando un inmueble de forma convencional, sino derechos sobre un activo condicionado a una liquidación. La ventaja competitiva real la obtienen aquellos perfiles que dedican recursos a investigar el estado físico del bien, sus posibles afecciones fiscales locales y las vías para obtener la posesión efectiva en plazos razonables tras el decreto de adjudicación.`,
      
      'LOCAL_MARKET': `El ecosistema inmobiliario local en la provincia de ${provinceName} sigue demostrando una fuerte demanda subyacente frente a una oferta constreñida. Mientras la mayoría del capital retail compite por las mismas oportunidades en plataformas inmobiliarias de uso público, existe un mercado secundario paralelo que aporta descuentos estratégicos fuera del radar general. Nos referimos a las adjudicaciones de bienes procedentes de ejecuciones judiciales y administrativas. En los juzgados y dependencias de recaudación de ${provinceName} se está gestionando en este preciso momento la venta de ${total} activos inmobiliarios, cada uno con un expediente singular. La distribución provincial abarca desde plazas de garaje hasta tipologías de mayor valor refugio como el ${bestType}. La pregunta fundamental para cualquier analista de mercado no es si estos activos son rentables (nuestro seguimiento indica descuentos máximos de hasta el ${maxDesc}% respecto a las valoraciones de calle), sino por qué siguen resultando invisibles para el comprador medio. La barrera de entrada principal no es el capital, ya que hay escalones de inversión para múltiples bolsillos. La verdadera barrera es el conocimiento normativo y procesal. Un inversor preparado que analiza correctamente un expediente judicial en ${provinceName} no evalúa las fotografías del bien, sino la calidad jurídica de su inscripción registral. Comprender cómo la Ley de Enjuiciamiento Civil purga las cargas posteriores y qué deudas sobreviven (como ciertas afecciones del IBI o de la comunidad de propietarios) es el paso definitivo para transformar una subasta pública en una adquisición de alto rendimiento.`,
      
      'NO_BID': `Resulta paradójico que en un mercado tensionado como el de ${provinceName}, un porcentaje altamente significativo de subastas del BOE termine declarándose desierto o sin la presentación de postores efectivos. Este fenómeno no responde en absoluto a la falta de calidad intrínseca de los inmuebles licitados, sino a la conjunción del desconocimiento generalizado y una paralización preventiva originada por el riesgo percibido. Esta asimetría de información es el entorno natural donde el inversor avispado consolida sus carteras patrimonialistas. El análisis exhaustivo de la situación actual nos arroja un panorama en el que figuran nada menos que ${total} expedientes de subasta activos en la provincia. Entre ellos, el volumen más notorio se agrupa en torno a inmuebles de tipología ${bestType}, especialmente en núcleos de alto tránsito y zonas con demanda de alquiler fuerte. Al revisar los expedientes con óptica analítica, afloran divergencias abismales entre los tipos de subasta exigidos y los valores de adjudicación reales, delineando márgenes operativos que pueden escalar hasta un ${maxDesc}% de ahorro. No obstante, lograr asentar este horizonte de rentabilidad exige una labor técnica previa e ineludible. Validar expedientes en ${provinceName} obliga a interpretar correctamente la certificación de dominio y cargas, a ponderar la viabilidad de un lanzamiento judicial si el activo no se encuentra libre de ocupantes o precaristas, y a tener la certeza matemática de que las cargas preferentes han sido debidamente actualizadas mediante oficios al juzgado. La rentabilidad es simplemente la prima que paga el mercado por aportar liquidez y certeza en un escenario dominado por la duda.`,
      
      'MYTHS': `Existe una serie de narrativas y dogmas obsoletos que continúan frenando a miles de pequeños y medianos ahorradores en ${provinceName} a la hora de contemplar las subastas judiciales como mecanismo prioritario de inversión. Se mantiene el imaginario colectivo de la opacidad institucional y los lobbies cerrados. Nada más lejos de la realidad operativa de hoy en día. La digitalización integral del proceso a través de plataformas unificadas ha homogeneizado las reglas del juego. Cualquier particular o entidad, con la debida preparación técnica y su pertinente certificado digital, dispone de acceso concurrente a un inventario vivo de ${total} expedientes en toda la provincia de ${provinceName}. El abanico de activos no incluye solo producto residual, sino inmuebles de rotación rápida como el ${bestType}, que sostienen la estructura residencial del país. En nuestras prospecciones, los mejores ratios de eficiencia logran diferencias en precio que arrojan oportunidades de entrada con un descuento del ${maxDesc}% sobre el mercado. Lejos de la búsqueda del chollo improvisado, el proceso requiere la edificación de una estrategia sólida. Hay que cuantificar riesgos contingentes: el estado de las instalaciones interiores a puerta cerrada, los tributos municipales devengados y no prescritos, o los escenarios procesales de la consignación del resto del precio. Los inversores que hoy están triunfando en ${provinceName} aplican metodologías asimilables a la ingeniería financiera, analizando cada expediente del BOE no como un boleto de lotería, sino como un proyecto de inversión medible en términos de TIR (Tasa Interna de Retorno) y retorno sobre el capital invertido.`,
      
      'OPPORTUNITY': `En el actual ciclo de mercado, ${provinceName} se encuentra en una coyuntura donde los precios de salida de activos residenciales y comerciales apenas muestran flexiones significativas a la baja. Sin embargo, nuestro sistema de monitorización algorítmica acaba de certificar la consolidación de una bolsa paralela de activos excepcionales originados a través de ejecuciones hipotecarias, embargos por deudas públicas y disoluciones de proindiviso. En total, hemos contabilizado ${total} lotes activos que operan con reglas presupuestarias drásticamente distintas al mercado de agentes inmobiliarios. De hecho, el descuento parametrizado para estas carteras sitúa la franja superior de oportunidad estructural en niveles de hasta el ${maxDesc}%. Entre estos activos, la preeminencia de inmuebles clasificados como ${bestType} ofrece una lectura clara: se trata de producto apto tanto para estrategias de flip (compra, adecuación y venta rápida) como para consolidación de renta pasiva estable. La verdadera ventana de oportunidad en ${provinceName} no reside simplemente en ganar la puja con el menor importe, sino en el análisis minucioso de la situación posesoria informada en los procesos. Operaciones donde existe un inquilino de renta antigua o un derecho de tanteo y retracto por parte de la administración exigen consideraciones estratégicas únicas. Para sortear el laberinto procesal del juzgado ejecutante, se requiere anticipar los movimientos tras la adjudicación definitiva judicial. Esto implica proyectar un colchón de tesorería para eventuales saneamientos administrativos o tributos afectos, convirtiendo cada operación en un ejercicio impecable de gestión e inteligencia inmobiliaria que el capital masivo sigue ignorando.`
    };

    const educationalBlocks = [
      {
        id: 'myth-reality',
        title: "💡 Mito vs Realidad: La verdad sobre el BOE",
        content: `Uno de los grandes mitos en ${provinceName} es que el banco siempre se queda con lo mejor. La realidad es mucho más interesante. Las entidades financieras a menudo prefieren recuperar la liquidez de forma inmediata que gestionar el activo. Esto deja un margen inmenso para que el postor particular se adjudique el inmueble por un precio muy competitivo. Otro error común es pensar que es imposible saber si hay okupas. Aunque no existe una visita oficial, una investigación de campo diligente en ${bestCity} suele revelar la situación real. Hablar con vecinos o porteros aporta información valiosa mucho antes de que se cierre la subasta. La información está ahí fuera. Solo hay que saber cómo recolectarla y validarla para reducir la incertidumbre al mínimo posible.`
      },
      {
        id: 'legal-safety',
        title: "⚖️ Seguridad Jurídica y Gestión de Plazos",
        content: `Muchos compradores potenciales en ${provinceName} temen la supuesta inseguridad del proceso judicial. Es importante recalcar que una adjudicación judicial es uno de los títulos de propiedad más firmes que existen. Viene avalado por un decreto de un Letrado de la Administración de Justicia. Este ordena la cancelación de todas las cargas posteriores. Lo que sí debe tenerse en cuenta son los plazos administrativos. Desde que ganas la subasta hasta que tienes las llaves, pueden transcurrir varios meses. El tiempo depende de la carga de trabajo del juzgado específico en ${provinceName}. La paciencia no es solo una virtud, sino el precio que pagas a cambio del descuento masivo que obtienes respecto al mercado libre.`
      },
      {
        id: 'financing',
        title: "💰 El reto de la liquidez y la financiación",
        content: `A diferencia de una compra convencional en ${provinceName}, en las subastas necesitas capital disponible de forma ágil. Para empezar, debes depositar el 5% del valor de tasación para participar. Si ganas, tendrás un plazo de 40 días hábiles para consignar el resto del precio. Conseguir una hipoteca para una subasta en ${bestCity} es perfectamente posible. Requiere una gestión previa muy fina con entidades que comprendan el proceso judicial. La tasación hipotecaria definitiva se realiza una vez que tienes el testimonio del decreto de adjudicación. Por esta razón, las subastas en ${provinceName} premian a quien cuenta con liquidez inmediata. Permiten capturar oportunidades que otros pierden por falta de agilidad financiera.`
      }
    ];

    const middleBlocks = [
      { 
        id: 'analysis',
        title: "🔍 Análisis técnico y saneamiento de cargas", 
        content: `Al observar los ${total} activos disponibles en ${provinceName}, vemos patrones que el ojo no entrenado pasa por alto. Los inmuebles de tipo ${bestType} suelen presentar expedientes más estandarizados. Sin embargo, requieren una verificación exhaustiva de las cuotas de comunidad e IBI pendiente. En España, estas deudas tienen una afección real sobre el inmueble. El nuevo propietario en ${provinceName} deberá hacerse cargo de los años corriente y los tres anteriores. En municipios como ${bestCity}, las tasaciones judiciales a menudo están desactualizadas. No reflejan la subida reciente de precios de la zona. Esto hace que el precio de salida sea todavía más atractivo de lo que indican las cifras oficiales del BOE.` 
      },
      { 
        id: 'strategy',
        title: "🛠️ Estrategia de puja y psicología del postor", 
        content: `No pujes nunca por impulso. En ${provinceName}, la estrategia ganadora es puramente matemática. Consiste en fijar un precio máximo basado en el valor real de mercado actual menos un 30% de margen de seguridad. Este margen debe cubrir gastos, impuestos e imprevistos. Si la subasta en ${bestCity} supera ese límite, lo más inteligente es retirarse. Hay ${total} oportunidades más en el horizonte. La disciplina férrea separa al inversor que construye patrimonio del que compra un problema. Recuerda que en ${provinceName} cada juzgado tiene sus ritmos. Entender la idiosincrasia de la oficina judicial local puede darte una ventaja competitiva determinante.` 
      },
      { 
        id: 'occupancy',
        title: "🏠 El factor determinante de la posesión", 
        content: `La gran pregunta sobre ${provinceName} es cómo saber si la casa está vacía. El edicto de subasta suele mencionar si el inmueble está ocupado o si se desconoce la situación. Si en ${bestCity} confirmas que el activo está vacío, el valor de tu inversión se dispara tras la adjudicación. Por el contrario, si hay inquilinos con un contrato legal anterior a la hipoteca, deberás respetar sus derechos. Esto no tiene por qué ser negativo. Puede ser la base de una inversión de rentabilidad por alquiler inmediata en ${provinceName}. Te ahorras la búsqueda de nuevos arrendatarios y posibles reformas profundas.` 
      },
      { 
        id: 'taxes',
        title: "💸 Impuestos y gastos post-subasta",
        content: `Mucha gente olvida que el precio de adjudicación en ${provinceName} no es el coste final. Debes sumar el Impuesto de Transmisiones Patrimoniales (ITP). Esta comunidad tiene sus propios tipos y bonificaciones según el perfil del comprador. También están los gastos de registro y posibles honorarios legales. Al analizar las ${total} subastas de ${provinceName}, recomendamos reservar entre un 10% y un 15% adicional. En ${bestCity}, una planificación fiscal adecuada puede ahorrarte miles de euros. Es especialmente útil si puedes acogerte a tipos reducidos por vivienda habitual.`
      }
    ];

    const contextBlock = {
      id: 'province-context',
      title: `📍 El panorama inmobiliario en ${provinceName}`,
      content: `Entender el mercado de subastas en ${provinceName} requiere mirar más allá de los números. La provincia vive un momento de transformación. Zonas consolidadas como ${bestCity} conviven con municipios en expansión. Estos últimos ofrecen rentabilidades por alquiler muy interesantes. Las subastas judiciales actúan como un termómetro de la salud financiera de la región. El hecho de que existan ${total} expedientes activos indica un flujo constante de activos. Para un comprador en ${provinceName}, esto significa no depender de la voluntad de un vendedor particular. Es un proceso reglado donde el mercado dicta el valor final de forma transparente.`
    };

    const methodologyBlock = {
      id: 'methodology',
      title: "📋 Nuestra metodología de análisis",
      content: `En Activos Off-Market no nos limitamos a listar subastas. Nuestra metodología en ${provinceName} se basa en tres pilares: validación de deuda, comprobación de cargas y estimación de valor real. De los ${total} activos que ves hoy, solo una pequeña fracción cumple nuestros estándares. Al analizar un ${bestType} en ${bestCity}, cruzamos datos de transacciones recientes y ofertas activas. Nos aseguramos de que el descuento es real y no una ilusión por una tasación inflada. La transparencia es nuestra divisa en ${provinceName}. El rigor técnico es nuestra herramienta de trabajo diaria para encontrar valor real.`
    };

    const selectedMiddle = shuffleArray(middleBlocks, random).slice(0, 3);
    const selectedEdu = shuffleArray(educationalBlocks, random).slice(0, 1);
    
    const intro = leadVariants[selectedTheme as keyof typeof leadVariants] || leadVariants['OPPORTUNITY'];
    const imageTitle = pickRandom(imageTitleVariants, random);
    const discountText = maxDesc > 0 ? `Hasta ${maxDesc}% dto.` : 'Oportunidades';
    const selectedSources = [
      { label: 'Portal de Subastas BOE', url: 'https://subastas.boe.es/' },
      { label: `Juzgados de ${provinceName}`, url: '#' }
    ];

    // Narrative order:
    // 1. Hook (Intro)
    // 2. Market Context (contextBlock)
    // 3. Educational Block (selectedEdu[0])
    // 4. Relevant Data (methodologyBlock)
    // 5. Auction Card (Handled in JSX)
    // 6. Key Info (selectedMiddle)
    // 7. Conclusion
    const allSections = [
      contextBlock, 
      selectedEdu[0], 
      methodologyBlock, 
      ...selectedMiddle
    ];
    
    const conclusionVariants = [
      `En definitiva, ${provinceName} ofrece un ecosistema de subastas judiciales vibrante y lleno de matices. La clave para el éxito no es la suerte, sino el acceso a información técnica de calidad y la capacidad de actuar con rapidez cuando el radar detecta una anomalía de precio real.`,
      `Como hemos visto, el mercado de ${provinceName} tiene sus propias reglas. Participar en las subastas del BOE es una de las formas más inteligentes de construir patrimonio hoy en día, siempre que se haga bajo un prisma de seguridad jurídica y análisis de riesgos riguroso.`,
      `La oportunidad en ${provinceName} es clara, pero la ventana de tiempo es limitada. Con ${total} activos en juego, el momento de empezar a monitorizar el mercado es ahora, antes de que la competencia profesional sature los expedientes más rentables de la provincia.`,
      `No dejes que el miedo al proceso judicial te impida acceder a los precios de ${provinceName}. Con la formación adecuada y un enfoque metódico, las subastas judiciales pueden ser tu mejor herramienta para conseguir la vivienda que buscas a un precio imbatible.`,
      `El análisis de hoy en ${provinceName} confirma que el sector de las subastas sigue siendo el último refugio de las rentabilidades de dos dígitos. Mantenerse informado y ser disciplinado con los números es la única estrategia que garantiza resultados a largo plazo.`,
      `Concluimos nuestro repaso por ${provinceName} con una nota de optimismo: el sistema es más accesible que nunca. Si buscas valor real y estás dispuesto a hacer el trabajo de campo necesario, los juzgados de la provincia tienen mucho que ofrecerte este trimestre.`,
      `La transparencia del portal del BOE en ${provinceName} ha abierto puertas que antes estaban cerradas. Aprovechar estas ${total} oportunidades requiere visión, pero sobre todo, una ejecución impecable basada en datos reales y no en suposiciones.`,
      `Si tu objetivo es la inversión inmobiliaria en ${provinceName}, las subastas judiciales deben estar en tu radar. El descuento medio detectado justifica con creces el esfuerzo de aprendizaje y la gestión de los tiempos judiciales que conlleva el proceso.`,
      `Finalizamos este análisis recordando que en ${provinceName} el conocimiento es poder. Cuanto más profundo sea tu análisis técnico de las cargas y la posesión, menor será tu riesgo y mayor tu beneficio potencial en el mercado de subastas.`,
      `El mercado de ${provinceName} no espera a nadie. Con una oferta de ${total} activos, la diversificación y el análisis comparativo de mercado son tus mejores aliados para identificar la verdadera oportunidad entre el ruido de los edictos judiciales.`
    ];

    const conclusion = pickRandom(conclusionVariants, random);

    const title = `Subastas en ${provinceName}: oportunidades activas | BOE`;
    const meta = `Subastas activas en ${provinceName}. Viviendas y activos judiciales con descuento.`;

    return {
      title,
      meta,
      intro,
      sections: allSections,
      conclusion,
      imageTitle,
      sources: selectedSources,
      cta: `Ver oportunidades en ${provinceName}`,
      image: dynamicImage,
      discountText
    };
  }, [provinceName, stats, featuredAuction]);

  const jsonLd = useMemo(() => {
    if (!provinceName || !content) return null;
    
    const now = new Date();
    let latestDate = topExamples[0]?.data.lastCheckedAt ? new Date(topExamples[0].data.lastCheckedAt) : now;
    if (latestDate > now) latestDate = now;
    
    let publishedDate = topExamples[0]?.data.publishedAt ? new Date(topExamples[0].data.publishedAt) : now;
    if (publishedDate > now) publishedDate = now;
    
    return {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "headline": content.title,
      "description": content.meta,
      "image": [content.image],
      "datePublished": publishedDate.toISOString().split('T')[0],
      "dateModified": latestDate.toISOString().split('T')[0],
      "author": [{
        "@type": "Organization",
        "name": "Equipo Activos Off-Market",
        "url": "https://activosoffmarket.es"
      }],
      "publisher": {
        "@type": "Organization",
        "name": "Activos Off-Market",
        "logo": {
          "@type": "ImageObject",
          "url": "https://activosoffmarket.es/logo.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      },
      "isHighQualityProvinceArticle": isHighQuality
    };
  }, [provinceName, content, topExamples, isHighQuality]);

  const formattedDate = useMemo(() => {
    const now = new Date();
    let date = topExamples[0]?.data.lastCheckedAt ? new Date(topExamples[0].data.lastCheckedAt) : now;
    if (date > now) date = now;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  }, [topExamples]);
  
  const updateText = useMemo(() => {
    const now = new Date();
    let date = topExamples[0]?.data.lastCheckedAt ? new Date(topExamples[0].data.lastCheckedAt) : now;
    if (date > now) date = now;
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    return diffHours === 0 
      ? 'Publicado hoy'
      : diffHours < 24 && diffHours > 0
        ? `Actualizado hace ${diffHours} horas`
        : `Última actualización: ${formattedDate}`;
  }, [topExamples, formattedDate]);

  const topReports = useMemo(() => {
    return Object.entries(DISCOVER_REPORTS)
      .slice(0, 3)
      .map(([slug, report]) => ({ slug, ...report }));
  }, []);

  useEffect(() => {
    if (provinceName) {
      document.title = `${content.title} | Activos Off-Market`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', content.meta);
      }
      
      // SEO Quality Control
      let robotsMeta = document.querySelector('meta[name="robots"]');
      if (!robotsMeta) {
        robotsMeta = document.createElement('meta');
        robotsMeta.setAttribute('name', 'robots');
        document.head.appendChild(robotsMeta);
      }
      
      if (!isHighQuality) {
        robotsMeta.setAttribute('content', 'noindex, follow');
      } else {
        robotsMeta.setAttribute('content', 'index, follow');
      }
    }
    window.scrollTo(0, 0);
  }, [provinceName, content, isHighQuality]);

  const renderFormattedText = (text: string, type: 'intro' | 'body' | 'conclusion' = 'body') => {
    if (!text) return null;
    
    // Split by sentences
    const sentences = text.split(/(?<=[.!?])\s+/);
    
    const paragraphs = [];
    let currentParagraph: string[] = [];
    
    sentences.forEach((sentence) => {
      currentParagraph.push(sentence);
      // Group 1-2 sentences per paragraph for maximum "breathability"
      // 1 sentence if it's long (> 120 chars), or 2 if they are short
      const currentLength = currentParagraph.join(' ').length;
      if (currentParagraph.length >= 2 || currentLength > 120) {
        paragraphs.push(currentParagraph.join(' '));
        currentParagraph = [];
      }
    });
    
    if (currentParagraph.length > 0) {
      paragraphs.push(currentParagraph.join(' '));
    }
    
    return paragraphs.map((p, idx) => {
      let className = "mb-6 leading-relaxed text-left ";
      
      if (type === 'intro') {
        className += idx === 0 
          ? "lead text-xl text-slate-700 font-medium" 
          : "text-lg text-slate-600";
      } else if (type === 'conclusion') {
        className = "italic text-lg font-serif text-slate-700 border-l-4 border-brand-200 pl-6 py-2 mb-6";
      } else {
        className += "text-slate-600";
      }
      
      return <p key={idx} className={className}>{p}</p>;
    });
  };

  if (!province) return <Navigate to={ROUTES.HOME} replace />;

  return (
    <>
      <link rel="canonical" href={`https://activosoffmarket.es/noticias-subastas/provincia/${normalizedProvinceParam.replace(/\s+/g, '-')}`} />
      {content && <link rel="preload" as="image" href={content.image} />}
      
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
      
      <div className="flex-grow max-w-3xl mx-auto px-6 py-12 w-full">
        <nav className="flex items-center text-sm text-slate-500 mb-8 font-medium" aria-label="Breadcrumb">
          <Link to={ROUTES.HOME} className="hover:text-brand-600 transition-colors">Inicio</Link>
          <ChevronRight size={14} className="mx-2" />
          <Link to={ROUTES.NOTICIAS_SUBASTAS_INDEX} className="hover:text-brand-600 transition-colors">Noticias</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-brand-700 bg-brand-50 px-2 py-1 rounded-md capitalize">{provinceName}</span>
        </nav>

        <article className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-200">
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-4 text-sm mb-6">
              <div className="flex items-center gap-1.5 text-brand-700 bg-brand-50 px-3 py-1 rounded-full font-bold">
                <Calendar size={14} />
                <time dateTime={topExamples[0]?.data.lastCheckedAt || new Date().toISOString()}>
                  {updateText}
                </time>
              </div>
              {stats && stats.totalActive > 0 && (
                <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-bold border border-emerald-100">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  {stats.totalActive} activos detectados
                </div>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-slate-900 mb-8 leading-tight">
              {content.title}
            </h1>

            <ShareButtons 
              title={content.title} 
              className="mb-8 -mt-2" 
              province={provinceName}
              origin="discover"
            />

            {/* Imagen principal grande para Discover */}
            <figure className="mb-10 -mx-6 md:-mx-10 relative group">
              <img 
                src={content.image} 
                alt={`Subastas inmobiliarias en ${provinceName}`}
                className="w-full h-[300px] md:h-[450px] object-cover md:rounded-none"
                referrerPolicy="no-referrer"
                width="1200"
                height="675"
                fetchPriority="high"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-40"></div>
              <figcaption className="absolute bottom-6 left-6 md:left-10 text-white">
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold mb-1 opacity-80">Análisis de Mercado</p>
                <p className="text-lg md:text-xl font-serif italic">{content.imageTitle}</p>
              </figcaption>
            </figure>
            
            <div className="flex items-center gap-4 border-b border-slate-100 pb-8">
              <img 
                src="https://activosoffmarket.es/logo.png" 
                alt="Activos Off-Market" 
                className="w-12 h-12 rounded-full bg-slate-900 object-cover border-2 border-white shadow-sm"
                width="48"
                height="48"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=Activos+OffMarket&background=0f172a&color=fff';
                }}
              />
              <div>
                <p className="font-bold text-slate-900">Equipo Activos Off-Market</p>
                <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Especialistas en subastas judiciales</p>
              </div>
            </div>
          </header>

          <div className="prose prose-lg prose-slate text-left max-w-5xl space-y-6 leading-relaxed prose-p:max-w-3xl prose-headings:max-w-3xl prose-li:max-w-3xl">
            <div className="mb-4">
              {renderFormattedText(content.intro, 'intro')}
            </div>

            <div className="border-t border-slate-100 my-3" />

            {/* Tarjeta destacada arriba */}
            {featuredOpportunity && (
              <div className="mb-6 not-prose">
                <p className="text-xs mb-1 text-slate-500 font-medium">Oportunidad destacada en esta provincia</p>
                <div className="max-w-md">
                  {shouldGenerateDiscoverArticle(featuredOpportunity[1]) ? (
                    <DiscoverSingleAuctionArticle 
                      auction={featuredOpportunity[1]} 
                      slug={featuredOpportunity[0]} 
                      article={generateEditorialArticle(featuredOpportunity[0], featuredOpportunity[1])!}
                      imageUrl={getImageForPropertyType(featuredOpportunity[1].propertyType, featuredOpportunity[0])}
                    />
                  ) : (
                    <AuctionCard 
                      slug={featuredOpportunity[0]} 
                      data={featuredOpportunity[1]} 
                    />
                  )}
                </div>
              </div>
            )}

            <div className="border-t border-slate-100 my-3" />

            {/* Bloque resumen chips */}
            <div className="flex flex-nowrap overflow-x-auto pb-2 items-center gap-1 mb-6 not-prose scrollbar-hide">
              <div className="bg-slate-100 border border-slate-200 px-2 py-1 rounded-md flex items-center gap-1 whitespace-nowrap shrink-0">
                <span className="text-[11px]">📍</span>
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-tight">{provinceName}</span>
              </div>
              <div className="bg-brand-50 border border-brand-100 px-2 py-1 rounded-md flex items-center gap-1 whitespace-nowrap shrink-0">
                <span className="text-[11px]">🏠</span>
                <span className="text-[11px] font-bold text-brand-700 uppercase tracking-tight">
                  {featuredOpportunity ? normalizePropertyType(featuredOpportunity[1].propertyType) : 'Inmueble'}
                </span>
              </div>
              <div className="bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md flex items-center gap-1 whitespace-nowrap shrink-0">
                <span className="text-[11px]">📊</span>
                <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-tight">{stats?.totalActive || 0} subastas</span>
              </div>
              <div className="bg-amber-50 border border-amber-100 px-2 py-1 rounded-md flex items-center gap-1 whitespace-nowrap shrink-0">
                <span className="text-[11px]">💰</span>
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-tight">{content.discountText}</span>
              </div>
              <div className="bg-indigo-50 border border-indigo-100 px-2 py-1 rounded-md flex items-center gap-1 whitespace-nowrap shrink-0">
                <span className="text-[11px]">⏱</span>
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-tight">Actualizadas</span>
              </div>
            </div>

            {/* Gráfico de mercado compacto */}
            <div className="mb-6 bg-slate-50 rounded-xl p-4 border border-slate-100 not-prose">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-1">
                    <span>Descuento medio</span>
                    <span className="text-brand-600">{content.discountText}</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-500 w-[75%] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-1">
                    <span>Subastas activas</span>
                    <span className="text-emerald-600">{stats?.totalActive || 0}</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 w-[60%] rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase mb-1">
                    <span>% Viviendas</span>
                    <span className="text-amber-600">{housingPercentage}%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 w-[85%] rounded-full" style={{ width: `${housingPercentage}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 my-3" />
            
            <div className="space-y-6 text-slate-600 leading-relaxed text-left">
              {content.sections.map((section: { id: string; title: string; content: string }, idx: number) => (
                <div key={section.id} className="animate-fade-in">
                  <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-2">
                    {section.title}
                  </h2>
                  {renderFormattedText(section.content, 'body')}
                </div>
              ))}

              <div className="bg-brand-50/50 rounded-2xl p-6 border border-brand-100 not-prose">
                <h3 className="text-sm font-bold text-brand-900 uppercase tracking-wider mb-4">Fuentes y referencias</h3>
                <div className="flex flex-wrap gap-4">
                  {content.sources.map((source: { label: string; url: string }, idx: number) => (
                    <a 
                      key={idx}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-brand-700 hover:text-brand-800 underline underline-offset-4 decoration-brand-200"
                    >
                      {source.label}
                    </a>
                  ))}
                </div>
              </div>

              <div className="animate-fade-in">
                {renderFormattedText(content.conclusion, 'conclusion')}
              </div>
            </div>

            <div className="my-8 not-prose">
              <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-brand-50 rounded-full -mr-10 -mt-10 opacity-40"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Star size={10} className="text-brand-600 fill-brand-600" />
                      <span className="text-[9px] font-bold text-brand-600 uppercase tracking-widest">Alertas Premium</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      ¿Quieres recibir alertas en {provinceName}?
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Te avisamos por WhatsApp antes que a nadie.
                    </p>
                  </div>

                  <div className="flex flex-col items-center md:items-end gap-1">
                    <Link 
                      to={ROUTES.ALERTAS}
                      className="bg-slate-900 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-slate-800 transition-all text-xs whitespace-nowrap"
                    >
                      PROBAR 7 DÍAS GRATIS
                    </Link>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">Después 5€/mes · Cancela en 1 clic</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Últimas subastas adjudicadas */}
            {recentlyAdjudicated.length > 0 && (
              <div className="my-10 not-prose bg-emerald-50/30 border border-emerald-100 rounded-3xl p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                    <Star size={20} className="fill-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-emerald-900">Últimas subastas adjudicadas</h3>
                    <p className="text-xs text-emerald-700 font-medium">Resultados reales detectados en {provinceName}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {recentlyAdjudicated.map(([id, data]) => (
                    <Link 
                      key={id} 
                      to={ROUTES.NOTICIAS_SUBASTAS_RESULT.replace(':slug', id)}
                      className="bg-white border border-emerald-100 rounded-xl p-4 hover:shadow-md transition-all group"
                    >
                      <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Adjudicada</p>
                      <h4 className="text-sm font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
                        {normalizePropertyType(data.propertyType)} en {data.city || data.province}
                      </h4>
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-50">
                        <span className="text-xs font-bold text-emerald-700">{data.finalPrice?.toLocaleString('es-ES')} €</span>
                        <ArrowRight size={12} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Guías y análisis sobre subastas */}
            {topReports.length > 0 && (
              <div className="my-10 not-prose bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-brand-100 p-2 rounded-lg text-brand-600">
                    <Zap size={20} className="fill-brand-500 text-brand-500" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-slate-900">Guías y análisis sobre subastas</h3>
                    <p className="text-xs text-slate-500 font-medium">Descubre cómo invertir con seguridad</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {topReports.map((report) => (
                    <Link 
                      key={report.slug} 
                      to={`/analisis/${report.slug}`}
                      className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md hover:border-brand-300 transition-all group flex flex-col h-full"
                    >
                      <div className="w-full h-24 mb-3 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                        <img 
                          src={report.image} 
                          alt={report.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
                        {report.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-grow">
                        {report.intro}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-brand-600 uppercase tracking-widest mt-auto pt-3 border-t border-slate-50">
                        Leer análisis <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Casos reales analizados */}
            {topExamples.length > 0 && (
              <div className="my-10 not-prose bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                  <div className="bg-brand-100 p-2 rounded-lg text-brand-600">
                    <TrendingUp size={20} className="text-brand-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-slate-900">Casos reales analizados en {provinceName}</h3>
                    <p className="text-xs text-slate-500 font-medium">Extraídos del BOE y revisados técnicamente</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {topExamples.filter(example => example.id !== featuredOpportunity?.[0]).map((example) => {
                    const isNews = shouldGenerateDiscoverArticle(example.data);
                    if (isNews) {
                      const articleInfo = generateEditorialArticle(example.id, example.data);
                      if (articleInfo) {
                        return (
                          <div key={example.id} className="h-full">
                            <DiscoverSingleAuctionArticle 
                              auction={example.data} 
                              slug={example.id} 
                              article={articleInfo}
                              imageUrl={getImageForPropertyType(example.data.propertyType, example.id)}
                            />
                          </div>
                        );
                      }
                    }
                    return (
                      <div key={example.id} className="h-full">
                        <AuctionCard slug={example.id} data={example.data} />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="border-t border-slate-100 my-3" />

            {/* Resumen técnico para E-E-A-T */}
            <div className="bg-slate-50 rounded-2xl p-6 mb-10 border border-slate-200 not-prose grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Oportunidades</p>
                <p className="text-2xl font-bold text-slate-900">{stats?.totalActive || 0}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Ahorro Máximo</p>
                <p className="text-2xl font-bold text-brand-600">{content.discountText}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Activo Top</p>
                <p className="text-sm font-bold text-slate-900 capitalize leading-tight">
                  {featuredAuction ? normalizePropertyType(featuredAuction[1].propertyType) : 'Inmueble'}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Ubicación</p>
                <p className="text-sm font-bold text-slate-900 truncate leading-tight">
                  {featuredAuction?.[1].city || provinceName}
                </p>
              </div>
            </div>

            <div className="my-8 flex flex-col sm:flex-row gap-4 w-full border-t border-slate-200 pt-8">
              <Link 
                to={featuredAuction ? `/subasta/${featuredAuction[0]}` : `/subastas/${provinceName.toLowerCase().replace(/\s+/g, '-')}`} className="flex-1 inline-flex items-center justify-center gap-2 bg-brand-600 text-white font-bold px-8 py-2 rounded-md hover:bg-brand-700 transition-colors shadow-sm text-center text-sm"
              >
                Ver análisis técnico <ArrowRight size={16} />
              </Link>
              <Link 
                to={`/subastas/${provinceName.toLowerCase().replace(/\s+/g, '-')}`} className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-700 font-bold px-8 py-2 rounded-md hover:bg-slate-200 transition-colors text-center text-sm"
              >
                Más subastas
              </Link>
            </div>
          </div>
        </article>
      </div>
    </>
  );
};

export default DiscoverProvinceArticle;
