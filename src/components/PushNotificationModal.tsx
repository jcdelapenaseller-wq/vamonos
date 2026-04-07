import React, { useEffect, useState } from 'react';
import { useUser } from '../contexts/UserContext';
import { requestAndSaveFCMToken } from '../lib/messaging';

export const PushNotificationModal: React.FC = () => {
  const { user, isLogged } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isLogged && user && !user.fcmToken) {
      const hasShown = sessionStorage.getItem('pushPromptShown');
      if (!hasShown && 'Notification' in window && Notification.permission !== 'denied') {
        const timer = setTimeout(() => {
          setIsOpen(true);
          sessionStorage.setItem('pushPromptShown', 'true');
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, [isLogged, user]);

  if (!isOpen) return null;

  const handleAccept = async () => {
    setIsOpen(false);
    if (user) {
      await requestAndSaveFCMToken(user.id);
    }
  };

  const handleDecline = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            Recibe solo las mejores oportunidades
          </h3>
          <p className="text-slate-600 mb-6">
            Las mejores subastas del BOE duran poco.<br/>
            Activa alertas y no llegues tarde.
          </p>
          <div className="space-y-3">
            <button
              onClick={handleAccept}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
            >
              Ver oportunidades
            </button>
            <button
              onClick={handleDecline}
              className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium py-3 px-4 rounded-xl transition-colors"
            >
              Ahora no
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
