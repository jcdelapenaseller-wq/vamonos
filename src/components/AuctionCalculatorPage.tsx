import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Navigate } from 'react-router-dom';
import { AUCTIONS } from '../data/auctions';
import { ROUTES } from '@/constants/routes';
import { normalizeCity } from '../utils/auctionNormalizer';
import AuctionCalculator from './AuctionCalculator';
import Header from './Header';
import Footer from './Footer';

const AuctionCalculatorPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const cleanSlug = slug ? decodeURIComponent(slug).replace(/\/$/, '').toLowerCase() : '';
  const auction = cleanSlug ? AUCTIONS[cleanSlug] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!auction) return <Navigate to={ROUTES.CALCULATOR} replace />;

  const cityName = normalizeCity(auction) || 'España';

  return (
    <div className="bg-slate-50 min-h-screen">
      <Helmet>
        <title>Calculadora de Puja Máxima en Subastas | Calcula tu rentabilidad</title>
        <meta
          name="description"
          content="Calcula cuánto pujar en una subasta judicial en España. Estima rentabilidad, costes e impuestos antes de invertir."
        />
        <link rel="canonical" href="https://activosoffmarket.es/calculadora-subastas" />
      </Helmet>
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden">
          <div className="p-10 border-b border-slate-100 bg-slate-50/50">
            <h1 className="text-3xl font-serif font-bold text-slate-900 mb-2">
              Calculadora de Puja Máxima
            </h1>
            <p className="text-slate-500 mb-6">
              Análisis de rentabilidad para: <span className="font-bold text-slate-700">{auction.address || auction.boeId}</span>
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Tasación</p>
                <p className="font-bold text-slate-900">{auction.appraisalValue?.toLocaleString('es-ES')}€</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Deuda</p>
                <p className="font-bold text-slate-900">{auction.claimedDebt?.toLocaleString('es-ES')}€</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Superficie</p>
                <p className="font-bold text-slate-900">{auction.surface || '---'} m²</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Localidad</p>
                <p className="font-bold text-slate-900 truncate">{cityName}</p>
              </div>
            </div>
          </div>
          <div className="p-10">
            <AuctionCalculator 
              appraisalValue={auction.appraisalValue}
              claimedDebt={auction.claimedDebt}
              surface={auction.surface}
              city={cityName}
            />
            <div style={{background: 'red', padding: '50px'}}>
              TEST SEO VISIBLE
            </div>
          </div>
          
          <div className="p-10 border-t border-slate-100 bg-slate-50">
            <section className="max-w-4xl mx-auto px-4">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                ¿Cuánto debes pujar en una subasta?
              </h2>

          <p className="text-slate-700 mb-4">
            Como regla general, los inversores no suelen pujar más del 70% del valor de mercado del inmueble.
            Esta calculadora te permite estimar la puja máxima recomendada teniendo en cuenta todos los costes reales.
          </p>

          <ul className="list-disc pl-6 text-slate-700 mb-8 space-y-2">
            <li>Precio de adjudicación</li>
            <li>Impuestos (ITP o IVA)</li>
            <li>Costes de notaría y registro</li>
            <li>Reformas necesarias</li>
            <li>Cargas ocultas o deudas</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Cómo calcular la puja máxima en una subasta
          </h2>

          <p className="text-slate-700 mb-6">
            Para invertir con seguridad, debes restar todos los costes al valor real del inmueble.
            El resultado es el precio máximo al que puedes pujar sin entrar en pérdidas.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            Ejemplo real
          </h3>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-8">
            <p className="text-slate-700 mb-2">
              Vivienda valorada en 200.000 €
            </p>
            <p className="text-slate-700 mb-2">
              Costes totales: 20.000 €
            </p>
            <p className="text-slate-700 mb-2">
              Reforma estimada: 15.000 €
            </p>
            <p className="font-semibold text-slate-900">
              👉 Puja máxima recomendada: 165.000 €
            </p>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Preguntas frecuentes
          </h2>

          <div className="space-y-4 text-slate-700">
            <p><strong>¿Cuánto se puede pujar en una subasta?</strong><br />
            Depende del valor de mercado y los costes asociados. Como referencia, muchos inversores no superan el 70% del valor.</p>

            <p><strong>¿Qué impuestos se pagan al comprar en subasta?</strong><br />
            Principalmente el ITP en segunda mano o IVA en obra nueva, además de notaría y registro.</p>

            <p><strong>¿Cómo saber si una subasta es rentable?</strong><br />
            Calculando todos los costes y comparándolos con el valor real del inmueble.</p>
          </div>
        </section>
      </div>
    </div>

    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "¿Cuánto se puede pujar en una subasta?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Depende del valor del inmueble y los costes, pero muchos inversores no superan el 70% del valor de mercado."
              }
            },
            {
              "@type": "Question",
              "name": "¿Qué impuestos se pagan al comprar en subasta?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Principalmente el ITP o el IVA, además de gastos de notaría y registro."
              }
            }
          ]
        })}} />
      </main>
      <Footer />
    </div>
  );
};

export default AuctionCalculatorPage;
