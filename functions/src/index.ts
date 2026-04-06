import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();
const db = admin.firestore();

export const onAuctionCreate = functions
  .region('europe-west1')
  .runWith({
    timeoutSeconds: 60,
    memory: '256MB'
  })
  .firestore
  .document('auctions/{auctionId}')
  .onCreate(async (snap, context) => {
    const auctionId = context.params.auctionId;
    const auctionData = snap.data();

    functions.logger.info(`[INICIO] Procesando nueva subasta: ${auctionId}`);

    // 5. Control concurrencia: comprobar que auction.isNew === true
    if (auctionData.isNew !== true) {
      functions.logger.info(`[SKIP] Subasta ${auctionId} no es nueva (isNew: ${auctionData.isNew}). Saltando.`);
      return null;
    }

    try {
      const auctionProvince = auctionData.province || '';
      const auctionType = (auctionData.propertyType || '').toLowerCase();
      const auctionCity = (auctionData.city || '').toLowerCase();
      const auctionZone = (auctionData.zone || '').toLowerCase();
      const auctionPrice = auctionData.appraisalValue || 0;

      // 3. Optimizar: NO leer todas las alertas
      // En el schema actual, la provincia se guarda en el campo 'city' de la alerta
      const alertsSnapshot = await db.collectionGroup('alerts')
        .where('active', '==', true)
        .where('city', '==', auctionProvince)
        .get();

      functions.logger.info(`[INFO] Alertas encontradas para provincia '${auctionProvince}': ${alertsSnapshot.size}`);

      if (alertsSnapshot.empty) {
        functions.logger.info(`[FIN] No hay alertas activas para la provincia ${auctionProvince}.`);
        // Actualizar subasta aunque no haya matches
        await snap.ref.update({
          isNew: false,
          matchedAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return null;
      }

      let matchCount = 0;
      let skipCount = 0;

      // 4. Limitar batch writes (máx 500 operaciones)
      let batch = db.batch();
      let batchCount = 0;

      for (const doc of alertsSnapshot.docs) {
        const alertData = doc.data();
        const alertId = doc.id;
        const userId = doc.ref.parent.parent?.id;

        if (!userId) continue;

        // propertyType (si existe y no es 'Todos')
        const alertType = (alertData.propertyType || '').toLowerCase();
        if (alertType && alertType !== 'todos' && alertType !== auctionType) {
          continue;
        }

        // city/zone (si existe en la alerta)
        const alertZone = (alertData.zone || '').toLowerCase();
        if (alertZone) {
          // Comprobar si coincide con el municipio (city) o la zona de la subasta
          if (auctionCity !== alertZone && auctionZone !== alertZone) {
            continue;
          }
        }

        // minPrice/maxPrice
        const minPrice = alertData.minPrice || 0;
        const maxPrice = alertData.maxPrice || 100000000;
        if (auctionPrice < minPrice || auctionPrice > maxPrice) {
          continue;
        }

        // 6. Mantener dedupeKey
        const dedupeKey = `${userId}_${auctionId}`;
        
        // Evitar duplicados: verificar si ya existe en la cola
        const queueRef = db.collection('notifications_queue').doc(dedupeKey);
        const queueDoc = await queueRef.get();

        if (queueDoc.exists) {
          skipCount++;
          continue;
        }

        // Añadir al batch
        batch.set(queueRef, {
          userId,
          alertId,
          auctionId,
          status: 'pending',
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          dedupeKey
        });

        matchCount++;
        batchCount++;

        // Si supera el límite, dividir batches (usamos 499 por seguridad)
        if (batchCount === 499) {
          await batch.commit();
          batch = db.batch(); // Iniciar un nuevo batch
          batchCount = 0;
        }
      }

      // Ejecutar el resto del batch
      if (batchCount > 0) {
        await batch.commit();
      }

      // 5. Control concurrencia: update auction después de procesar
      await snap.ref.update({
        isNew: false,
        matchedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // 7. Logs finales
      functions.logger.info(`[FIN] Proceso completado para ${auctionId}. Creadas: ${matchCount}. Duplicadas (saltadas): ${skipCount}.`);
      return null;

    } catch (error) {
      functions.logger.error(`[ERROR] Procesando alertas para la subasta ${auctionId}:`, error);
      return null;
    }
  });

export const onNotificationQueueCreate = functions
  .region('europe-west1')
  .runWith({
    timeoutSeconds: 30,
    memory: '256MB'
  })
  .firestore
  .document('notifications_queue/{id}')
  .onCreate(async (snap, context) => {
    const notificationId = context.params.id;
    const notificationData = snap.data();

    functions.logger.info(`[INICIO] Procesando notificación en cola: ${notificationId}`);

    // 1. Lock optimista antes de enviar
    if (notificationData.status !== 'pending') {
      functions.logger.info(`[SKIP] Notificación ${notificationId} no está pendiente (status: ${notificationData.status}).`);
      return null;
    }

    try {
      await snap.ref.update({
        status: 'processing',
        processingAt: admin.firestore.FieldValue.serverTimestamp()
      });
      functions.logger.info(`[LOCK] Notificación ${notificationId} marcada como processing.`);

      const { userId, auctionId } = notificationData;

      // 3. Leer subasta
      const auctionDoc = await db.collection('auctions').doc(auctionId).get();
      if (!auctionDoc.exists) {
        throw new Error(`Subasta ${auctionId} no encontrada.`);
      }
      const auction = auctionDoc.data()!;

      // 4. Leer usuario
      const userDoc = await db.collection('users').doc(userId).get();
      if (!userDoc.exists) {
        throw new Error(`Usuario ${userId} no encontrado.`);
      }
      const user = userDoc.data()!;

      // 1. Soporte para flags opcionales (push por defecto true, email por defecto false)
      const shouldPush = notificationData.push !== false;
      const shouldEmail = notificationData.email === true;

      // 2. Lógica Push Actual
      if (shouldPush) {
        if (user.pushToken) {
          functions.logger.info(`[PUSH] Enviando notificación push al usuario ${userId}`);
          // Aquí iría el envío real de FCM en el futuro
        } else {
          functions.logger.info(`[SKIP] Usuario ${userId} sin pushToken.`);
        }
      }

      // 3. Lógica Email (Placeholder + MailerLite actual)
      if (shouldEmail) {
        functions.logger.info(`EMAIL_PENDING ${notificationData.type || 'alert'} ${userId}`);
        
        const userEmail = user.email;
        if (!userEmail) {
          throw new Error(`Usuario ${userId} no tiene email configurado.`);
        }

        const mailerliteApiKey = process.env.MAILERLITE_API_KEY || functions.config().mailerlite?.key;
        if (!mailerliteApiKey) {
          throw new Error('MAILERLITE_API_KEY no configurada en el entorno.');
        }

        const emailPayload = {
          subject: `Nueva subasta detectada: ${auction.propertyType} en ${auction.city}`,
          from: "alertas@activosoffmarket.es",
          from_name: "Alertas Off-Market",
          to: userEmail,
          content: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #0f172a;">Nueva oportunidad detectada</h2>
              <p>Hola,</p>
              <p>Hemos encontrado una nueva subasta que coincide con tus filtros de búsqueda:</p>
              <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><strong>Tipo:</strong> ${auction.propertyType}</p>
                <p><strong>Ubicación:</strong> ${auction.city} (${auction.province})</p>
                <p><strong>Valor Tasación:</strong> ${auction.appraisalValue ? auction.appraisalValue.toLocaleString('es-ES') + '€' : 'Consultar'}</p>
              </div>
              <a href="https://activosoffmarket.es/subasta/${auction.slug}" 
                 style="display: inline-block; background: #1d4ed8; color: white; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                 Ver detalles de la subasta
              </a>
            </div>
          `
        };

        const checkDoc = await snap.ref.get();
        if (checkDoc.data()?.status !== 'processing') {
          functions.logger.warn(`[ABORT] Notificación ${notificationId} cambió de estado antes de enviar (status: ${checkDoc.data()?.status}).`);
          return null;
        }

        const ENABLE = functions.config().alerts?.enabled === "true";
        if (!ENABLE) {
          functions.logger.info("[SKIP] alerts disabled via config");
          await snap.ref.update({
            status: 'skipped_test',
            skippedAt: admin.firestore.FieldValue.serverTimestamp()
          });
          return null;
        }

        const response = await fetch('https://connect.mailerlite.com/api/emails/transactional', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${mailerliteApiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(emailPayload),
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`Error MailerLite (${response.status}): ${errorData}`);
        }
      }

      // 2. Después enviar OK
      await snap.ref.update({
        status: 'sent',
        sent: true,
        sentAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // 5. Logs: enviado
      functions.logger.info(`[SENT] Email enviado con éxito a ${userEmail} para subasta ${auctionId}`);
      return null;

    } catch (error: any) {
      // 3. Si error
      const currentRetryCount = notificationData.retryCount || 0;
      const newRetryCount = currentRetryCount + 1;
      const newStatus = newRetryCount >= 3 ? 'dead' : 'failed';

      // 5. Logs: error
      functions.logger.error(`[${newStatus.toUpperCase()}] Fallo al enviar notificación ${notificationId}:`, error);
      
      await snap.ref.update({
        status: newStatus,
        error: error.message || 'Error desconocido',
        retryCount: newRetryCount,
        failedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return null;
    }
  });
