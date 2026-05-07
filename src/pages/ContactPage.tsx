import React, { useState } from 'react';
import { Mail, MessageSquare, HelpCircle, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export default function ContactPage() {
  const { user } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    reason: '',
    message: ''
  });

  const faqs = [
    {
      q: "¿Cómo funciona la web?",
      a: "Activos Off-Market rastrea y organiza las subastas públicas de España, enriqueciendo los datos básicos con valoraciones de mercado, rentabilidad esperada y análisis técnicos. Puedes usar el buscador o el mapa para encontrar oportunidades en tu zona."
    },
    {
      q: "¿Qué incluye cada plan (FREE / BASIC / PRO)?",
      a: "El plan FREE te permite ver subastas básicas y tener 3 favoritos. El BASIC incluye uso ilimitado de la calculadora, rentabilidades y hasta 3 alertas. El PRO da acceso sin límites a todo, incluyendo el mapa de inversiones y alertas ilimitadas."
    },
    {
      q: "¿Cuántos análisis tengo?",
      a: "Depende de tu plan. Ciertos bloqueos de información premium (análisis de cargas, expedientes complejos) requieren estar suscrito a funcionalidades PRO o usar un ticket de análisis si tu plan lo soporta."
    },
    {
      q: "¿Qué es el análisis de cargas?",
      a: "Es un estudio detallado donde examinamos la certificación de cargas del registro de la propiedad para identificar embargos anteriores, hipotecas no canceladas y deudas que el adjudicatario tendría que asumir al ganar la subasta."
    },
    {
      q: "¿En qué se diferencia del análisis completo?",
      a: "El análisis de cargas se enfoca puramente en la deuda registral. El análisis completo a través de nuestra consultoría incluye estudio de mercado, rentabilidad, estrategia de puja, situación posesoria estimativa y acompañamiento procedimental."
    },
    {
      q: "¿Cómo funciona la consultoría?",
      a: "La consultoría es un servicio 1 a 1 donde un experto analiza contigo una subasta específica, define una estrategia de inversión y te acompaña en el proceso de decisión para minimizar riesgos."
    },
    {
      q: "¿Es seguro invertir en subastas?",
      a: "Es una inversión con alta rentabilidad potencial pero con riesgos asociados (cargas ocultas, ocupación, problemas jurídicos). Es seguro si se realiza un estudio riguroso previo; de lo contrario, puede resultar en pérdidas importantes."
    },
    {
      q: "¿Qué pasa si la vivienda está ocupada?",
      a: "En una subasta judicial, si la vivienda está ocupada, el juzgado deberá iniciar (a petición tuya tras la adjudicación) un procedimiento para entregar la posesión. Este trámite alargará el tiempo hasta que puedas disfrutar del inmueble o rentabilizarlo."
    },
    {
      q: "¿Necesito experiencia previa?",
      a: "No es estrictamente necesaria para empezar a buscar, pero NO recomendamos pujar a ciegas sin experiencia. Lo ideal es apoyarse en nuestras herramientas y buscar asesoramiento o utilizar la consultoría antes de tu primera inversión."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    console.log("Formulario de contacto enviado:", formData);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData(prev => ({ ...prev, message: '' }));
      
      // Auto-hide success message
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24">
      <Helmet>
        <title>Contacto y Preguntas Frecuentes | Activos Off-Market</title>
        <meta name="description" content="Contacta con nosotros para resolver dudas sobre subastas judiciales, análisis, planes y opciones de consultoría en Activos Off-Market." />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-16 md:py-24 border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
            Contacto
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Ayuda, soporte técnico y resolución de dudas sobre subastas e inversión.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 pb-20">
        
        {/* BLOQUE SUPERIOR CTA */}
        <div className="bg-brand-50 rounded-xl border border-brand-100 p-4 md:p-5 mb-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-4 shadow-sm">
          <div>
            <h2 className="text-base md:text-lg font-bold text-brand-900 mb-1">
              ¿Necesitas ayuda con una subasta concreta?
            </h2>
            <p className="text-brand-700 text-sm">
              Te ayudamos a analizar riesgos, cargas y rentabilidad antes de invertir.
            </p>
          </div>
          <a 
            href="https://calendly.com/activosoffmarket"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 mt-4 sm:mt-0 inline-flex items-center justify-center bg-brand-600 text-white font-bold py-2.5 px-5 rounded-lg hover:bg-brand-700 transition-colors text-sm w-full sm:w-auto"
          >
            Revisar mi caso
          </a>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Contact Form Column */}
          <div className="space-y-4">
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                <MessageSquare className="text-brand-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Mándanos un mensaje</h2>
            </div>

            {isSuccess ? (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center text-emerald-800 animate-in fade-in zoom-in duration-300">
                <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-3" />
                <p className="font-bold mb-1">¡Mensaje enviado correctamente!</p>
                <p className="text-sm opacity-90">Te responderemos lo antes posible al email proporcionado.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Select reason */}
                <div>
                  <label htmlFor="reason" className="block text-sm font-bold text-slate-700 mb-1.5">Motivo de la consulta</label>
                  <select
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all bg-white"
                    required
                  >
                    <option value="" disabled>Selecciona una opción</option>
                    <option value="Subasta concreta">Subasta concreta</option>
                    <option value="Análisis de cargas">Análisis de cargas</option>
                    <option value="Problema técnico">Problema técnico</option>
                    <option value="Otra consulta">Otra consulta</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-slate-700 mb-1.5">Nombre</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all placeholder:text-slate-400"
                    placeholder="Tu nombre"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all placeholder:text-slate-400"
                    placeholder="tu@email.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-1.5">Mensaje</label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all resize-y placeholder:text-slate-400"
                    placeholder="Explica tu caso o consulta..."
                  />
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-brand-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-brand-700 focus:ring-4 focus:ring-brand-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar consulta'}
                    {!isSubmitting && <Mail size={18} className="group-hover:translate-x-1 transition-transform" />}
                  </button>
                  <p className="text-center text-xs text-slate-500 mt-3 font-medium">Respuesta en menos de 24h</p>
                </div>
              </form>
            )}
          </div>

          {/* Alternativa Email */}
          <div className="text-center text-sm text-slate-500 py-2">
            <span className="block sm:inline mr-1">¿Prefieres escribirnos directamente?</span>
            <a 
              href="mailto:contacto@activosoffmarket.es" 
              className="font-bold text-slate-700 hover:text-brand-600 inline-flex items-center gap-1 transition-colors"
            >
              <Mail size={16} className="text-slate-400" />
              contacto@activosoffmarket.es
            </a>
          </div>

          </div>

          {/* FAQ Column */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                <HelpCircle className="text-brand-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Preguntas Frecuentes</h2>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <details 
                  key={idx} 
                  className="group bg-slate-50 rounded-xl border border-slate-200 [&_summary::-webkit-details-marker]:hidden"
                >
                  <summary className="flex items-center justify-between p-4 cursor-pointer">
                    <span className="font-bold text-slate-900 text-sm md:text-base pr-4">{faq.q}</span>
                    <span className="relative flex-shrink-0 ml-1.5 w-5 h-5">
                      <ChevronDown size={20} className="text-slate-400 group-open:rotate-180 transition-transform duration-300" />
                    </span>
                  </summary>
                  <div className="p-4 pt-0 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-100 mt-2 pt-4">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>

        </div>

      </div>

      {/* CTA Final */}
      <section className="bg-white border-t border-slate-200 py-12 md:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            ¿Prefieres hablar directamente con un experto?
          </h2>
          <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto mb-6">
            Analizamos tu caso contigo y te damos una estrategia clara.
          </p>
          <a 
            href="https://calendly.com/activosoffmarket"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 text-base font-bold rounded-xl text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-md shadow-brand-500/20 hover:shadow-brand-500/30 hover:-translate-y-0.5"
          >
            Reservar consultoría
          </a>
        </div>
      </section>

    </div>
  );
}
