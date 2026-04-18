import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Link, useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";
import { ShieldAlert, UploadCloud, FileText, CheckCircle, AlertTriangle, Lock, Loader2, ArrowRight, ShieldCheck, FileWarning, Download, Info, Calculator, Calendar, Scale, ExternalLink, X, HelpCircle, FileSearch, LogIn, TrendingUp, Check, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../contexts/UserContext';

interface CargaDetectada {
  identificador_registral: string;
  tipo: string;
  fuente_textual: string;
  desglose: {
    principal: number;
    intereses: number;
    costas: number;
    total: number;
  };
  titular: string;
  rango: string;
  resultado: string;
  estado_carga: string;
  vigente: boolean;
  confianza: string;
}

interface AnalysisResult {
  razonamiento_juridico: string;
  fuente_documento: string;
  nivel_confianza_global: string;
  riesgo_global: 'BAJO' | 'MEDIO' | 'ALTO' | string;
  cargas_detectadas: CargaDetectada[];
  incoherencias_detectadas: string[];
  ocupacion_detectada: boolean;
  nivel_riesgo_ocupacion: string;
  peor_escenario: {
    principal: number;
    intereses: number;
    costas: number;
    total: number;
    importe_total?: number; // Alias for total as requested by user
  };
  impacto_economico: {
    coste_estimado: number;
    nivel: string;
  };
  alertas: string[];
  recomendacion: string;
  // Datos de mercado opcionales
  refCat?: string | null;
  ciudad?: string | null;
  codigo_postal?: string | null;
  superficie_m2?: number | null;
  valor_subasta?: number | null;
  valor_tasacion?: number | null;
  tipo_inmueble?: string | null;
  yearBuilt?: number | null;
  floor?: string | null;
  marketDataReady?: boolean;
}

interface LoadAnalysisBlockProps {
  boeId: string;
  boeUrl?: string;
  isIntegrated?: boolean;
  onShowSoftGate?: () => void;
  initialStep?: 'locked' | 'upload' | 'loading' | 'result';
  isPaid?: boolean;
  initialData?: AnalysisResult | null;
  noMargin?: boolean;
  analysisType?: 'cargas' | 'completo';
  auctionId?: string;
  surface?: number | null;
  marketPriceM2?: number;
  appraisalValue?: number | null;
  city?: string;
  propertyType?: string;
  isStandalone?: boolean;
}

const LoadAnalysisBlock: React.FC<LoadAnalysisBlockProps> = ({ 
  boeId, 
  boeUrl, 
  isIntegrated = false,
  onShowSoftGate,
  initialStep = 'locked',
  isPaid = false,
  initialData = null,
  noMargin = false,
  analysisType = 'cargas',
  auctionId,
  surface,
  marketPriceM2,
  appraisalValue,
  city,
  propertyType,
  isStandalone = false
}) => {
  const [step, setStep] = useState<'locked' | 'upload' | 'loading' | 'result'>(initialData ? 'result' : initialStep);

  // Update step if initialStep changes (e.g. user logs in or pays)
  useEffect(() => {
    if (step === 'locked' && initialStep === 'upload') {
      setStep('upload');
    } else if (step === 'upload' && initialStep === 'locked') {
      setStep('locked');
    }
  }, [initialStep, step]);

  const [files, setFiles] = useState<File[]>([]);
  const [resultData, setResultData] = useState<AnalysisResult | null>(initialData);
  
  const session_id = boeId; // alias explicitly
  
  useEffect(() => {
    console.log("RESET STATE FOR SESSION:", session_id);
    setResultData(null);
  }, [session_id]);

  const safeResult = resultData ? {
    ...resultData,
    cargas_detectadas: resultData.cargas_detectadas || [],
    incoherencias_detectadas: resultData.incoherencias_detectadas || [],
    alertas: resultData.alertas || [],
    peor_escenario: {
      ...resultData.peor_escenario,
      total: resultData.peor_escenario?.total ?? 0,
      importe_total: resultData.peor_escenario?.importe_total ?? 0,
    },
    impacto_economico: {
      ...resultData.impacto_economico,
      nivel: resultData.impacto_economico?.nivel || "DESCONOCIDO",
    },
    nivel_confianza_global: resultData.nivel_confianza_global || "DESCONOCIDO",
    riesgo_global: resultData.riesgo_global || "DESCONOCIDO",
    fuente_documento: resultData.fuente_documento || "Desconocida",
  } : null;

  if (resultData) {
    console.log("2. STATE resultData:", resultData);
    console.log("3. SAFE RESULT:", safeResult);
    console.log("4. UI cargas:", safeResult?.cargas_detectadas);
  }

  const recomendacionText = safeResult?.recomendacion
    ? typeof safeResult.recomendacion === "string"
      ? safeResult.recomendacion
      : `
${(safeResult.recomendacion as any).resumen_claro || ""}

${(safeResult.recomendacion as any).deuda_del_procedimiento || ""}

${(safeResult.recomendacion as any).que_paga_el_comprador || ""}
`.trim()
    : "";

  const [showHowToModal, setShowHowToModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Salvaguarda: Si falta alguno de estos datos, NO calcular nada financiero, 
  // NO mostrar ROI, NO mostrar valor mercado, NO mostrar estimaciones.
  // Solo permitir análisis jurídico existente.
  const canCalculateFinancials = Boolean(surface && marketPriceM2 && appraisalValue);

  useEffect(() => {
    if (showHowToModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showHowToModal]);

  const userContext = useUser();
  const user = userContext?.user;
  const currentPlan = userContext?.plan;
  const incrementAnalysisCount = userContext?.incrementAnalysisCount;
  const navigate = useNavigate();

  // Redirect to dedicated page when analysis is done in integrated mode
  useEffect(() => {
    if (isIntegrated && step === 'result' && safeResult) {
      console.log('🔍 [DIAGNOSTIC] LoadAnalysisBlock boeId value:', boeId);
      console.log('🔍 [DIAGNOSTIC] LoadAnalysisBlock boeId type:', typeof boeId);
      
      // Save to session storage to prevent data loss on reload
      try {
        sessionStorage.setItem(`analysisResult_${boeId}`, JSON.stringify(safeResult));
      } catch (e) {
        console.error('🔍 [DIAGNOSTIC] Crash at line 105 (sessionStorage):', e);
      }
      
      try {
        navigate(`/analisis-cargas?id=${boeId}&report=ready`, { 
          state: { analysisResult: safeResult } 
        });
      } catch (e) {
        console.error('🔍 [DIAGNOSTIC] Crash at line 107 (navigate):', e);
      }
    }
  }, [step, safeResult, isIntegrated, navigate, boeId]);
  
  const usage = user?.analysisUsed || 0;

  const planLimit = currentPlan === 'free' ? 1 : currentPlan === 'basic' ? 3 : 5;

  const isBlocked = !isPaid && usage >= planLimit;

  const getCounterText = () => {
    if (isPaid) return 'Análisis desbloqueado';
    if (currentPlan === 'free') {
      return usage >= 1 ? 'Sin análisis disponibles' : '1 análisis gratis disponible';
    }
    if (currentPlan === 'basic') {
      const remaining = Math.max(0, planLimit - usage);
      return remaining === 0 ? 'Sin análisis disponibles' : `${remaining} de ${planLimit} restantes`;
    }
    const remaining = Math.max(0, planLimit - usage);
    return remaining === 0 ? 'Sin análisis disponibles' : `${remaining} de ${planLimit} restantes`;
  };

  const getResetDateText = () => {
    if (!user?.lastAnalysisReset) return null;
    
    try {
      const resetDate = user.lastAnalysisReset.toDate ? user.lastAnalysisReset.toDate() : new Date(user.lastAnalysisReset);
      const nextReset = new Date(resetDate);
      nextReset.setMonth(nextReset.getMonth() + 1);
      
      return `Se reinician el ${nextReset.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}`;
    } catch (e) {
      return null;
    }
  };

  const getCounterVisuals = (): {
    text: string;
    subtext?: string;
    action?: { text: string; to: string };
    bgClass: string;
    textClass: string;
    borderClass: string;
    icon: JSX.Element;
  } => {
    if (isPaid) {
      return {
        text: 'Análisis desbloqueado',
        subtext: 'Pago confirmado',
        bgClass: 'bg-emerald-50',
        textClass: 'text-emerald-700',
        borderClass: 'border-emerald-200',
        icon: <CheckCircle size={14} className="text-emerald-600" />
      };
    }

    const resetText = getResetDateText();

    if (currentPlan === 'pro') {
      const remaining = Math.max(0, 5 - usage);
      if (remaining === 0) {
        return {
          text: 'Has alcanzado el límite mensual',
          subtext: resetText || 'Has agotado tus 5 análisis de este mes',
          bgClass: 'bg-red-50',
          textClass: 'text-red-700',
          borderClass: 'border-red-200',
          icon: <AlertTriangle size={14} className="text-red-600" />
        };
      }
      return {
        text: `Te quedan ${remaining} análisis este mes`,
        subtext: resetText || undefined,
        bgClass: 'bg-slate-50',
        textClass: 'text-slate-700',
        borderClass: 'border-slate-200',
        icon: <CheckCircle size={14} className="text-emerald-500" />
      };
    }
    
    if (currentPlan === 'basic') {
      const remaining = Math.max(0, 3 - usage);
      if (remaining === 0) {
        return {
          text: 'Has alcanzado el límite mensual',
          subtext: resetText || 'Upgrade para continuar',
          action: resetText ? undefined : { text: 'Ver planes', to: '/pro' },
          bgClass: 'bg-red-50',
          textClass: 'text-red-700',
          borderClass: 'border-red-200',
          icon: <AlertTriangle size={14} className="text-red-600" />
        };
      }
      return {
        text: `Te quedan ${remaining} análisis este mes`,
        subtext: resetText || undefined,
        bgClass: 'bg-slate-50',
        textClass: 'text-slate-700',
        borderClass: 'border-slate-200',
        icon: <Info size={14} className="text-slate-500" />
      };
    }
    
    // FREE
    if (usage >= 1) {
      return {
        text: 'Has alcanzado el límite mensual',
        subtext: resetText || 'Upgrade para continuar',
        action: resetText ? undefined : { text: 'Ver planes', to: '/pro' },
        bgClass: 'bg-red-50',
        textClass: 'text-red-700',
        borderClass: 'border-red-200',
        icon: <Lock size={14} className="text-red-600" />
      };
    }
    return {
      text: 'Te queda 1 análisis gratis',
      subtext: resetText || 'Ideal para esta subasta',
      bgClass: 'bg-amber-50',
      textClass: 'text-amber-700',
      borderClass: 'border-amber-200',
      icon: <Info size={14} className="text-amber-600" />
    };
  };

  const finalBoeUrl = boeUrl || `https://subastas.boe.es/detalle_subasta.php?idSub=${boeId}`;

  const [showSticky, setShowSticky] = useState(false);
  const [boeClicked, setBoeClicked] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!blockRef.current || isIntegrated) {
        setShowSticky(false);
        return;
      }
      
      const rect = blockRef.current.getBoundingClientRect();
      // Visible only when the block is NOT in the viewport
      const isOutOfViewport = rect.bottom < 0 || rect.top > window.innerHeight;
      const hasScrolled = window.scrollY > 50;
      
      const shouldShow = isOutOfViewport && 
                         hasScrolled && 
                         window.innerWidth < 768 && 
                         (step === 'locked' || step === 'upload') && 
                         !showHowToModal;
      
      setShowSticky(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [step, showHowToModal]);

  const handleUnlock = () => {
    if (!user || isBlocked) {
      if (onShowSoftGate) {
        onShowSoftGate();
      } else {
        navigate('/login');
      }
      return;
    }

    setStep('upload');
    setTimeout(() => {
      blockRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 20;

    const addFooter = (pdf: typeof doc) => {
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(150);
        pdf.setDrawColor(230);
        pdf.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);
        pdf.text("Activos Off-Market · Análisis profesional de subastas", 10, pageHeight - 10);
        pdf.text("www.activosoffmarket.es", pageWidth - 10, pageHeight - 10, { align: "right" });
      }
    };

    const checkPageBreak = (neededHeight: number) => {
      if (y + neededHeight > pageHeight - 25) {
        doc.addPage();
        y = 20;
      }
    };

    const cleanText = (text: string | undefined | null): string => {
      if (!text) return "";
      return text
        .replace(/#+\s?/g, "")        // elimina ###
        .replace(/\*\*/g, "")         // elimina **
        .replace(/\*/g, "")           // elimina *
        .replace(/Ø|Ý|à|Ü|°|þ/g, "")  // limpia caracteres corruptos comunes
        .replace(/\n\s*\n/g, "\n")    // limpia saltos dobles
        .trim();
    };

    const formatCurrencyPDF = (value: number | undefined | null): string => {
      if (!value) return "0 EUR";
      return `${Math.round(value).toLocaleString("es-ES")} EUR`;
    };

    // --- CONFIGURACIÓN VISUAL ---
    const colors = {
      primary: [15, 23, 42],    // Slate 900
      secondary: [71, 85, 105], // Slate 600
      accent: [2, 132, 199],    // Sky 600
      bg: [248, 250, 252],      // Slate 50
      border: [226, 232, 240],  // Slate 200
      white: [255, 255, 255]
    };

    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);

    const drawHeader = (pdf: typeof doc, title: string) => {
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      pdf.text(title, margin, y);
      y += 6;
      pdf.setDrawColor(colors.accent[0], colors.accent[1], colors.accent[2]);
      pdf.setLineWidth(0.8);
      pdf.line(margin, y, margin + 20, y);
      y += 10;
    };

    const drawSectionBox = (pdf: typeof doc, title: string, content: string[], bgColor: number[] = colors.bg) => {
      const boxPadding = 8;
      const lineHeight = 6;
      const boxHeight = (content.length * lineHeight) + (boxPadding * 2) + 10;
      
      checkPageBreak(boxHeight + 10);
      
      // Fondo
      pdf.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
      pdf.roundedRect(margin, y, contentWidth, boxHeight, 3, 3, "F");
      
      let boxY = y + boxPadding + 4;
      
      // Título del bloque
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      pdf.text(title.toUpperCase(), margin + boxPadding, boxY);
      boxY += 8;
      
      // Contenido
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      
      content.forEach(line => {
        pdf.text(line, margin + boxPadding, boxY);
        boxY += lineHeight;
      });
      
      y += boxHeight + 10;
    };

    // --- PORTADA ---
    // Fondo decorativo lateral
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, 5, pageHeight, "F");

    y = 40;
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text("DOSSIER DE", margin, y);
    y += 12;
    doc.text("ANÁLISIS JURÍDICO", margin, y);
    
    y += 15;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.text("Informe profesional de cargas y riesgos de subasta", margin, y);

    y += 30;
    // Bloque de datos rápidos en portada
    doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 15;

    const dateStr = new Date().toLocaleDateString('es-ES', { 
      year: 'numeric', month: 'long', day: 'numeric'
    });

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("IDENTIFICADOR:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(boeId || "N/A", margin + 40, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("FECHA INFORME:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(dateStr, margin + 40, y);
    y += 8;

    doc.setFont("helvetica", "bold");
    doc.text("RIESGO GLOBAL:", margin, y);
    doc.setFont("helvetica", "bold");
    const riskColor = safeResult?.riesgo_global === 'ALTO' ? [185, 28, 28] : safeResult?.riesgo_global === 'MEDIO' ? [180, 83, 9] : [21, 128, 61];
    doc.setTextColor(riskColor[0], riskColor[1], riskColor[2]);
    doc.text(safeResult?.riesgo_global || "PENDIENTE", margin + 40, y);
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    y += 20;

    // Resumen económico rápido en portada
    const importeCargas = safeResult?.peor_escenario?.importe_total ?? safeResult?.peor_escenario?.total ?? 0;
    const totalCost = (appraisalValue || 0) + importeCargas;

    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.roundedRect(margin, y, contentWidth, 35, 2, 2, "F");
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text("ESTIMACIÓN DE COSTE TOTAL (PUJA + CARGAS)", margin + 10, y + 12);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(appraisalValue ? formatCurrencyPDF(totalCost) : "PUJA + " + formatCurrencyPDF(importeCargas), margin + 10, y + 25);
    
    y += 45;

    // --- BLOQUE: VEREDICTO DE INVERSIÓN ---
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text("VEREDICTO DE INVERSIÓN:", margin, y);
    y += 10;

    let veredictoText = "";
    let veredictoColor = [15, 23, 42];

    if (safeResult?.riesgo_global === 'ALTO') {
      veredictoText = "X ALTO RIESGO JURÍDICO";
      veredictoColor = [185, 28, 28]; // Rojo
    } else if (safeResult?.riesgo_global === 'MEDIO' || importeCargas > 0) {
      veredictoText = "! REVISAR EN DETALLE";
      veredictoColor = [180, 83, 9]; // Ámbar
    } else {
      veredictoText = "V OPERACIÓN LIMPIA (SIN CARGAS)";
      veredictoColor = [21, 128, 61]; // Verde
    }

    doc.setFillColor(veredictoColor[0], veredictoColor[1], veredictoColor[2], 0.1);
    doc.setDrawColor(veredictoColor[0], veredictoColor[1], veredictoColor[2]);
    doc.roundedRect(margin, y, contentWidth, 20, 1, 1, "FD");
    
    doc.setTextColor(veredictoColor[0], veredictoColor[1], veredictoColor[2]);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(veredictoText, margin + 10, y + 13);

    y = pageHeight - 40;
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    doc.text("Este documento contiene información técnica procesada mediante inteligencia", margin, y);
    doc.text("artificial y revisión jurídica. Consulte siempre con un profesional.", margin, y + 5);

    // --- PÁGINA 2: CONTENIDO ---
    doc.addPage();
    // Fondo decorativo lateral
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, 5, pageHeight, "F");
    y = 25;

    // Sección: Resumen claro
    if (recomendacionText) {
      drawHeader(doc, "Decisión rápida");
      const cleanedRec = cleanText(recomendacionText);
      const recLines = doc.splitTextToSize(cleanedRec, contentWidth - 10);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      
      recLines.forEach((line: string) => {
        checkPageBreak(6);
        doc.text(line, margin, y);
        y += 6;
      });
      y += 10;
    }

    // Sección: Qué pagarías realmente
    if (safeResult?.peor_escenario) {
      const infoLines = [];
      if (!importeCargas) {
        infoLines.push("- Solo pagas el importe de tu puja adjudicada.");
        infoLines.push("- No existen cargas preferentes que subsistan tras la subasta.");
        infoLines.push("- La deuda que motiva la subasta se cancela con el remate.");
      } else {
        infoLines.push(`- Cargas que subsisten: ${formatCurrencyPDF(importeCargas)}`);
        infoLines.push("- Estas cargas deben ser liquidadas por el adjudicatario.");
        if (appraisalValue) {
          infoLines.push(`- Coste total estimado (Puja + Cargas): ${formatCurrencyPDF(totalCost)}`);
        }
      }
      
      drawSectionBox(doc, "Impacto económico real", infoLines, [240, 253, 244]); // Emerald 50
    }

    // Sección: Análisis jurídico
    if (safeResult?.razonamiento_juridico) {
      drawHeader(doc, "Análisis Jurídico Detallado");
      const cleanedReasoning = cleanText(safeResult.razonamiento_juridico);
      const textLines = doc.splitTextToSize(cleanedReasoning, contentWidth);
      
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
      
      for (let i = 0; i < textLines.length; i++) {
        checkPageBreak(6);
        doc.text(textLines[i], margin, y);
        y += 5.5;
      }
      y += 15;
    }

    // Límite de responsabilidad
    checkPageBreak(35);
    doc.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
    doc.setFillColor(252, 252, 253);
    doc.roundedRect(margin, y, contentWidth, 25, 2, 2, "FD");
    
    y += 8;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.text("AVISO LEGAL Y RESPONSABILIDAD", margin + 5, y);
    y += 6;
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(colors.secondary[0], colors.secondary[1], colors.secondary[2]);
    const disclaimer = "Este informe es una herramienta de apoyo basada en el análisis de documentos aportados. No constituye asesoramiento legal vinculante. Activos Off-Market no se hace responsable de decisiones de inversión basadas exclusivamente en este informe.";
    const disclaimerLines = doc.splitTextToSize(disclaimer, contentWidth - 10);
    disclaimerLines.forEach((line: string) => {
      doc.text(line, margin + 5, y);
      y += 4;
    });

    // Añadir footer a todas las páginas
    addFooter(doc);

    doc.save(`informe-subasta-${boeId || 'analisis'}.pdf`);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files!)]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = "dmw71xf7z"; // Encontrado en el proyecto
    const uploadPreset = "unsigned_pdf"; // Ajustar si es necesario
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("resource_type", "raw");
    
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`, {
      method: "POST",
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error("[Frontend] Cloudinary Upload Error:", error);
      throw new Error(error.error?.message || "Error al subir a Cloudinary");
    }
    
    const data = await response.json();
    console.log("[Frontend] Cloudinary Upload Success Data:", data);
    console.log("[Frontend] Secure URL:", data.secure_url);
    console.log("[Frontend] Resource Type:", data.resource_type);
    console.log("FINAL resource_type:", data.resource_type);
    console.log("FINAL URL:", data.secure_url);
    return data.secure_url;
  };

  const handleAnalyze = async () => {
    if (files.length === 0) return;
    
    if (isBlocked) {
      if (onShowSoftGate) {
        onShowSoftGate();
      } else {
        navigate('/pro');
      }
      return;
    }

    setStep('loading');
    
    // 🔥 LIMPIAR CACHE antes de iniciar nuevo análisis
    if (boeId) {
      sessionStorage.removeItem(`analysisResult_${boeId}`);
    }
    
    try {
      // Subir a Cloudinary (Comentado para usar envío directo)
      // console.log("Subiendo archivo a Cloudinary...");
      // const pdfUrl = await uploadToCloudinary(files[0]);
      // console.log("PDF subido a Cloudinary:", pdfUrl);

      const selectedFile = files[0];
      console.log("Enviando archivo a backend:", selectedFile?.name, selectedFile?.size);

      const formData = new FormData();
      formData.append("files", selectedFile); // clave exacta
      formData.append("type", analysisType);
      if (auctionId) {
        formData.append("auctionId", auctionId);
      }

      const response = await fetch('/api/run-analysis', {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'application/json'
        // },
        // body: JSON.stringify({
        //   pdfUrl,
        //   type: analysisType,
        //   auctionId
        // })
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al analizar el documento.");
      }

      const result = await response.json();
      console.log("1. RAW RESULT:", result);
      
      // Incrementar contador solo cuando análisis se ejecuta correctamente
      let success = true;
      if (!isPaid) {
        success = await incrementAnalysisCount();
      }
      
      if (!success && currentPlan !== 'pro') {
        setStep('upload');
        if (onShowSoftGate) onShowSoftGate();
        return;
      }

      setResultData(result);
      console.log("FINAL RESULT DATA FRONT:", result);
      console.log("STATE SET:", result);
      // Also save to session storage for the current page if needed
      sessionStorage.setItem(`analysisResult_${boeId}`, JSON.stringify(result));
      setStep('result');
    } catch (error) {
      console.error("Error en el análisis:", error);
      setStep('upload');
      const errorMessage = error instanceof Error ? error.message : "Hubo un error al analizar el documento.";
      alert(`${errorMessage} Por favor, inténtalo de nuevo.`);
    }
  };

  const getConfianzaExplanation = (nivel: string) => {
    if (nivel.includes('MUY ALTA')) return 'Basado en Certificación de Cargas reciente y Edicto.';
    if (nivel.includes('ALTA')) return 'Basado en Certificación de Cargas reciente.';
    if (nivel.includes('MEDIA')) return 'Basado en Nota Simple y Edicto. Faltan datos fehacientes de deuda.';
    if (nivel.includes('MUY BAJA')) return 'Basado solo en Edicto. Análisis ciego, alto riesgo.';
    if (nivel.includes('BAJA')) return 'Basado solo en Nota Simple. Riesgo de cargas ocultas o desactualizadas.';
    return 'Evaluación basada en los documentos aportados.';
  };

  const razonamiento = safeResult?.razonamiento_juridico
    ? (typeof safeResult.razonamiento_juridico === "string"
        ? safeResult.razonamiento_juridico
        : JSON.stringify(safeResult.razonamiento_juridico, null, 2))
    : "";

  console.log("FRONT RESULT DATA:", resultData);
  if (safeResult) {
    console.log("FRONT FINAL CARGAS:", safeResult.cargas_detectadas);
  }

  return (
    <div ref={blockRef} className={`${isIntegrated ? 'w-full' : `${noMargin ? '' : 'my-8 md:my-12'} bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden`}`}>
        {!isIntegrated && (
        <div className="bg-slate-900 px-8 py-6 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShieldAlert size={24} className="text-brand-400" />
            <h2 className="font-serif font-bold text-xl">Revisión experta + IA de cargas registrales</h2>
          </div>
        </div>
      )}

      <div className={`${isIntegrated ? 'p-0' : 'p-4 md:p-8'}`}>
        {step === 'locked' && (
          <div 
            className={`${isIntegrated ? '' : 'group/card cursor-pointer bg-white border border-slate-100 rounded-2xl p-4 md:p-6 transition-all duration-200 hover:shadow-md hover:-translate-y-[1px]'}`}
            onClick={handleUnlock}
          >
            <div className={`flex flex-col md:flex-row gap-4 md:gap-8 items-center py-1 ${isBlocked ? 'opacity-75 grayscale-[0.5]' : ''}`}>
              {/* Left Side (70%) */}
              <div className="w-full md:flex-[0.7] space-y-3 md:space-y-4">
                <div className="flex items-start gap-3 md:gap-5">
                  <div className="w-9 h-9 md:w-12 md:h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100 group-hover/card:border-brand-200 group-hover/card:text-brand-500 transition-all duration-500">
                    <Scale size={20} className="md:hidden" strokeWidth={1.2} />
                    <Scale size={26} className="hidden md:block" strokeWidth={1.2} />
                  </div>
                  <div className="flex-1">
                    <span className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Riesgo legal</span>
                    <p className="text-slate-500 text-[10px] md:text-sm font-medium leading-tight">Detecta hipotecas, embargos y riesgos ocultos antes de pujar</p>
                    
                    <div className="flex flex-wrap items-center gap-1.5 mt-3 md:mt-4">
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50/50 border border-emerald-100/50 text-[8px] md:text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                        <span>Nota simple</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50/50 border border-emerald-100/50 text-[8px] md:text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                        <span>Certificación</span>
                      </div>
                      <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-slate-50/50 border border-slate-100/50 text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>Edicto</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Side (30%) */}
              <div className="w-full md:flex-[0.3] flex flex-col items-center md:items-end gap-2 md:gap-3">
                <div className="text-center md:text-right border-t md:border-t-0 border-slate-100 pt-3 md:pt-0 w-full md:w-auto">
                  <div className="flex items-baseline justify-center md:justify-end gap-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Por solo</span>
                    <span className="text-lg md:text-xl font-bold text-emerald-600 tracking-tight">2,99€</span>
                  </div>
                  <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Pago único por expediente</p>
                </div>
                
                {isBlocked ? (
                  <div className="w-full py-3 md:py-2 px-6 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 font-bold text-center text-xs md:text-sm">
                    Límite alcanzado
                  </div>
                ) : (
                  <>
                    {user && !isPaid && (
                      <p className="text-[9px] font-bold text-slate-400 mb-1 text-center md:text-right">
                        {currentPlan === 'free' 
                          ? "Usarás tu análisis gratuito" 
                          : (planLimit - usage === 2) 
                            ? "Te queda 1 análisis después" 
                            : (planLimit - usage === 1)
                              ? "Último análisis este mes"
                              : "Consumirá 1 crédito"
                        }
                      </p>
                    )}
                    <button 
                      onClick={handleUnlock}
                      className="w-full font-bold py-3 md:py-2 px-6 rounded-xl bg-brand-600 text-white hover:bg-brand-800 shadow-lg shadow-brand-100 transition-all duration-300 flex items-center justify-center gap-2 text-xs md:text-sm whitespace-nowrap group/btn"
                    >
                      Analizar cargas →
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 'upload' && (
          <div className="max-w-[980px] mx-auto">
            {isIntegrated ? (
              <div className="mb-6 space-y-4">
                <div className="text-left">
                  <p className="text-sm text-slate-900 font-bold">
                    {isStandalone ? 'Sube tu Nota Simple para analizarla' : 'Sube la Nota Simple o la Certificación de Cargas del BOE para detectar cargas y riesgos'}
                  </p>
                </div>
                
                {!isStandalone && (
                  <>
                    <button 
                      onClick={() => {
                        setBoeClicked(true);
                        window.open(finalBoeUrl, '_blank');
                      }}
                      className="w-full py-3 bg-white border-2 border-slate-900 text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                      Abrir BOE
                    </button>
                    <p className="text-xs text-slate-400 mt-1 text-center">Paso 1 — descargar certificación del BOE</p>
                    
                    {boeClicked && (
                      <p className="text-xs text-slate-500 font-medium text-center mt-2">
                        Esperando el PDF… súbelo aquí cuando lo descargues
                      </p>
                    )}
                    
                    <p 
                      className="text-xs text-slate-500 text-center cursor-pointer hover:underline mt-2 flex items-center justify-center gap-1.5"
                      onClick={() => setShowHowToModal(true)}
                    >
                      <Info size={14} /> ¿Cómo descargar la certificación del BOE?
                    </p>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center mb-6 md:mb-10">
                <p className="text-lg md:text-xl text-slate-900 font-bold mt-1 max-w-2xl mx-auto leading-tight">
                  {isStandalone ? 'Sube tu Nota Simple para analizarla' : 'Adjunta Nota Simple o Certificación de cargas. Opcional: edicto.'}
                </p>
                
                <div className="flex justify-center gap-4 md:gap-10 mt-6 md:mt-10">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100/50">
                      <FileText size={20} className="md:hidden" strokeWidth={1.5} />
                      <FileText size={28} className="hidden md:block" strokeWidth={1.5} />
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] md:text-[11px] font-bold text-slate-900 uppercase tracking-wider">Nota simple</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100/50">
                      <Scale size={20} className="md:hidden" strokeWidth={1.5} />
                      <Scale size={28} className="hidden md:block" strokeWidth={1.5} />
                    </div>
                    <div className="text-center">
                      <p className="text-[9px] md:text-[11px] font-bold text-slate-900 uppercase tracking-wider">Certificación</p>
                    </div>
                  </div>
                  {!isStandalone && (
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                        <FileWarning size={20} className="md:hidden" strokeWidth={1.5} />
                        <FileWarning size={28} className="hidden md:block" strokeWidth={1.5} />
                      </div>
                      <div className="text-center">
                        <p className="text-[9px] md:text-[11px] font-bold text-slate-900 uppercase tracking-wider">Edicto</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="relative px-2 md:px-0">
              <div 
                className={`border-2 border-dashed ${isIntegrated ? 'rounded-2xl p-4 md:p-6' : 'rounded-[24px] md:rounded-[28px] p-6 md:p-10'} transition-all duration-300 ${files.length > 0 ? 'border-brand-500 bg-brand-50/30' : 'border-slate-300 hover:border-brand-300 hover:bg-brand-50/30 bg-white shadow-sm'}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  accept=".pdf" 
                  multiple
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                
                {files.length > 0 ? (
                  <div className="flex flex-col items-center w-full">
                    <div className={`flex items-center gap-4 ${isIntegrated ? 'mb-4' : 'mb-6'}`}>
                      <div className={`${isIntegrated ? 'w-10 h-10' : 'w-12 h-12 md:w-14 md:h-14'} rounded-2xl bg-brand-100 flex items-center justify-center text-brand-600`}>
                        <FileText size={isIntegrated ? 20 : 24} className="md:hidden" />
                        <FileText size={isIntegrated ? 20 : 28} className="hidden md:block" />
                      </div>
                      <div className="text-left">
                        <h4 className={`${isIntegrated ? 'text-sm md:text-base' : 'text-base md:text-lg'} font-bold text-slate-900`}>{files.length} documento(s) listos</h4>
                        <p className="text-slate-500 text-[10px] md:text-xs">Preparados para el análisis jurídico</p>
                      </div>
                    </div>
                    
                    <div className={`w-full max-w-md space-y-2 ${isIntegrated ? 'mb-4' : 'mb-6'}`}>
                      {files?.map((f, idx) => (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={idx} 
                          className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm"
                        >
                          <div className="flex items-center gap-3 overflow-hidden">
                            <FileText size={14} className="text-brand-400 shrink-0" />
                            <span className="text-xs font-bold text-slate-700 truncate">{f.name}</span>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <span className="text-[9px] font-bold text-slate-400">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                            <button 
                              onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                              className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        </motion.div>
                      )) || []}
                    </div>

                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-brand-600 font-bold hover:text-brand-700 transition-colors flex items-center gap-2"
                    >
                      <UploadCloud size={14} /> Añadir más documentos
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center cursor-pointer group" onClick={() => fileInputRef.current?.click()}>
                    <div className={`${isIntegrated ? 'w-12 h-12 md:w-14 md:h-14 mb-3' : 'w-14 h-14 md:w-16 md:h-16 mb-4'} bg-slate-50 rounded-[20px] md:rounded-[24px] flex items-center justify-center text-slate-300 group-hover:bg-brand-50 group-hover:text-brand-500 transition-all duration-500 group-hover:scale-110`}>
                      <UploadCloud size={isIntegrated ? 24 : 28} className="md:hidden" />
                      <UploadCloud size={isIntegrated ? 28 : 32} className="hidden md:block" />
                    </div>
                    <p className={`${isIntegrated ? 'text-sm md:text-base' : 'text-base md:text-lg'} font-bold text-slate-900 mb-1 text-center`}>Haz clic o arrastra tus PDFs aquí</p>
                    <p className="text-[10px] md:text-xs text-slate-600 font-bold text-center">Sube la Nota Simple, Certificación o Edicto</p>
                  </div>
                )}
              </div>
            </div>

            <div className={`${isIntegrated ? 'mt-4' : 'mt-6 md:mt-8'} flex flex-col items-center px-0 md:px-4`}>
              {(() => {
                const visuals = getCounterVisuals();
                return (
                  <div className={`mb-3 flex items-start gap-2 px-3 py-2 rounded-lg border ${visuals.bgClass} ${visuals.borderClass} ${visuals.textClass}`}>
                    <div className="mt-0.5 shrink-0">{visuals.icon}</div>
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-semibold">{visuals.text}</span>
                      {visuals.subtext && <span className="text-[10px] opacity-80 leading-tight mt-0.5">{visuals.subtext}</span>}
                      {visuals.action && (
                        <Link to={visuals.action.to} className="text-xs underline text-red-700 hover:text-red-800 mt-1 font-bold">
                          {visuals.action.text}
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })()}

              {isBlocked ? (
                <div className="w-full max-w-lg py-4 px-8 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 font-bold text-center text-sm md:text-base">
                  Límite alcanzado
                </div>
              ) : (
                <>
                  {user && !isPaid && files.length > 0 && (
                    <p className="text-[10px] md:text-xs font-bold text-slate-500 mb-2 animate-in fade-in slide-in-from-bottom-1">
                      {currentPlan === 'free' 
                        ? "Usarás tu análisis gratuito" 
                        : (planLimit - usage === 2) 
                          ? "Te queda 1 análisis después" 
                          : (planLimit - usage === 1)
                            ? "Último análisis este mes"
                            : "Este análisis consumirá 1 crédito"
                      }
                    </p>
                  )}
                  <button 
                    onClick={handleAnalyze}
                    disabled={files.length === 0}
                    className={`
                      w-full max-w-lg ${isIntegrated ? 'py-3 md:py-3.5' : 'py-3.5 md:py-4'} px-8 md:px-12 rounded-2xl font-semibold text-sm md:text-lg transition-all flex items-center justify-center gap-3 shadow-sm
                      ${(files.length > 0) 
                        ? 'bg-brand-600 text-white hover:bg-brand-700 hover:-translate-y-0.5' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'}
                    `}
                  >
                    <Scale size={isIntegrated ? 18 : 20} />
                    <span>Analizar cargas</span>
                  </button>
                </>
              )}
              
              {!isIntegrated && (
                <>
                  <div className="mt-2 text-[10px] md:text-xs font-medium text-slate-500 flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${isBlocked ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
                    {getCounterText()}
                  </div>
                  
                  {currentPlan !== 'pro' && !isBlocked && (
                    <Link to="/pro" className="mt-3 text-[10px] md:text-xs text-brand-600 font-bold hover:text-brand-700 hover:underline flex items-center gap-1">
                      Desbloquea 3 análisis al mes con BASIC <ArrowRight size={12} />
                    </Link>
                  )}
                </>
              )}

              {/* Help Block */}
              {!isIntegrated && !isStandalone && (
                <div className="w-full bg-slate-50 rounded-2xl p-4 md:p-6 border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 mt-2 md:mt-4">
                  <div className="text-center md:text-left">
                    <h4 className="font-bold text-slate-900 text-xs md:text-sm mb-1 flex items-center justify-center md:justify-start gap-2">
                      <HelpCircle size={14} className="md:hidden text-brand-600" />
                      <HelpCircle size={16} className="hidden md:block text-brand-600" />
                      ¿No tienes la Nota Simple?
                    </h4>
                    <p className="text-slate-600 text-[10px] md:text-xs font-medium">
                      Descárgala desde el BOE con DNI o Cl@ve
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center gap-2 md:gap-3 shrink-0 w-full md:w-auto">
                    <a 
                      href={finalBoeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-4 py-2.5 md:py-2.5 rounded-xl bg-white border border-slate-300 text-[10px] md:text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm text-slate-900 hover:bg-slate-50"
                    >
                      Ver subasta en BOE <ExternalLink size={10} className="md:w-3 md:h-3" />
                    </a>
                    <button 
                      onClick={() => setShowHowToModal(true)}
                      className="w-full sm:w-auto px-4 py-2.5 md:py-2.5 rounded-xl bg-slate-900 text-white text-[10px] md:text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-md"
                    >
                      Cómo obtenerla <FileSearch size={10} className="md:w-3 md:h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {step === 'loading' && (
          <div className="py-16 flex flex-col items-center text-center">
            <Loader2 size={48} className="text-brand-600 animate-spin mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Procesando documento...</h3>
            <p className="text-slate-500 text-lg max-w-md">
              Nuestra IA está extrayendo el texto legal, cruzando datos y evaluando las cargas registrales.
            </p>
          </div>
        )}

        {step === 'result' && safeResult && (
          <div className="space-y-8">
            {/* Barra de confianza superior */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 p-4 bg-slate-50/50 border border-slate-200 rounded-2xl shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <ShieldCheck size={14} className="text-brand-600" />
                <span>Análisis IA jurídico</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-slate-300"></div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <FileText size={14} className="text-brand-600" />
                <span>{isStandalone ? 'Documentos registrales' : 'Datos BOE oficiales'}</span>
              </div>
              <div className="hidden md:block w-px h-4 bg-slate-300"></div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <TrendingUp size={14} className="text-brand-600" />
                <span>{isStandalone ? 'Análisis de riesgos' : 'Estimación mercado'}</span>
              </div>
            </div>

            {/* Contador de créditos */}
            {user && (
              <div className="flex flex-col items-center -mt-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
                  <div className={`w-2 h-2 rounded-full ${planLimit - usage > 0 ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></div>
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                    {planLimit - usage <= 0 
                      ? "Has alcanzado el límite mensual" 
                      : currentPlan === 'free' 
                        ? `Te queda ${planLimit - usage} análisis gratis` 
                        : `Te quedan ${planLimit - usage} análisis este mes`
                    }
                  </span>
                </div>
                
                {user.lastAnalysisReset && currentPlan !== 'free' && (
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                    {(() => {
                      const lastReset = user.lastAnalysisReset.toDate ? user.lastAnalysisReset.toDate() : new Date(user.lastAnalysisReset);
                      const resetDate = new Date(lastReset);
                      resetDate.setMonth(resetDate.getMonth() + 1);
                      const day = resetDate.getDate();
                      const month = resetDate.toLocaleString('es-ES', { month: 'long' });
                      return `Se reinician el ${day} ${month}`;
                    })()}
                  </p>
                )}
              </div>
            )}

            {/* Resumen Claro (Recomendación IA) */}
            {resultData && (
              <div className="bg-brand-50 border border-brand-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-brand-900 mb-4 flex items-center gap-2">
                  <Info size={20} className="text-brand-600" /> Resumen claro
                </h3>
                <div className="text-brand-800 text-sm leading-relaxed whitespace-pre-line overflow-auto max-h-96">
                  <pre>{JSON.stringify(resultData, null, 2)}</pre>
                </div>
              </div>
            )}

            {/* Qué pagarías realmente */}
            {(safeResult.peor_escenario?.total !== undefined || safeResult.peor_escenario?.importe_total !== undefined) && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  💰 Qué pagarías realmente
                </h3>
                { !(safeResult.peor_escenario.importe_total ?? safeResult.peor_escenario.total) ? (
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500"/> Solo pagas tu puja</li>
                    <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500"/> La deuda se cancela con la subasta</li>
                    <li className="flex items-center gap-2 font-bold text-emerald-700 mt-2 pt-2 border-t border-slate-100">
                      ✔️ No asumes deudas tras la subasta
                    </li>
                  </ul>
                ) : (
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500"/> Pagas tu puja</li>
                    <li className="flex items-center gap-2"><AlertTriangle size={16} className="text-amber-500"/> + cargas que subsisten</li>
                    <li className="flex items-center gap-2 font-bold text-slate-900 mt-2 pt-2 border-t border-slate-100">
                      {appraisalValue ? (
                        <>Coste total estimado: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(appraisalValue + (safeResult.peor_escenario.importe_total ?? safeResult.peor_escenario.total))}</>
                      ) : (
                        <>Cargas a asumir: {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(safeResult.peor_escenario.importe_total ?? safeResult.peor_escenario.total)} (más tu puja)</>
                      )}
                    </li>
                  </ul>
                )}
                
                <details className="mt-4 group">
                  <summary className="text-sm font-bold text-brand-600 cursor-pointer list-none flex items-center gap-1 hover:text-brand-700 transition-colors">
                    <HelpCircle size={16} /> ¿Por qué no pago la deuda?
                  </summary>
                  <div className="mt-2 p-3 bg-slate-50 rounded-lg text-sm text-slate-600 border border-slate-100">
                    La deuda corresponde a la hipoteca ejecutada. Se cancela con la adjudicación del inmueble. El comprador no la asume directamente.
                  </div>
                </details>
              </div>
            )}

            {/* Resumen Inversión */}
            {analysisType === 'completo' && canCalculateFinancials && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-brand-600" /> Resumen inversión
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-medium mb-1">Valor mercado estimado</p>
                    <p className="text-lg font-bold text-slate-900">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(surface! * marketPriceM2!)}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-medium mb-1">Tasación</p>
                    <p className="text-lg font-bold text-slate-900">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(appraisalValue!)}
                    </p>
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                    <p className="text-xs text-emerald-600 font-medium mb-1">Descuento estimado</p>
                    <p className="text-lg font-bold text-emerald-700">
                      {new Intl.NumberFormat('es-ES', { style: 'percent', maximumFractionDigits: 1 }).format(((surface! * marketPriceM2!) - appraisalValue!) / (surface! * marketPriceM2!))}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-medium mb-1">Superficie</p>
                    <p className="text-lg font-bold text-slate-900">
                      {new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 }).format(surface!)} m²
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <p className="text-xs text-slate-500 font-medium mb-1">€/m² mercado</p>
                    <p className="text-lg font-bold text-slate-900">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(marketPriceM2!)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Coste total estimado */}
            {analysisType === 'completo' && (safeResult.peor_escenario?.total !== undefined || safeResult.peor_escenario?.importe_total !== undefined) && (
              <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Calculator size={20} className="text-brand-400" /> Coste total estimado
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-slate-400 text-sm">
                    <span>Tasación</span>
                    <span className="font-medium text-slate-200">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(appraisalValue || 0)}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center text-slate-400 text-sm">
                      <span>Cargas que subsisten</span>
                      <span className="font-medium text-amber-400">
                        + {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(safeResult.peor_escenario.importe_total ?? safeResult.peor_escenario.total)}
                      </span>
                    </div>
                    {(safeResult.peor_escenario.importe_total ?? safeResult.peor_escenario.total) === 0 ? (
                      <span className="text-xs text-emerald-400 mt-1">✔️ No asumes deudas tras la subasta</span>
                    ) : (
                      <span className="text-xs text-rose-400 mt-1">⚠️ Estas cargas SÍ las asume el comprador</span>
                    )}
                  </div>
                  <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                    <span className="font-bold text-slate-200">Coste total estimado</span>
                    <span className="text-2xl font-black text-brand-400">
                      {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format((appraisalValue || 0) + (safeResult.peor_escenario.importe_total ?? safeResult.peor_escenario.total))}
                    </span>
                  </div>
                </div>
                <p className="mt-4 text-[10px] text-slate-500 leading-tight">
                  * Este cálculo asume una puja igual al valor de tasación. El coste final dependerá de tu puja real en el portal del BOE.
                </p>
              </div>
            )}

            {/* Decisión de inversión - Bloque Agrupado */}
            {analysisType === 'completo' && canCalculateFinancials && (safeResult.peor_escenario?.total !== undefined || safeResult.peor_escenario?.importe_total !== undefined) && (
              <div className="bg-slate-50/50 border border-slate-200 rounded-3xl p-8 shadow-sm space-y-10">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 justify-center uppercase tracking-widest">
                    <ShieldCheck size={24} className="text-brand-600" /> Decisión de inversión
                  </h3>
                  <p className="text-sm text-slate-500 font-medium italic">
                    Análisis final basado en datos de mercado y cargas detectadas
                  </p>
                </div>

                {(() => {
                  const valorMercadoEstimado = surface! * marketPriceM2!;
                  const importeCargas = safeResult.peor_escenario.importe_total ?? safeResult.peor_escenario.total;
                  const costeTotal = (appraisalValue || 0) + importeCargas;
                  const margenSeguridad = valorMercadoEstimado - costeTotal;
                  const margenPorcentaje = (margenSeguridad / valorMercadoEstimado) * 100;
                  const margenObjetivo = 0.20;
                  const precioMaximoPuja = (valorMercadoEstimado * (1 - margenObjetivo)) - importeCargas;

                  // Lógica de veredicto
                  let veredicto = "No recomendable";
                  let colorClass = "text-rose-600";
                  let bgColorClass = "bg-rose-50";
                  let borderColorClass = "border-rose-100";
                  let Icon = FileWarning;
                  let explicacion = "El margen es insuficiente para cubrir riesgos imprevistos.";
                  let ctaText = "Ver otras oportunidades";
                  let ctaIcon = <ArrowRight size={18} />;
                  let ctaLink = "/";

                  if (margenPorcentaje >= 25) {
                    veredicto = "Alta oportunidad";
                    colorClass = "text-emerald-600";
                    bgColorClass = "bg-emerald-50";
                    borderColorClass = "border-emerald-100";
                    Icon = ShieldCheck;
                    explicacion = "Excelente margen de seguridad. La operación es muy sólida financieramente.";
                    ctaText = "Analizar cargas ahora";
                    ctaIcon = <ShieldCheck size={18} />;
                    ctaLink = "#analisis-juridico";
                  } else if (margenPorcentaje >= 15) {
                    veredicto = "Oportunidad interesante";
                    colorClass = "text-amber-600";
                    bgColorClass = "bg-amber-50";
                    borderColorClass = "border-amber-100";
                    Icon = CheckCircle;
                    explicacion = "Buen margen. Operación atractiva si el resto de factores legales son favorables.";
                    ctaText = "Calcular puja precisa";
                    ctaIcon = <Calculator size={18} />;
                    ctaLink = "/pro";
                  } else if (margenPorcentaje >= 5) {
                    veredicto = "Analizar con cautela";
                    colorClass = "text-orange-600";
                    bgColorClass = "bg-orange-50";
                    borderColorClass = "border-orange-100";
                    Icon = AlertTriangle;
                    explicacion = "Margen ajustado. Requiere un análisis legal y de mercado muy preciso.";
                    ctaText = "Revisar análisis jurídico";
                    ctaIcon = <FileSearch size={18} />;
                    ctaLink = "#analisis-juridico";
                  }

                  return (
                    <div className="space-y-10">
                      {/* 1. Veredicto de Inversión - HERO */}
                      <div className="flex flex-col items-center text-center space-y-6">
                        <div className={`inline-flex items-center gap-4 px-10 py-6 rounded-3xl border-2 ${borderColorClass} ${bgColorClass} shadow-md transform transition-all hover:scale-[1.02]`}>
                          <Icon size={48} className={colorClass} />
                          <h4 className={`text-4xl font-black ${colorClass} tracking-tight`}>
                            {veredicto}
                          </h4>
                        </div>
                        <div className="max-w-xl space-y-6">
                          <div className="space-y-3">
                            <p className="text-2xl font-black text-slate-900">
                              Margen de seguridad del {new Intl.NumberFormat('es-ES', { maximumFractionDigits: 1 }).format(margenPorcentaje)}%
                            </p>
                            <p className="text-lg text-slate-600 leading-relaxed font-medium">
                              {explicacion}
                            </p>
                          </div>

                          {/* CTA Dinámico */}
                          <div className="pt-2">
                            {ctaLink.startsWith('#') ? (
                              <button 
                                onClick={() => {
                                  const el = document.getElementById(ctaLink.substring(1));
                                  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }}
                                className={`inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
                                  veredicto === 'No recomendable' 
                                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                                    : 'bg-brand-600 text-white hover:bg-brand-700'
                                }`}
                              >
                                {ctaIcon}
                                {ctaText}
                              </button>
                            ) : (
                              <Link 
                                to={ctaLink}
                                className={`inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${
                                  veredicto === 'No recomendable' 
                                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                                    : 'bg-brand-600 text-white hover:bg-brand-700'
                                }`}
                              >
                                {ctaIcon}
                                {ctaText}
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 2. Comparativa Valor vs Coste & Beneficio Potencial */}
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                          {/* Columna Izquierda: Valor Mercado */}
                          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Valor mercado estimado</p>
                            <p className="text-3xl font-black text-slate-900">
                              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(valorMercadoEstimado)}
                            </p>
                          </div>

                          {/* Separador Visual (Flecha o VS) */}
                          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-slate-100 border border-slate-200 rounded-full items-center justify-center z-10 text-slate-400 font-bold text-xs">
                            VS
                          </div>

                          {/* Columna Derecha: Coste Total */}
                          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Inversión total estimada</p>
                            <p className="text-3xl font-black text-slate-900">
                              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(costeTotal)}
                            </p>
                          </div>
                        </div>

                        {/* Beneficio Potencial */}
                        <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 ${margenSeguridad >= 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'} shadow-sm`}>
                          <div className="flex items-center gap-2">
                            <TrendingUp size={24} />
                            <span className="text-base font-bold uppercase tracking-wider">Beneficio potencial:</span>
                          </div>
                          <span className="text-3xl font-black">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(margenSeguridad)}
                          </span>
                        </div>
                      </div>

                      {/* 3. Estimación orientativa de puja - Discreta */}
                      <div className="bg-slate-100/50 border border-slate-200 rounded-2xl p-6 text-center max-w-2xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                          <Scale size={12} /> Estimación orientativa de puja
                        </div>
                        <div className="space-y-3">
                          <p className="text-3xl font-black text-slate-800">
                            {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Math.max(0, precioMaximoPuja))}
                          </p>
                          <div className="space-y-1">
                            <p className="text-sm text-slate-500 font-medium">
                              Puja máxima sugerida para mantener un margen del 20%
                            </p>
                            <p className="text-brand-600 text-xs font-bold">
                              Para cálculo preciso usar la Calculadora PRO
                            </p>
                          </div>

                          {/* CTA para usuarios FREE o sin plan */}
                          {(!currentPlan || currentPlan === 'free') && (
                            <div className="mt-4">
                              <Link 
                                to="/pro" 
                                className="inline-flex items-center gap-2 px-5 py-2 bg-brand-600 text-white rounded-lg text-xs font-bold hover:bg-brand-700 transition-all shadow-sm"
                              >
                                <Calculator size={14} />
                                Calcular puja máxima
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>

                      <hr className="border-slate-200" />

                      {/* 4. Margen de Seguridad - Detalle */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold text-slate-500 uppercase tracking-widest text-center">Detalle del margen de seguridad</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
                            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Margen en euros</p>
                            <p className="text-2xl font-black text-slate-900">
                              {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(margenSeguridad)}
                            </p>
                          </div>
                          <div className={`${bgColorClass} p-5 rounded-2xl border ${borderColorClass} shadow-sm flex flex-col items-center justify-center text-center`}>
                            <p className={`text-xs ${colorClass.replace('text', 'text-opacity-70 text')} font-bold uppercase mb-1`}>Margen porcentual</p>
                            <p className={`text-2xl font-black ${colorClass}`}>
                              {new Intl.NumberFormat('es-ES', { style: 'percent', maximumFractionDigits: 1 }).format(margenPorcentaje / 100)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}


            {/* CTAs Section */}
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => alert("Abriendo calculadora de puja máxima...")}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-4 px-6 rounded-xl shadow-md transition-colors flex items-center justify-center gap-3 text-lg"
              >
                <Calculator size={24} />
                Calcular puja máxima segura
              </button>

              {(() => {
                const hasSubsistingCharges = safeResult?.cargas_detectadas?.some(c => c.estado_carga === 'SUBSISTE') || false;
                const isLowConfidence = safeResult?.nivel_confianza_global?.includes('BAJA') || false;
                const isHighRisk = safeResult?.riesgo_global === 'ALTO';
                const hasOccupancy = safeResult?.ocupacion_detectada;
                const uniqueProperties = new Set(safeResult?.cargas_detectadas?.map(c => c.identificador_registral) || []).size;
                const shouldShowConsultingCta = hasOccupancy || hasSubsistingCharges || isLowConfidence || isHighRisk || (uniqueProperties > 1);

                if (!shouldShowConsultingCta) return null;

                return (
                  <a 
                    href="https://calendly.com/activosoffmarket" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold py-3 px-6 rounded-xl transition-colors flex flex-col items-center justify-center gap-1"
                  >
                    <div className="flex items-center gap-2 text-base">
                      <Calendar size={20} className="text-brand-600" />
                      Analizar esta subasta conmigo
                    </div>
                    <span className="text-xs text-slate-500 font-normal">Revisión jurídica y estrategia de puja</span>
                  </a>
                );
              })()}
            </div>

            {/* Context Header */}
            <div id="analisis-juridico" className="flex flex-wrap gap-4 items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <FileText size={16} className="text-slate-400" />
                <span>Fuente: <strong className="text-slate-900">{safeResult.fuente_documento}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 group relative">
                <ShieldCheck size={16} className={safeResult.nivel_confianza_global.includes('ALTA') ? 'text-emerald-500' : safeResult.nivel_confianza_global.includes('MEDIA') ? 'text-amber-500' : 'text-orange-500'} />
                <span className="cursor-help border-b border-dashed border-slate-400">
                  Confianza IA: <strong className="text-slate-900">{safeResult.nivel_confianza_global}</strong>
                </span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none">
                  {getConfianzaExplanation(safeResult.nivel_confianza_global)}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                </div>
              </div>
            </div>

            {/* Incoherencias Críticas */}
            {safeResult.incoherencias_detectadas && safeResult.incoherencias_detectadas.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle size={20} className="text-amber-600" />
                  <h4 className="font-bold text-amber-900">Discrepancias en la documentación</h4>
                </div>
                <ul className="space-y-2">
                  {safeResult?.incoherencias_detectadas?.map((incoherencia, idx) => (
                    <li key={idx} className="text-sm text-amber-800 flex items-start gap-2">
                      <span className="mt-1 text-amber-500">•</span>
                      <span>{incoherencia}</span>
                    </li>
                  )) || []}
                </ul>
              </div>
            )}

            {/* Ocupación del Inmueble */}
            {safeResult.ocupacion_detectada && (
              <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Info size={20} className="text-slate-600" />
                  <h4 className="font-bold text-slate-900">Situación de posesión a revisar</h4>
                </div>
                <p className="text-sm text-slate-700 mb-2">
                  Se han encontrado indicios en la documentación de que el inmueble podría estar ocupado. En estos casos puede ser necesario gestionar la posesión tras la adjudicación.
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Nivel de Riesgo:</span>
                  <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    safeResult.nivel_riesgo_ocupacion === 'ALTO' ? 'bg-amber-100 text-amber-700' :
                    safeResult.nivel_riesgo_ocupacion === 'MEDIO' ? 'bg-slate-200 text-slate-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {safeResult.nivel_riesgo_ocupacion}
                  </span>
                </div>
              </div>
            )}

            {/* Razonamiento Jurídico (Chain of Thought) */}
            {safeResult.razonamiento_juridico && (
              <details className="group">
                <summary className="list-none cursor-pointer">
                  <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl flex items-center justify-between hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🔍</span>
                      <h4 className="font-bold text-slate-900">Ver análisis jurídico completo</h4>
                    </div>
                    <ChevronDown size={20} className="text-slate-400 group-open:rotate-180 transition-transform" />
                  </div>
                </summary>
                <div className="bg-white border-x border-b border-slate-200 p-6 rounded-b-xl -mt-2 text-sm text-slate-700 whitespace-pre-line leading-relaxed shadow-inner">
                  {razonamiento}
                </div>
              </details>
            )}

            {/* Semaphore Header */}
            <div className={`p-6 rounded-2xl border flex flex-col md:flex-row items-center gap-6 ${
              safeResult.riesgo_global === 'ALTO' ? 'bg-orange-50 border-orange-200 text-orange-900' :
              safeResult.riesgo_global === 'MEDIO' ? 'bg-amber-50 border-amber-200 text-amber-900' :
              'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}>
              <div className={`p-4 rounded-full ${
                safeResult.riesgo_global === 'ALTO' ? 'bg-orange-100 text-orange-600' :
                safeResult.riesgo_global === 'MEDIO' ? 'bg-amber-100 text-amber-600' :
                'bg-emerald-100 text-emerald-600'
              }`}>
                {safeResult.riesgo_global === 'ALTO' ? <ShieldAlert size={32} /> :
                 safeResult.riesgo_global === 'MEDIO' ? <AlertTriangle size={32} /> :
                 <ShieldCheck size={32} />}
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-sm uppercase tracking-wider font-bold opacity-80 mb-1">Riesgo Global de la Operación</h3>
                <p className="text-3xl font-black">{safeResult.riesgo_global}</p>
              </div>
              <div className="md:ml-auto text-center md:text-right w-full md:w-auto border-t md:border-t-0 md:border-l border-current/20 pt-4 md:pt-0 md:pl-6 mt-2 md:mt-0">
                <h3 className="text-sm uppercase tracking-wider font-bold opacity-80 mb-1">Peor Escenario Registral</h3>
                <p className="text-3xl font-black">{safeResult.peor_escenario?.total ? safeResult.peor_escenario.total.toLocaleString('es-ES', {style: 'currency', currency: 'EUR'}) : "—"}</p>
                <p className="text-xs opacity-80 mt-1 font-medium">Impacto: {safeResult.impacto_economico.nivel}</p>
                {safeResult.peor_escenario.total === 0 ? (
                  <p className="text-xs text-emerald-700 mt-2 font-medium">✔️ Incluso en el peor caso, no asumirías cargas económicas</p>
                ) : (
                  <p className="text-xs text-rose-700 mt-2 font-medium">⚠️ En el peor escenario, podrías asumir hasta {safeResult.peor_escenario?.total ? new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(safeResult.peor_escenario.total) : "—"} adicionales</p>
                )}
              </div>
            </div>

            {/* Cargas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Subsisting Charges (Bad) */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex items-center gap-2">
                  <FileWarning className="text-amber-600" size={20} />
                  <h4 className="font-bold text-amber-900">Cargas que SUBSISTEN</h4>
                </div>
                <div className="p-6">
                  {(safeResult?.cargas_detectadas?.filter(c => c.resultado === 'SUBSISTE' || c.estado_carga === 'SUBSISTE')?.length || 0) > 0 ? (
                    <ul className="space-y-6">
                      {safeResult?.cargas_detectadas?.filter(c => c.resultado === 'SUBSISTE' || c.estado_carga === 'SUBSISTE')?.map((carga, idx) => (
                        <li key={idx} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-bold text-slate-900">{carga.identificador_registral} - {carga.tipo}</p>
                              <p className="text-sm text-slate-500">{carga.titular}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                                  Rango: {carga.rango}
                                </span>
                                <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                  carga.confianza === 'ALTA' ? 'bg-emerald-100 text-emerald-700' :
                                  carga.confianza === 'MEDIA' ? 'bg-amber-100 text-amber-700' :
                                  'bg-orange-100 text-orange-700'
                                }`}>
                                  Confianza: {carga.confianza}
                                </span>
                                {carga.estado_carga && (
                                  <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                    carga.estado_carga === 'SUBSISTE' ? 'bg-amber-100 text-amber-700' :
                                    carga.estado_carga === 'SE_CANCELA_EN_SUBASTA' ? 'bg-emerald-100 text-emerald-700' :
                                    carga.estado_carga === 'CANCELADA_REGISTRAL' ? 'bg-slate-200 text-slate-600' :
                                    'bg-amber-100 text-amber-700'
                                  }`}>
                                    {carga.estado_carga.replace(/_/g, ' ')}
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="font-black text-lg text-amber-700">{carga.desglose?.total ? carga.desglose.total.toLocaleString('es-ES', {style: 'currency', currency: 'EUR'}) : "—"}</span>
                          </div>
                          
                          {/* Desglose */}
                          <div className="bg-slate-50 rounded-lg p-3 text-xs border border-slate-100">
                            <div className="flex justify-between py-1 border-b border-slate-200/60 last:border-0">
                              <span className="text-slate-500">Principal:</span>
                              <span className="font-medium text-slate-700">{carga.desglose?.principal ? carga.desglose.principal.toLocaleString('es-ES', {style: 'currency', currency: 'EUR'}) : "—"}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200/60 last:border-0">
                              <span className="text-slate-500">Intereses (est.):</span>
                              <span className="font-medium text-slate-700">{carga.desglose?.intereses ? carga.desglose.intereses.toLocaleString('es-ES', {style: 'currency', currency: 'EUR'}) : "—"}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200/60 last:border-0">
                              <span className="text-slate-500">Costas:</span>
                              <span className="font-medium text-slate-700">{carga.desglose?.costas ? carga.desglose.costas.toLocaleString('es-ES', {style: 'currency', currency: 'EUR'}) : "—"}</span>
                            </div>
                          </div>
                          
                          {/* Fuente Textual */}
                          <div className="mt-3 bg-slate-100/50 rounded p-2 text-[10px] text-slate-500 italic border-l-2 border-slate-300">
                            "{carga.fuente_textual}"
                          </div>
                        </li>
                      )) || []}
                    </ul>
                  ) : (
                    <p className="text-slate-500 italic">No se han detectado cargas subsistentes.</p>
                  )}
                </div>
              </div>

              {/* Purged Charges (Good/Neutral) */}
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
                <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-center gap-2">
                  <CheckCircle className="text-emerald-600" size={20} />
                  <h4 className="font-bold text-emerald-900">Cargas que se PURGAN, REEMPLAZAN o CANCELAN</h4>
                </div>
                <div className="p-6">
                  {(safeResult?.cargas_detectadas?.filter(c => c.resultado === 'SE PURGA' || c.estado_carga === 'SE_CANCELA_EN_SUBASTA')?.length || 0) > 0 ? (
                    <ul className="space-y-6">
                      {safeResult?.cargas_detectadas?.filter(c => c.resultado === 'SE PURGA' || c.estado_carga === 'SE_CANCELA_EN_SUBASTA')?.map((carga, idx) => (
                        <li key={idx} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <p className="font-bold text-slate-900">{carga.identificador_registral} - {carga.tipo}</p>
                              <p className="text-sm text-slate-500">{carga.titular}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                                  Rango: {carga.rango}
                                </span>
                                <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                  carga.confianza === 'ALTA' ? 'bg-emerald-100 text-emerald-700' :
                                  carga.confianza === 'MEDIA' ? 'bg-amber-100 text-amber-700' :
                                  'bg-orange-100 text-orange-700'
                                }`}>
                                  Confianza: {carga.confianza}
                                </span>
                                {carga.estado_carga && (
                                  <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                    carga.estado_carga === 'SUBSISTE' ? 'bg-amber-100 text-amber-700' :
                                    carga.estado_carga === 'SE_CANCELA_EN_SUBASTA' ? 'bg-emerald-100 text-emerald-700' :
                                    carga.estado_carga === 'CANCELADA_REGISTRAL' ? 'bg-slate-200 text-slate-600' :
                                    'bg-amber-100 text-amber-700'
                                  }`}>
                                    {carga.estado_carga.replace(/_/g, ' ')}
                                  </span>
                                )}
                                {carga.resultado.toUpperCase() === 'REEMPLAZADA' && (
                                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                                    REEMPLAZADA
                                  </span>
                                )}
                                {carga.resultado.toUpperCase() === 'CANCELADA' && (
                                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-600 px-2 py-0.5 rounded">
                                    CANCELADA
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="font-bold text-slate-400 line-through">{carga.desglose?.total ? carga.desglose.total.toLocaleString('es-ES', {style: 'currency', currency: 'EUR'}) : "—"}</span>
                          </div>
                          
                          {/* Desglose */}
                          <div className="bg-slate-50 rounded-lg p-3 text-xs border border-slate-100 opacity-60">
                            <div className="flex justify-between py-1 border-b border-slate-200/60 last:border-0">
                              <span className="text-slate-500">Principal:</span>
                              <span className="font-medium text-slate-700">{carga.desglose?.principal ? carga.desglose.principal.toLocaleString('es-ES', {style: 'currency', currency: 'EUR'}) : "—"}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200/60 last:border-0">
                              <span className="text-slate-500">Intereses (est.):</span>
                              <span className="font-medium text-slate-700">{carga.desglose?.intereses ? carga.desglose.intereses.toLocaleString('es-ES', {style: 'currency', currency: 'EUR'}) : "—"}</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-slate-200/60 last:border-0">
                              <span className="text-slate-500">Costas:</span>
                              <span className="font-medium text-slate-700">{carga.desglose?.costas ? carga.desglose.costas.toLocaleString('es-ES', {style: 'currency', currency: 'EUR'}) : "—"}</span>
                            </div>
                          </div>
                          
                          {/* Fuente Textual */}
                          <div className="mt-3 bg-slate-100/50 rounded p-2 text-[10px] text-slate-500 italic border-l-2 border-slate-300 opacity-60">
                            "{carga.fuente_textual}"
                          </div>
                        </li>
                      )) || []}
                    </ul>
                  ) : (
                    <p className="text-slate-500 italic">No se han detectado cargas a purgar.</p>
                  )}
                </div>
              </div>
            </div>
            {/* Unknown Charges (Critical) */}
            {(safeResult?.cargas_detectadas?.filter(c => c.resultado === 'DESCONOCIDO')?.length || 0) > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mt-8">
                      <div className="bg-amber-50 px-6 py-4 border-b border-amber-100 flex items-center gap-2">
                        <AlertTriangle className="text-amber-600" size={20} />
                        <h4 className="font-bold text-amber-900">Cargas de Estado DESCONOCIDO (Requieren Revisión Manual)</h4>
                      </div>
                      <div className="p-6">
                        <ul className="space-y-6">
                          {safeResult?.cargas_detectadas?.filter(c => c.resultado === 'DESCONOCIDO')?.map((carga, idx) => (
                            <li key={idx} className="pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-bold text-slate-900">{carga.identificador_registral} - {carga.tipo}</p>
                            <p className="text-sm text-slate-500">{carga.titular}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="inline-block text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded">
                                Rango: {carga.rango}
                              </span>
                              <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                carga.confianza === 'ALTA' ? 'bg-emerald-100 text-emerald-700' :
                                carga.confianza === 'MEDIA' ? 'bg-amber-100 text-amber-700' :
                                'bg-orange-100 text-orange-700'
                              }`}>
                                Confianza: {carga.confianza}
                              </span>
                              {carga.estado_carga && (
                                <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                                  carga.estado_carga === 'SUBSISTE' ? 'bg-amber-100 text-amber-700' :
                                  carga.estado_carga === 'SE_CANCELA_EN_SUBASTA' ? 'bg-emerald-100 text-emerald-700' :
                                  carga.estado_carga === 'CANCELADA_REGISTRAL' ? 'bg-slate-200 text-slate-600' :
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                  {carga.estado_carga.replace(/_/g, ' ')}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="font-black text-lg text-amber-600">{carga.desglose?.total ? carga.desglose.total.toLocaleString('es-ES', {style: 'currency', currency: 'EUR'}) : "—"}</span>
                        </div>
                        
                        {/* Desglose */}
                        <div className="bg-slate-50 rounded-lg p-3 text-xs border border-slate-100">
                          <div className="flex justify-between py-1 border-b border-slate-200/60 last:border-0">
                            <span className="text-slate-500">Principal:</span>
                            <span className="font-medium text-slate-700">{carga.desglose?.principal ? carga.desglose.principal.toLocaleString('es-ES', {style: 'currency', currency: 'EUR'}) : "—"}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-200/60 last:border-0">
                            <span className="text-slate-500">Intereses (est.):</span>
                            <span className="font-medium text-slate-700">{carga.desglose?.intereses ? carga.desglose.intereses.toLocaleString('es-ES', {style: 'currency', currency: 'EUR'}) : "—"}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-200/60 last:border-0">
                            <span className="text-slate-500">Costas:</span>
                            <span className="font-medium text-slate-700">{carga.desglose?.costas ? carga.desglose.costas.toLocaleString('es-ES', {style: 'currency', currency: 'EUR'}) : "—"}</span>
                          </div>
                        </div>
                        
                        {/* Fuente Textual */}
                        <div className="mt-3 bg-amber-50/50 rounded p-2 text-[10px] text-amber-700 italic border-l-2 border-amber-300">
                          "{carga.fuente_textual}"
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Alerts */}
            {(safeResult?.alertas?.length || 0) > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <h4 className="font-bold text-amber-900 mb-4 flex items-center gap-2">
                  <AlertTriangle size={20} /> Advertencias Jurídicas
                </h4>
                <ul className="space-y-3">
                  {safeResult?.alertas?.map((adv, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-amber-800 text-sm leading-relaxed">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                      <span>{adv}</span>
                    </li>
                  )) || []}
                </ul>
              </div>
            )}

            {/* Download Action */}
            <div className="flex justify-center pt-4">
              <button 
                onClick={handleDownloadPDF}
                className="bg-slate-900 text-white font-bold py-3 px-8 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2"
              >
                <Download size={20} /> Descargar Informe PDF
              </button>
            </div>

            {/* Aviso Legal Final */}
            <div className="mt-12 pt-6 border-t border-slate-100 bg-slate-50/50 -mx-6 px-6 pb-6 rounded-b-2xl">
              <p className="text-[10px] text-slate-500 leading-relaxed text-center max-w-2xl mx-auto">
                <span className="font-bold text-slate-600 uppercase tracking-widest mr-1">Aviso legal:</span>
                Este informe se genera mediante análisis con inteligencia jurídica artificial especializada de la documentación disponible y datos de mercado estimados. Tiene carácter informativo y orientativo. No constituye asesoramiento jurídico, financiero ni de inversión. Se recomienda complementar la información con profesionales cualificados antes de tomar decisiones.
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Sticky Mobile CTA */}
      <AnimatePresence>
        {showSticky && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-50 px-4 pt-3 pb-2 bg-white/80 backdrop-blur-md border-t border-slate-200 md:hidden flex flex-col items-center"
          >
            <button 
              onClick={() => {
                if (step === 'locked') handleUnlock();
                else if (step === 'upload' && files.length > 0) handleAnalyze();
                else if (step === 'upload' && files.length === 0) {
                  blockRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  setTimeout(() => {
                    fileInputRef.current?.click();
                  }, 50);
                }
              }}
              className="w-full bg-brand-600 text-white font-bold py-3.5 rounded-2xl shadow-xl flex items-center justify-center gap-3"
            >
              {step === 'locked' ? (
                <>Analizar cargas <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">2,99€</span></>
              ) : files.length > 0 ? (
                <>Analizar {files.length} doc. <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">2,99€</span></>
              ) : (
                <>Subir documentos <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full font-medium">2,99€</span></>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How to Obtain Modal */}
      {showHowToModal && ReactDOM.createPortal(
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 md:p-6 bg-black/40 backdrop-blur"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600">
                    <Download size={24} />
                  </div>
                  <button 
                    onClick={() => setShowHowToModal(false)}
                    className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Cómo obtener la documentación</h3>
                <p className="text-slate-500 text-sm mb-8">Sigue estos pasos para descargar los documentos oficiales desde el Portal de Subastas del BOE.</p>

                <div className="space-y-6">
                  {[
                    { title: 'Abrir subasta en BOE', desc: 'Accede al enlace oficial de la subasta.' },
                    { title: 'Descargar nota simple o certificación de cargas', desc: 'Busca y descarga el documento oficial.' },
                    { title: 'Volver a esta pantalla', desc: 'Regresa a la ficha de la subasta.' },
                    { title: 'Subir el PDF', desc: 'Arrastra el archivo descargado aquí.' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-brand-500 text-white text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-slate-900 mb-0.5">{item.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-slate-500 mt-6 font-medium">Algunas subastas permiten descarga directa sin iniciar sesión</p>

                <div className="mt-8">
                  <button 
                    onClick={() => window.open(finalBoeUrl, '_blank')}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all"
                  >
                    Abrir subasta en BOE
                  </button>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col gap-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">¿Tienes dudas?</p>
                  <p className="text-sm text-slate-900 font-bold text-center">Escríbenos y respondemos en menos de 24h</p>
                    <a 
                      href="mailto:contacto@activosoffmarket.es" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-brand-600 transition-colors bg-slate-50 px-4 py-2 rounded-xl border border-slate-100"
                    >
                      <X size={14} className="rotate-45" /> contacto@activosoffmarket.es
                    </a>
                    <a 
                      href="https://t.me/activosOffmarket" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-xs font-bold text-white bg-[#0088cc] hover:bg-[#0077b5] px-4 py-2 rounded-xl transition-colors"
                    >
                      Telegram
                    </a>
                  </div>
                </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};

export default LoadAnalysisBlock;
