import admin from 'firebase-admin';

// Inicializar admin si no está inicializado
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

async function runTest() {
  const auctionId = 'TEST_AUCTION_' + Date.now();
  const userId = 'testUser';
  const alertId = 'TEST_ALERT_' + Date.now();
  const dedupeKey = `${userId}_${auctionId}`;

  console.log('--- INICIANDO TEST DE FLUJO DE ALERTAS ---');

  // 1. Crear subasta test en auctions
  await db.collection('auctions').doc(auctionId).set({
    isNew: true,
    province: "Madrid",
    city: "Madrid",
    propertyType: "piso",
    appraisalValue: 100000,
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });
  console.log(`[1] Subasta creada: ${auctionId}`);

  // 2. Crear alerta test en users/testUser/alerts
  await db.collection('users').doc(userId).collection('alerts').doc(alertId).set({
    active: true,
    city: "Madrid",
    propertyType: "piso",
    minPrice: 50000,
    maxPrice: 200000
  });
  console.log(`[2] Alerta creada: ${alertId}`);

  // 3. Esperar 5s
  console.log('[3] Esperando 5s para que las funciones se ejecuten...');
  await new Promise(resolve => setTimeout(resolve, 5000));

  // 4. Verificar notifications_queue/{userId_auctionId}
  const queueDoc = await db.collection('notifications_queue').doc(dedupeKey).get();

  if (queueDoc.exists) {
    const data = queueDoc.data();
    console.log(`[4] Status encontrado: ${data?.status}`);
    
    // 5. Verificar status == skipped_test
    if (data?.status === 'skipped_test') {
      console.log('TEST PASADO');
    } else {
      console.log('TEST FALLIDO: Status incorrecto. Esperado: skipped_test, Obtenido: ' + data?.status);
    }
  } else {
    console.log('TEST FALLIDO: No se encontró notificación en la cola para la clave: ' + dedupeKey);
  }
}

runTest().catch((err) => {
  console.error('Error en el test:', err);
  process.exit(1);
});
