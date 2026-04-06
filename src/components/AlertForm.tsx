import React, { useState, useEffect } from 'react';
import { Mail, MapPin, Home, Bell, ArrowRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { subscribeToMailerLite, sendAlertConfirmationEmail } from '../utils/mailerlite';
import { trackConversion } from '../utils/tracking';
import { useUser } from '../contexts/UserContext';
import { alertService } from '../services/alertService';
import { toast } from 'sonner';

const PROVINCIAS = [
  "Álava", "Albacete", "Alicante", "Almería", "Asturias", "Ávila", "Badajoz", "Baleares", "Barcelona", "Burgos", 
  "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ciudad Real", "Córdoba", "A Coruña", "Cuenca", "Girona", "Granada", 
  "Guadalajara", "Guipúzcoa", "Huelva", "Huesca", "Jaén", "León", "Lleida", "Lugo", "Madrid", "Málaga", 
  "Murcia", "Navarra", "Ourense", "Palencia", "Las Palmas", "Pontevedra", "La Rioja", "Salamanca", "Segovia", "Sevilla", 
  "Soria", "Tarragona", "Santa Cruz de Tenerife", "Teruel", "Toledo", "Valencia", "Valladolid", "Vizcaya", "Zamora", "Zaragoza"
].sort();

const TIPOS = [
  "Todos", "Vivienda", "Local", "Garaje", "Nave", "Suelo"
];

const AlertForm: React.FC = () => {
  const navigate = useNavigate();
  const { user, plan, isLogged, login } = useUser();
  const [email, setEmail] = useState(user?.email || '');
  const [province, setProvince] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [propertyType, setPropertyType] = useState('Todos');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    trackConversion('espana', 'alert_creation', 'email_submit', { step: 'arrival' });
  }, [isLogged, user, plan]);

  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !province) return;

    if (!isLogged || !user) {
      navigate(ROUTES.LOGIN);
      return;
    }

    setStatus('loading');
    setErrorMessage(null);
    
    try {
      // 1. Save to Firestore via Service
      await alertService.createAlert({
        email,
        province,
        municipality,
        propertyType,
        plan
      });

      // 2. MailerLite subscription (Separate Try/Catch)
      try {
        const result = await subscribeToMailerLite({
          email,
          source: 'alertas',
          fields: {
            alerta_provincia: province,
            alerta_municipio: municipality,
            alerta_tipo: propertyType,
            plan_status: plan === 'free' ? 'free' : 'pro'
          }
        });

        if (result.success) {
          sendAlertConfirmationEmail(email, province);
        } else {
          console.warn("MailerLite subscription failed:", result.error);
        }
      } catch (mailerError) {
        console.warn("MailerLite subscription threw error:", mailerError);
      }

      // 3. Success (Firestore succeeded, MailerLite might have failed)
      trackConversion(province.toLowerCase(), 'alert_creation', 'listado');
      setStatus('success');
      navigate(`${ROUTES.ALERTA_CONFIRMADA}?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      console.error("Error creating alert:", error);
      setStatus('error');
      setErrorMessage(error.message || 'Error al guardar la alerta en el sistema.');
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-50 rounded-full text-brand-600 mb-6">
          <Bell size={32} />
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-4">Crea tu Alerta de Subastas</h2>
        <p className="text-slate-600 text-lg">
          Te avisaremos por email en cuanto aparezcan nuevas subastas que encajen con tus criterios.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Provincia */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <MapPin size={16} className="text-brand-500" /> Provincia
            </label>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            >
              <option value="">Selecciona provincia</option>
              {PROVINCIAS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Tipo de Bien */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <Home size={16} className="text-brand-500" /> Tipo de Inmueble
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-brand-500 transition-all"
            >
              {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Municipio */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <MapPin size={16} className="text-brand-500" /> Municipio (Opcional)
          </label>
          <input
            type="text"
            value={municipality}
            onChange={(e) => setMunicipality(e.target.value)}
            placeholder="Ej: Alcorcón, Marbella..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-brand-500 transition-all"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
            <Mail size={16} className="text-brand-500" /> Tu Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@email.com"
            required
            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:ring-2 focus:ring-brand-500 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full bg-brand-600 text-white font-bold py-4 rounded-xl text-lg hover:bg-brand-700 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
        >
          {status === 'loading' ? 'Procesando...' : (
            <>Activar Alerta Gratuita <ArrowRight size={20} /></>
          )}
        </button>

        <div className="text-center mt-1">
          {plan === 'pro' && (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center justify-center gap-1.5">
                <span className="px-1.5 py-0.5 rounded bg-brand-50 text-brand-600 text-[8px] font-bold uppercase tracking-wider border border-brand-100">PRO activo</span>
              </div>
              <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">Alertas prioritarias activas</p>
            </div>
          )}
        </div>

        <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
          <ShieldCheck size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500 leading-relaxed">
            Al activar la alerta, aceptas recibir comunicaciones sobre subastas. Puedes darte de baja en cualquier momento con un solo clic. No compartimos tus datos con terceros.
          </p>
        </div>

        {status === 'error' && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-red-600 text-sm text-center font-medium">
              {errorMessage}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default AlertForm;
