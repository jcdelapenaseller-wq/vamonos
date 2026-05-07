import fs from 'fs';
import path from 'path';
import admin from 'firebase-admin';
import { AUCTIONS } from '../src/data/auctions';

// Initialization code
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
          plan: userData.plan, // Usamos userData.plan recogido en tiempo real
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

import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

// Usar MAILERSEND_API_KEY
const MAILERSEND_API_KEY = process.env.MAILERSEND_API_KEY || '';

async function sendAlertEmail(email: string, auction: any, plan: string = 'free') {
  console.log(`📧 [NOTIFY] Preparando envío para: ${email} (Plan: ${plan})`);
  
  if (!MAILERSEND_API_KEY) {
    console.error(`⚠️ [NOTIFY] MAILERSEND_API_KEY no configurada. No se enviará el email a ${email}.`);
    return false;
  }

  const mailerSend = new MailerSend({
    apiKey: MAILERSEND_API_KEY,
  });

  const sentFrom = new Sender(process.env.FROM_EMAIL || "alerts@activosoffmarket.es", "Alertas Off-Market");
  const recipients = [new Recipient(email)];
  
  const isPro = plan.toLowerCase() === 'pro';
  const prefix = isPro ? '⚡ [PRO] ' : '';

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject(`${prefix}Nueva subasta en ${auction.province || 'tu zona'}`)
    .setText(`Nueva subasta detectada

Tipo: ${auction.propertyType || 'Desconocido'}
Municipio: ${auction.municipality || auction.city || 'Desconocido'}
Valor Tasación: ${auction.appraisalValue ? auction.appraisalValue.toLocaleString('es-ES') + '€' : 'Consultar'}

━━━━━━━━━━━━━━━━━━
VER SUBASTAS RECIENTES
https://activosoffmarket.es/subasta/${auction.slug || auction.boeId}
━━━━━━━━━━━━━━━━━━

—
Activos OffMarket
Preferencias:
https://activosoffmarket.es/mis-alertas`);

  try {
    await mailerSend.email.send(emailParams);
    console.log(`✅ [NOTIFY] Email enviado con éxito a: ${email}`);
    return true;
  } catch (error) {
    console.error(`❌ [NOTIFY] Error al enviar email a ${email}:`, error);
    return false;
  }
}

async function main() {
  if (!MAILERSEND_API_KEY) {
    console.warn('⚠️ [NOTIFY] MAILERSEND_API_KEY no configurada. Los correos no se enviarán pero el script se ejecutará.');
  }

  const alerts = await fetchFirestoreAlerts();
  
  // Ordenar alertas por plan: PRO primero, luego BASIC, luego FREE
  const planOrder = { pro: 0, basic: 1, free: 2 };
  alerts.sort((a, b) => planOrder[a.plan] - planOrder[b.plan]);

  // Aplicar límites por usuario basados en su plan (Free: 1, Basic: 3, Pro: 5)
  const userAlertCount: Record<string, number> = {};
  const limitedAlerts: typeof alerts = [];
  const planLimits = { free: 1, basic: 3, pro: 5 };

  for (const alert of alerts) {
    if (!userAlertCount[alert.uid]) userAlertCount[alert.uid] = 0;
    
    // El límite se aplica en base al plan extraído en tiempo real desde `users` collection
    const limit = planLimits[alert.plan] || 1;
    if (userAlertCount[alert.uid] < limit) {
      limitedAlerts.push(alert);
      userAlertCount[alert.uid]++;
    } else {
      console.log(`⚠️ [NOTIFY] Límite en envío saltado para: ${alert.email} (Plan: ${alert.plan}, Límite: ${limit})`);
    }
  }

  const auctions = Object.values(AUCTIONS);
  
  // Procesamos todas las subastas (nuevas y no tan nuevas), o si queremos filtrar por isNew podemos mantenerlo
  const newAuctions = auctions.filter(a => a.isNew);

  console.log(`📈 [NOTIFY] Procesando ${newAuctions.length} subastas nuevas.`);

  let sentCount = 0;

  for (const alert of limitedAlerts) {
    const userEmail = alert.email;
    const userId = alert.uid;
    const userProvincia = alert.city;
    const userTipo = alert.propertyType;
    const userMunicipio = alert.zone;

    if (!userProvincia) continue;

    for (const auction of newAuctions) {
      const boeId = auction.boeId || auction.slug;
      if (!boeId) continue;

      // 1. Evitar duplicados consultando Firestore (userId + auctionId)
      const docId = `${userId}_${boeId}`;
      const sentAlertRef = db.collection('sent_alerts').doc(docId);
      const docSnap = await sentAlertRef.get();
      
      if (docSnap.exists) {
        continue; // Ya enviamos esta alerta a este usuario
      }

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
          // Guardar registro de envío
          await sentAlertRef.set({
            userId,
            auctionId: boeId,
            sentAt: admin.firestore.FieldValue.serverTimestamp()
          });
          sentCount++;
        }
      }
    }
  }

  console.log(`🏁 [NOTIFY] Proceso finalizado. Alertas enviadas: ${sentCount}`);
}

main().catch(console.error);
