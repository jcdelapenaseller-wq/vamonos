import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';
import { AUCTIONS } from '../src/data/auctions';

// Configuración
// const MAILERLITE_API_KEY = process.env.MAILERLITE_API_KEY;
const SENT_ALERTS_FILE = path.join(process.cwd(), 'src/data/sent_alerts.json');

// Initialize Firebase Admin
const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;

if (!admin.apps.length && projectId) {
  try {
    admin.initializeApp({
      projectId: projectId,
    });
  } catch (e) {
    console.error('Firebase Admin Init Error:', e);
  }
}

const db = admin.apps.length ? admin.firestore() : null;

interface SentAlertsData {
  last_run: string;
  sent: Record<string, string[]>; // email -> array of boeIds
}

interface FirestoreAlert {
  id: string;
  uid: string;
  email: string;
  city: string;
  zone?: string;
  propertyType: string;
  minPrice: number;
  maxPrice: number;
  active: boolean;
  plan: 'free' | 'basic' | 'pro';
}

async function fetchFirestoreAlerts(): Promise<FirestoreAlert[]> {
  if (!db) {
    console.error('❌ [NOTIFY] Firestore no inicializado. Verifica PROJECT_ID.');
    return [];
  }

  console.log('🔍 [NOTIFY] Buscando alertas activas en Firestore...');
  const allAlerts: FirestoreAlert[] = [];

  try {
    // Usamos la colección raíz 'alerts'
    const alertsSnapshot = await db.collection('alerts')
      .where('active', '==', true)
      .get();

    console.log(`✅ [NOTIFY] Encontradas ${alertsSnapshot.size} alertas potenciales.`);

    // Para cada alerta, necesitamos el email y el plan del usuario
    const userCache: Record<string, { email: string, plan: 'free' | 'basic' | 'pro' }> = {};

    for (const doc of alertsSnapshot.docs) {
      const alertData = doc.data();
      const uid = alertData.userId;

      if (!uid) continue;

      let userData = userCache[uid];
      if (!userData) {
        const userDoc = await db.collection('users').doc(uid).get();
        if (userDoc.exists) {
          const data = userDoc.data();
          const email = data?.email;
          const plan = (data?.plan?.toLowerCase() as 'free' | 'basic' | 'pro') || 'free';
          if (email) {
            userData = { email, plan };
            userCache[uid] = userData;
          }
        }
      }

      if (userData) {
        allAlerts.push({
          id: doc.id,
          uid,
          email: userData.email,
          plan: userData.plan,
          city: alertData.province || '',
          zone: alertData.municipality || '',
          propertyType: alertData.propertyType || 'Todos',
          minPrice: alertData.minPrice || 0,
          maxPrice: alertData.maxPrice || 10000000,
          active: alertData.active
        });
      }
    }

    console.log(`✅ [NOTIFY] Procesadas ${allAlerts.length} alertas con email válido.`);
    return allAlerts;
  } catch (error) {
    console.error('❌ [NOTIFY] Error al obtener alertas de Firestore:', error);
    return [];
  }
}

function loadSentAlerts(): SentAlertsData {
  if (fs.existsSync(SENT_ALERTS_FILE)) {
    return JSON.parse(fs.readFileSync(SENT_ALERTS_FILE, 'utf-8'));
  }
  return { last_run: new Date(0).toISOString(), sent: {} };
}

function saveSentAlerts(data: SentAlertsData) {
  fs.writeFileSync(SENT_ALERTS_FILE, JSON.stringify(data, null, 2));
}

async function sendAlertEmail(email: string, auction: any, plan: string = 'free') {
  console.log(`📧 [NOTIFY] [SIMULATED] Preparando envío para: ${email} (Plan: ${plan})`);
  console.log(`⚠️ [NOTIFY] MailerLite ha sido desactivado. No se enviará el email.`);
  return false; // Return false to avoid marking as sent if we want to retry later with another provider
  
  /* 
  const isPro = plan.toLowerCase() === 'pro';
  ...
  */
}

async function main() {
  /*
  if (!MAILERLITE_API_KEY) {
    console.error('❌ [NOTIFY] MAILERLITE_API_KEY no configurada.');
    return;
  }
  */

  const alerts = await fetchFirestoreAlerts();
  
  // Ordenar alertas por plan: PRO primero, luego BASIC, luego FREE
  const planOrder = { pro: 0, basic: 1, free: 2 };
  alerts.sort((a, b) => planOrder[a.plan] - planOrder[b.plan]);

  const sentData = loadSentAlerts();
  const auctions = Object.values(AUCTIONS);
  
  // Solo procesamos subastas nuevas (isNew o publicadas después de la última ejecución)
  const lastRunDate = new Date(sentData.last_run);
  const newAuctions = auctions.filter(a => {
    const pubDate = a.publishedAt ? new Date(a.publishedAt) : new Date(0);
    return a.isNew || pubDate > lastRunDate;
  });

  console.log(`📈 [NOTIFY] Procesando ${newAuctions.length} subastas nuevas.`);

  let sentCount = 0;

  for (const alert of alerts) {
    const userEmail = alert.email;
    const userProvincia = alert.city;
    const userTipo = alert.propertyType;
    const userMunicipio = alert.zone;

    if (!userProvincia) continue;

    const userSentList = sentData.sent[userEmail] || [];

    for (const auction of newAuctions) {
      const boeId = auction.boeId || auction.slug;
      if (!boeId) continue;

      // Evitar duplicados
      if (userSentList.includes(boeId)) continue;

      // Matching Logic
      const matchProvincia = auction.province?.toLowerCase() === userProvincia.toLowerCase();
      const matchTipo = userTipo === 'Todos' || auction.propertyType?.toLowerCase() === userTipo?.toLowerCase();
      const matchMunicipio = !userMunicipio || auction.municipality?.toLowerCase() === userMunicipio.toLowerCase();
      
      // Filtro de precio (si aplica)
      const auctionPrice = auction.appraisalValue || 0;
      const matchPrecio = auctionPrice >= alert.minPrice && auctionPrice <= alert.maxPrice;

      if (matchProvincia && matchTipo && matchMunicipio && matchPrecio) {
        const success = await sendAlertEmail(userEmail, auction, alert.plan);
        if (success) {
          userSentList.push(boeId);
          sentCount++;
        }
      }
    }

    sentData.sent[userEmail] = userSentList;
  }

  sentData.last_run = new Date().toISOString();
  saveSentAlerts(sentData);

  console.log(`🏁 [NOTIFY] Proceso finalizado. Alertas enviadas: ${sentCount}`);
}

main().catch(console.error);
