import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-slate-200 last:border-0">
      <button 
        className="w-full flex justify-between items-center py-6 text-left focus:outline-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-lg md:text-xl font-bold text-slate-800 pr-8 group-hover:text-brand-700 transition-colors">{question}</span>
        {isOpen ? <ChevronUp size={24} className="text-brand-500 flex-shrink-0" /> : <ChevronDown size={24} className="text-slate-400 flex-shrink-0 group-hover:text-brand-500" />}
      </button>
      {isOpen && (
        <div className="pb-6 text-slate-600 text-base md:text-lg leading-relaxed animate-in slide-in-from-top-2">
          {answer}
        </div>
      )}
    </div>
  );
};

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "¿Qué incluye el plan BASIC?",
      answer: "Acceso a la estructura de cargas simplificada, estimación del valor de mercado y alertas en tiempo real de nuevas oportunidades. Permite visualizar los datos clave de cada expediente para filtrar activos rápidamente y tomar decisiones fundamentadas."
    },
    {
      question: "¿Qué diferencia hay entre BASIC y PRO?",
      answer: "El plan PRO incluye todas las funcionalidades de BASIC y amplía la cobertura con herramientas de priorización, valoración estimada del activo y un dashboard exclusivo de seguimiento de oportunidades."
    },
    {
      question: "¿Cuántos análisis puedo hacer al mes?",
      answer: "El acceso se adapta al nivel elegido. El plan FREE permite explorar las subastas disponibles. Los planes BASIC y PRO desbloquean el análisis detallado y la estructura de cargas en base a las herramientas que necesite el inversor."
    },
    {
      question: "¿Necesito conocimientos previos?",
      answer: "La plataforma traduce la complejidad técnica y jurídica del BOE en indicadores financieros y legales accesibles. Está pensada tanto para quienes buscan la compra de una vivienda propia como para inversores, reduciendo sustancialmente la curva de aprendizaje."
    },
    {
      question: "¿Puedo probar la plataforma antes de pagar?",
      answer: "Sí. Crear una cuenta FREE permite explorar el inventario de activos, acceder a calculadoras de rentabilidad y familiarizarse con el entorno antes de requerir un plan superior para ver áreas críticas como las cargas y embargos."
    },
    {
      question: "¿Existe compromiso de permanencia?",
      answer: "No hay ningún compromiso de permanencia. La gestión de las suscripciones (BASIC y PRO) se realiza desde el panel de control del usuario y se puede cancelar de forma inmediata, manteniendo el acceso hasta que finalice el periodo en curso."
    },
  ];

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-bold uppercase tracking-wide mb-4 hover:bg-slate-200 transition-colors cursor-default">
            <HelpCircle size={16} /> Dudas Frecuentes
          </div>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-6">Transparencia radical</h2>
          <p className="text-xl text-slate-600">
            Resuelvo las dudas más comunes antes de que inviertas un euro.
          </p>
        </div>
        
        <div className="max-w-7xl mx-auto bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;