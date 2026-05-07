import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import AuctionCalculator from './AuctionCalculator';
import Header from './Header';
import Footer from './Footer';

const AuctionCalculatorLanding: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Helmet>
        <title>Calculadora de puja máxima en subastas | Cuánto pujar sin perder dinero</title>
        <meta
          name="description"
          content="Calculadora gratuita para saber cuánto pujar en una subasta judicial en España. Calcula impuestos (ITP/IVA), gastos encubiertos y rentabilidad real."
        />
        <link rel="canonical" href="https://activosoffmarket.es/calculadora-subastas" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Calculadora de puja máxima en subastas",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "All",
            "description": "Herramienta para calcular cuánto pujar en una subasta judicial en España y estimar rentabilidad.",
            "url": "https://activosoffmarket.es/calculadora-subastas"
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "¿Cuánto se debe pujar en una subasta judicial?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Los inversores profesionales rara vez superan el 70% del valor de mercado del inmueble, descontando además las cargas previas, costes de reforma e impuestos (ITP o IVA)."
                }
              },
              {
                "@type": "Question",
                "name": "¿Qué impuestos se pagan al comprar un piso en subasta?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Generalmente se paga el ITP (Impuesto de Transmisiones Patrimoniales) si es segunda mano, que varía entre el 4% y el 10% según la Comunidad Autónoma, o el IVA (10%) más AJD si es primera transmisión o promoción abandonada."
                }
              },
              {
                "@type": "Question",
                "name": "¿Cómo saber si una subasta es rentable?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Una subasta es rentable cuando el Precio Mínimo de Venta esperado menos todos los costes (adjudicación, impuestos, notaría, registro, abogados, comunidad, IBI y reformas) deja un margen de beneficio neto acorde al riesgo, comúnmente en torno al 20-30%."
                }
              }
            ]
          })}
        </script>
      </Helmet>
      
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <AuctionCalculator />

        <section className="mt-16 mb-24 max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-slate-100 text-slate-800">
          <h2 className="text-3xl font-bold text-slate-900 mb-8 border-b pb-4 border-slate-100">
            ¿Cuánto debes pujar en una subasta judicial?
          </h2>

          <div className="bg-brand-50 border-l-4 border-brand-500 p-6 rounded-r-xl mb-10">
            <p className="text-lg font-medium text-slate-900 mb-2">Resumen clave para inversores:</p>
            <p className="text-slate-700 mb-3">
              En la mayoría de subastas judiciales en España, los inversores profesionales limitan rigidamente sus pujas <strong>entre el 60% y el 75% del valor de mercado real</strong> del activo.
            </p>
            <p className="text-slate-700 mb-3">
              ¿Por qué? Porque adjudicarse un inmueble en el BOE no es gratis. Este umbral permite absorber impuestos (ITP o IVA), liquidar cargas anteriores y cubrir costes de reforma y desalojo sin que tu margen de beneficio sufra.  
            </p>
            <p className="text-slate-700">
              Saber <strong>cómo calcular la puja máxima exacta</strong> y analizar <Link to={ROUTES.CHARGES} className="text-brand-600 hover:text-brand-800 font-medium underline">todas las cargas procesales</Link> es la barrera más crítica entre multiplicar tu dinero o acabar atrapado en un pasivo judicial.
            </p>
            <ul className="mt-6 text-sm text-slate-700 space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-brand-500 font-bold">✔</span> 
                <span>Calcula la puja máxima recomendada con nuestro simulador</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-500 font-bold">✔</span> 
                <span>Desglosa impuestos y gastos reales (Registro, Notaría, Comunidad)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-brand-500 font-bold">✔</span> 
                <span>Protege tu ROI descubriendo costes encubiertos antes de pujar</span>
              </li>
            </ul>
          </div>

          <h3 className="text-2xl font-semibold text-slate-900 mt-10 mb-6">1. Tabla de costes asociados a la adjudicación</h3>
          <p className="mb-4 text-slate-700">Comprar en el BOE no es solo pagar el remate. Existen costes ocultos de los que eres responsable solidario o directo al adjudicarte el bien:</p>
          
          <div className="overflow-x-auto mb-8 rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-800">
                  <th className="p-4 border-b border-slate-200 font-semibold">Concepto</th>
                  <th className="p-4 border-b border-slate-200 font-semibold">Coste est.</th>
                  <th className="p-4 border-b border-slate-200 font-semibold">¿Cuándo se paga?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-4">IBI atrasado y en curso</td>
                  <td className="p-4">Año actual + 3 años ant.</td>
                  <td className="p-4">Tras la adjudicación (al ayuntamiento)</td>
                </tr>
                <tr>
                  <td className="p-4">Comunidad de Propietarios</td>
                  <td className="p-4">Año actual + 3 años ant.</td>
                  <td className="p-4">Al emitirse el decreto de adjudicación</td>
                </tr>
                <tr>
                  <td className="p-4">Cargas Anteriores</td>
                  <td className="p-4">Lo especificado en la edicto</td>
                  <td className="p-4">Se asumen obligatoriamente</td>
                </tr>
                <tr>
                  <td className="p-4">Mandamiento de Cancelación</td>
                  <td className="p-4">150€ - 300€</td>
                  <td className="p-4">Gastos de registro (cargas posteriores)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">
            ¿Cuánto cuesta realmente comprar en una subasta?
          </h2>

          <p className="text-slate-700 mb-4">
            Aunque el precio de adjudicación pueda ser bajo, adquirir inmuebles en el BOE implica asumir de forma directa costes subyacentes sustanciales de los que muchos inversores no son conscientes en su primera adjudicación. Es este "coste oculto" lo que quiebra la rentabilidad cuando la puja es excesiva.
          </p>

          <p className="text-slate-700 mb-6">
            Además de los impuestos ineludibles, la ley te hace responsable solidario de impagos asociados al bien físico, y tu plan financiero debe estar preparado para afrontarlos sin mermar la liquidez general del proyecto de inversión particular.
          </p>

          <ul className="list-disc pl-6 text-slate-700 mb-6 space-y-2">
            <li><strong>Obligaciones Tributarias:</strong> Impuestos de transmisión (ITP, IVA o AJD) que gravan la adquisición.</li>
            <li><strong>Pasivos del Inmueble:</strong> Deudas de comunidad (año en curso y tres anteriores) y recibos de IBI impagados por el ejecutado.</li>
            <li><strong>Cargas Previas:</strong> Importes registrados antes del embargo ejecutado que recaen íntegros sobre tu espalda (ej. hipotecas anteriores no canceladas).</li>
            <li><strong>Adecuación y Puesta a Punto:</strong> Reformas para higienizar el piso tras un posible abandono o destrozos.</li>
            <li><strong>Honorarios por desalojo:</strong> Costes devengados en el asesoramiento jurídico para forzar el lanzamiento y obtener la plena propiedad material del bien adjudicado (posesión de llaves).</li>
          </ul>

          <p className="text-slate-700 mb-8">
            👉 En una operativa media, todo este conjunto de gastos adicionales y regularizaciones no planificables pueden sumar fácilmente un umbral incremental de entre el 10% y el 25% añadido por encima del mero precio de tu remate final del bien adjudicado.
          </p>

          <h3 className="text-2xl font-semibold text-slate-900 mt-10 mb-6">2. Impuestos en Subastas: ITP, IVA y AJD</h3>
          <p className="mb-4 text-slate-700">Participar en subastas judiciales <strong>no te exime de cumplir con la Agencia Tributaria</strong>, la adjudicación de subastas genera el gran devengo fiscal como cualquier compraventa, estando en ti la tarea de declararlo en tiempo y forma en 30 días:</p>
          <ul className="list-disc pl-6 space-y-3 mb-8 text-slate-700">
            <li><strong>ITP (Impuesto de Transmisiones Patrimoniales):</strong> Aplica mayoritariamente a las segundas entregas de edificaciones (inmuebles de segunda mano). La base imponible tributa con un tipo impuesto establecido normativamente por tu Comunidad Autónoma, variando habitualmente entre el suave <strong>4% en Euskadi, hasta el gravoso 10% de Cataluña o la Comunidad Valenciana</strong>.</li>
            <li><strong>IVA y AJD (Actos Jurídicos Documentados):</strong> Este dúo aplica generalmente si la puja procede de viviendas o suelos de obra nueva adjudicados directamente a empresas promotoras quebradas. Como postor afrontarás imperativamente un IVA general del 21% para un suelo/local y el 10% para edificación final de uso vivienda, más un AJD oscilante entre 0,5% y el 2%.</li>
          </ul>

          <h3 className="text-2xl font-semibold text-slate-900 mt-10 mb-6">3. El traicionero Valor de Referencia Catastral</h3>
          <p className="mb-4 text-slate-700">
            Debes tener máximo cuidado con un cambio de la ley implementado recientente que determina sobre qué importe grava el tributo final. Si el Valor de Referencia asignado por la Sede Electrónica del Catastro es netamente superior al valor del precio de tu adjudicación del remate (por una depreciación no tenida en cuenta en los modelos algorítmicos estatales), <strong>Hacienda te obligará tajantemente a tributar los impuestos sobre el importe fijado por su catastro, no sobre tu adquisición de subasta.</strong>
          </p>
          <p className="mb-4 text-slate-700">
             Por ejemplo: Si rematas la operación triunfando con 50.000€, pero al consultar las actas catastrales el modelo tributario determina que vale 110.000€, <strong>la Agencia Tributaria liquidará invariablemente el 10% de esos 110.000€</strong> sumando 11.000€ en cargas (más del 20% del valor inicial propuesto). Por esto, nunca se lanza la puja inicial de una subasta presencial sin tener esto calibrado al milímetro.
          </p>

          <h3 className="text-2xl font-semibold text-slate-900 mt-10 mb-6">4. Gastos de hipoteca o financiación de capital externa</h3>
          <p className="mb-8 text-slate-700">
            Obtener financiación hipotecaria es posible, permitiéndolo expresamente el mandato legal si lo solicitas al final de un remate. No obstante, al condicionar temporalmente el desembolso final de la adjudicación con terceras entidades, <strong>toda hipoteca asume sobre los hombros el riesgo estructural de los retrasos operativos por parte de la entidad de crédito:</strong> la necesaria tasación externa del piso (unos 300-450€) o aranceles en torno a una futura inscripción frente a la comisión de apertura.
          </p>
          <p className="mb-8 text-slate-700">
            Considera que, con plazos inflexibles fijados habitualmente en los estrictos cuarenta días judiciales, todo fallo logístico proveniente de tu filial financiera repercutiría unívocamente hacia tu patrimonio, obligándote judicialmente a quebrar tu ingreso del depósito depositado tras una caducidad previsible de esos tiempos innegociables de liquidación y asumiendo que un error de un empleado de banca liquida de antemano toda la inversión final por la quiebra.
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 mb-12">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Ejemplo real de cálculo de puja</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-700">
              <div className="bg-white p-4 rounded-xl border border-slate-100">
                <span className="block text-sm text-slate-500 mb-1">Precio Mercado</span>
                <span className="text-xl font-semibold text-slate-900">100.000 €</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100">
                <span className="block text-sm text-slate-500 mb-1">Margen esperado (25%)</span>
                <span className="text-xl font-semibold text-red-600">-25.000 €</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100">
                <span className="block text-sm text-slate-500 mb-1">Impuestos e IBI/Comunidad</span>
                <span className="text-xl font-semibold text-red-600">-8.000 €</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-100">
                <span className="block text-sm text-slate-500 mb-1">Reforma</span>
                <span className="text-xl font-semibold text-red-600">-12.000 €</span>
              </div>
            </div>
            <div className="mt-4 p-4 bg-brand-600 text-white rounded-xl flex justify-between items-center">
              <span className="font-medium">Puja Máxima Recomendada:</span>
              <span className="text-2xl font-bold">55.000 €</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">
            Diferencias entre comprar en subasta y en mercado tradicional
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-slate-50 p-4 rounded-xl border">
              <p className="font-bold mb-2">Compra tradicional</p>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>Precio más alto</li>
                <li>Menor riesgo legal</li>
                <li>Proceso más sencillo</li>
              </ul>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border">
              <p className="font-bold mb-2">Subasta judicial</p>
              <ul className="text-sm text-slate-700 space-y-1">
                <li>Precio entre 30% y 70% inferior</li>
                <li>Mayor complejidad jurídica</li>
                <li>Posibles cargas y ocupantes</li>
              </ul>
            </div>
          </div>

          <h3 className="text-2xl font-semibold text-slate-900 mt-10 mb-6">Errores frecuentes que arruinan inversiones</h3>
          <ul className="space-y-4 mb-8 text-slate-700">
            <li className="flex items-start gap-3">
              <span className="bg-red-100 text-red-600 font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">1</span>
              <span><strong>No inspeccionar las cargas previas:</strong> Pujar sin conocer las deudas anteriores que deberás asumir y que no se cancelan tras tu adjudicación. Aprende a investigarlas en <Link to={ROUTES.CHARGES} className="text-brand-600 font-medium hover:underline">nuestra guía de cargas procesales</Link>.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-red-100 text-red-600 font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">2</span>
              <span><strong>Olvidarse de ocupantes o arrendatarios:</strong> El proceso de desalojo toma tiempo y dinero adicional en abogados. Calcula un mínimo de 6-12 meses extra consultando el <Link to={ROUTES.OCCUPIED} className="text-brand-600 font-medium hover:underline">protocolo de ocupación en subastas</Link>.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="bg-red-100 text-red-600 font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">3</span>
              <span><strong>Pasión irracional en las pujas:</strong> Dejar que la adrenalina gane la batalla. Si buscas maximizar el ROI, te recomendamos leer nuestra <Link to={ROUTES.PROFITABILITY} className="text-brand-600 font-medium hover:underline">guía completa de rentabilidad en subastas judiciales</Link>. Tu número final debe ser inquebrantable. Nunca subas más por orgullo.</span>
            </li>
          </ul>

          <h3 className="text-2xl font-semibold text-slate-900 mt-12 mb-8 border-b pb-4 border-slate-100">Preguntas Frecuentes (FAQ)</h3>
          
          <div className="space-y-6">
            <details className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-slate-900">
                ¿Cuánto se puede pujar en una subasta?
              </summary>
              <div className="mt-2 text-slate-700 text-sm space-y-2">
                <p>
                  En la mayoría de subastas judiciales en España, los inversores profesionales limitan sus pujas entre el 60% y el 75% del valor de mercado. Este rango permite absorber impuestos, posibles cargas registrales anteriores y costes de reforma sin comprometer la rentabilidad final de la operación.
                </p>
              </div>
            </details>
            
            <details className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-slate-900">
                ¿Cuál es el mínimo para pujar en una subasta judicial?
              </summary>
              <div className="mt-2 text-slate-700 text-sm space-y-2">
                <p>
                  No existe un "suelo" o mínimo legal preestablecido para la puja en sí (salvo los tramos fijados por el juzgado). Puedes pujar 1€ si el sistema lo permite.
                </p>
                <p>
                  Sin embargo, para poder participar, la Ley de Enjuiciamiento Civil exige constituir un depósito previo equivalente al <strong>5% del valor de tasación del bien</strong> (valor a efectos de subasta).
                </p>
              </div>
            </details>
            
            <details className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-slate-900">
                ¿Puedo perder mi fianza del 5% si me adjudico la propiedad?
              </summary>
              <div className="mt-2 text-slate-700 text-sm space-y-2">
                <p>
                  Rotundamente sí. Este es uno de los mayores riesgos. Pierdes la fianza entera (lo que se conoce técnicamente como "quiebra de la subasta") si, una vez que te declaran mejor postor, no procedes a rematar y pagar el resto del importe acordado.
                </p>
                <p>
                  El plazo límite para abonar el remate suele ser de <strong>40 días hábiles</strong>. Si presentas problemas para conseguir la hipoteca o financiación en ese estricto plazo, el juzgado retendrá tu fianza para cubrir los gastos de la subasta fallida y posibles perjuicios.
                </p>
              </div>
            </details>
            
            <details className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-slate-900">
                ¿Qué ocurre si quedan deudas con la comunidad de vecinos?
              </summary>
              <div className="mt-2 text-slate-700 text-sm space-y-2">
                <p>
                  La Ley de Propiedad Horizontal española establece lo que se llama "afección real" sobre la vivienda. Al comprar en subasta, te conviertes automáticamente en el responsable directo de abonar la deuda de la comunidad de propietarios del <strong>año en curso de la adjudicación, más los tres años naturales inmediatamente anteriores</strong> (cuotas ordinarias y extraordinarias).
                </p>
              </div>
            </details>
            
            <details className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-slate-900">
                ¿Cuánto dinero necesito tener en efectivo para comprar en una subasta?
              </summary>
              <div className="mt-2 text-slate-700 text-sm space-y-2">
                <p>
                  Es crucial contar con liquidez y un margen de seguridad. Debes tener en efectivo y disponible de forma inmediata al menos el 5% del valor de tasación del bien para el depósito de participación. Si resultas ganador, deberás liquidar el importe total restante en 40 días, sumando además entre un 8% y un 12% extra para hacer frente sin aprietos al ITP (o IVA), notaría, registro y cancelación anticipada de IBI.
                </p>
              </div>
            </details>

            <details className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-slate-900">
                ¿Se puede financiar una vivienda comprada en el BOE?
              </summary>
              <div className="mt-2 text-slate-700 text-sm space-y-2">
                <p>
                  Sí, la ley permite expresamente indicar que el remate se pagará mediante financiación hipotecaria. Sin embargo, en la práctica es extremadamente arriesgado y complejo.
                </p>
                <p>
                  La hipoteca se gestiona y firma <em>después</em> de que ganes la subasta, no antes. Estás sujeto a la agilidad del banco para tasarla (lo cual es difícil si hay "okupas" o no tienes acceso) y conceder la hipoteca dentro de los ajustados 40 días que fija el juzgado. Si el banco falla o se retrasa, quebrarás la subasta y perderás tu reserva del 5%.
                </p>
              </div>
            </details>

            <details className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-slate-900">
                ¿Qué pasa si el inmueble tiene cargas previas embargadas?
              </summary>
              <div className="mt-2 text-slate-700 text-sm space-y-2">
                <p>
                  La regla de oro del BOE es: "Las cargas anteriores y preferentes subsisten, y las posteriores se cancelan". Si el inmueble arrastra una hipoteca previa o un embargo de la Seguridad Social inscrito en el Registro de la Propiedad <em>antes</em> que el embargo que motiva la subasta, <strong>el adjudicatario asume íntegramente el pago de esa deuda</strong> subrogándose en ella. Debes descontar ese importe a la hora de calcular tu puja máxima.
                </p>
              </div>
            </details>

            <details className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <summary className="cursor-pointer font-semibold text-slate-900">
                ¿Cuánto tiempo tarda realmente todo el proceso judicial de subasta?
              </summary>
              <div className="mt-2 text-slate-700 text-sm space-y-2">
                <p>
                  El inversor debe contar con paciencia. El ciclo de vida de la inversión suele durar <strong>entre 3 y 8 meses</strong> desde que realizas el pago final y se dicta el decreto de adjudicación (que te da el título de propiedad) hasta que alcanzas la posesión efectiva de las llaves y la inscripción correcta en el Registro. Si la vivienda aloja a terceros ocupantes, arrendatarios u okupas, suma de 6 a 18 meses adicionales al reloj por el procedimiento de desahucio encubierto.
                </p>
              </div>
            </details>
          </div>
          
          <div className="mt-12 p-6 bg-slate-100 rounded-xl border border-slate-200 text-center">
            <p className="text-sm text-slate-500 font-medium mb-1">Aviso de responsabilidad EEAT</p>
            <p className="text-xs text-slate-500">
               Contenido elaborado a partir de análisis real de operaciones en subastas judiciales y administrativas en el territorio español. Esta información no constituye asesoramiento financiero ni jurídico vinculante. Recomendamos encarecidamente contar con asesoría letrada antes de realizar desembolsos económicos en pujas del medio público BOE.
            </p>
          </div>

        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AuctionCalculatorLanding;
