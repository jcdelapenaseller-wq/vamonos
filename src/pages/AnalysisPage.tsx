import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Download, Lock } from 'lucide-react';
import { AUCTIONS } from '../data/auctions';
import LoadAnalysisBlock from '../components/LoadAnalysisBlock';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PaymentModal from '../components/PaymentModal';
import { normalizePropertyType, normalizeCity } from '../utils/auctionNormalizer';

const AnalysisPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [autoCheckout, setAutoCheckout] = useState<'cargas' | 'completo' | null>(null);
  const isPaid = searchParams.get('paid') === 'true';
  const cleanSlug = slug ? decodeURIComponent(slug).replace(/\/$/, '').toLowerCase() : '';
  const auction = cleanSlug ? AUCTIONS[cleanSlug] : null;

  useEffect(() => {
    if (!isPaid) {
      setIsModalOpen(true);
    }
  }, [isPaid]);

  if (!auction) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Subasta no encontrada</h1>
        <Link to="/" className="text-brand-600 hover:underline">Volver al inicio</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <main className="max-w-[1100px] mx-auto px-4 py-8 md:py-12">
        <button 
          onClick={() => navigate(`/subasta/${slug}`)}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-brand-600 mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Volver a la subasta
        </button>

        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-200 mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-2">{`${normalizePropertyType(auction.propertyType) || 'Vivienda'} en ${normalizeCity(auction) || 'la zona'}`}</h1>
          <p className="text-slate-500 text-sm">{auction.address}</p>
        </div>

        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-200 mb-8">
          {!isPaid ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock size={32} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Este análisis requiere pago único</h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => {
                    setAutoCheckout(null);
                    setIsModalOpen(true);
                  }}
                  className="w-full sm:w-auto py-4 px-8 bg-white border-2 border-brand-600 text-brand-600 rounded-2xl font-bold hover:bg-brand-50 transition-all shadow-sm"
                >
                  Analizar cargas (2,99€)
                </button>
                <button 
                  onClick={() => {
                    setAutoCheckout('completo');
                    setIsModalOpen(true);
                  }}
                  className="w-full sm:w-auto py-4 px-8 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-lg"
                >
                  Generar informe completo (4,99€)
                </button>
              </div>
            </div>
          ) : (
            <LoadAnalysisBlock 
              boeId={auction.boeId || ''} 
              boeUrl={auction.boeUrl}
              isIntegrated={true}
              initialStep="upload"
              surface={auction.surface}
              marketPriceM2={auction.marketPriceM2}
              appraisalValue={auction.appraisalValue}
              city={auction.city}
              propertyType={auction.propertyType}
            />
          )}
        </div>

        {isPaid && (
          <div className="flex justify-center">
            <button className="flex items-center gap-2 py-4 px-8 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all shadow-lg">
              <Download size={18} /> Descargar informe PDF
            </button>
          </div>
        )}
      </main>

      <PaymentModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setAutoCheckout(null);
        }} 
        type="analysis"
        auctionId={auction.boeId || cleanSlug}
        autoCheckout={autoCheckout}
      />
      <Footer />
    </div>
  );
};

export default AnalysisPage;
