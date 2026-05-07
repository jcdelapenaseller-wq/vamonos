import * as admin from "firebase-admin";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

admin.initializeApp();
const db = admin.firestore();

/* =========================================
   EMAIL HELPER
========================================= */

async function sendEmail(to: string, subject: string, text: string, userId: string, unsubscribeToken: string) {
  const apiKey = process.env.MAILERSEND_API_KEY;
  if (!apiKey) return;

  const footer = `

—
Activos OffMarket

Dejar de recibir emails:
https://activosoffmarket.es/unsubscribe?u=${encodeURIComponent(userId)}&t=${encodeURIComponent(unsubscribeToken)}
`;

  const mailerSend = new MailerSend({ apiKey });

  const sentFrom = new Sender(
    "alerts@activosoffmarket.es",
    "Activos OffMarket"
  );

  const recipients = [new Recipient(to)];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject(subject)
    .setText(text + footer);

  await mailerSend.email.send(emailParams);
}

/* =========================================
   ALERTS -> CREATE NOTIFICATION QUEUE
========================================= */

export const onAuctionCreate = onDocumentCreated(
  "auctions/{auctionId}",
  async (event) => {
    const auction = event.data?.data();
    if (!auction) return;

    const alertsSnap = await db.collectionGroup("alerts").get();
    const usersNotified = new Set<string>();

    for (const doc of alertsSnap.docs) {
      const alert = doc.data();
      if (!alert.userId) continue;

      const keyword = alert.keyword?.toLowerCase?.();
      const title = auction.title?.toLowerCase?.() || "";

      if (keyword && !title.includes(keyword)) continue;

      if (usersNotified.has(alert.userId)) continue;
      usersNotified.add(alert.userId);

      await db.collection("notifications_queue").add({
        userId: alert.userId,
        auctionId: event.params.auctionId,
        type: "alert",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        sent: false
      });
    }
  }
);

/* =========================================
   ON USER CREATE -> INIT ONBOARDING
========================================= */

export const onUserCreate = onDocumentCreated(
  "users/{userId}",
  async (event) => {
    await db.collection("users").doc(event.params.userId).update({
      onboardingStep: 0,
      onboardingCreatedAt: admin.firestore.FieldValue.serverTimestamp(),
      emailNotifications: true
    });
  }
);

/* =========================================
   ONBOARDING SCHEDULER
========================================= */

export const onboardingScheduler = onSchedule(
  "every 60 minutes",
  async () => {
    const now = Date.now();

    const users = await db
      .collection("users")
      .where("onboardingStep", "<", 5)
      .get();

    for (const doc of users.docs) {
      const user = doc.data();

      if (!user.email) continue;
      if (user.emailNotifications === false) continue;
      if (user.plan && user.plan !== "free") continue;
      if (!user.onboardingCreatedAt) continue;

      const created = user.onboardingCreatedAt.toDate().getTime();
      const diff = now - created;

      let send = false;

      if (user.onboardingStep === 0 && diff > 5 * 60 * 1000) send = true;
      if (user.onboardingStep === 1 && diff > 1 * 86400000) send = true;
      if (user.onboardingStep === 2 && diff > 3 * 86400000) send = true;
      if (user.onboardingStep === 3 && diff > 5 * 86400000) send = true;
      if (user.onboardingStep === 4 && diff > 8 * 86400000) send = true;

      if (!send) continue;

      await db.collection("notifications_queue").add({
        userId: doc.id,
        type: "onboarding",
        step: user.onboardingStep,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        sent: false
      });

      await doc.ref.update({
        onboardingStep: user.onboardingStep + 1
      });
    }
  }
);

/* =========================================
   EMAIL SENDER
========================================= */

export const onNotificationQueueCreate = onDocumentCreated(
  {
    document: "notifications_queue/{id}",
    secrets: ["MAILERSEND_API_KEY"]
  },
  async (event) => {
    const data = event.data?.data();
    if (!data) return;

    const userDoc = await db.collection("users").doc(data.userId).get();
    const user = userDoc.data();

    if (!user?.email) return;
    if (user.emailNotifications === false) return;

    let subject = "";
    let text = "";

    /* =========================
       ONBOARDING
    ========================= */

    if (data.type === "onboarding") {

      if (data.step === 0) {
        const name = user.displayName ? user.displayName.split(" ")[0] : "inversor";
        subject = "Empieza bien en subastas (evita este error)";
        text = `Hola, ${name}. Bienvenido a Activos OffMarket.

El error más común en subastas es pujar sin analizar las cargas del activo. Para invertir con seguridad, la información técnica es clave.

Tu cuenta gratuita ya está activa y cuenta con:
• Acceso a subastas analizadas
• Hasta 3 activos favoritos
• 1 alerta personalizada

Empieza a explorar oportunidades reales.

👉 Ver subastas activas:
https://activosoffmarket.es/subastas-recientes`;
      }

      if (data.step === 1) {
        const name = user.displayName ? user.displayName.split(" ")[0] : "inversor";
        subject = "Llega antes a las oportunidades de inversión";
        text = `Hola, ${name}.

En subastas, acceder a la información antes que el resto es clave para asegurar una buena inversión. Analizamos el BOE a diario para darte esta ventaja.

Activa una alerta para recibir notificaciones automáticas solo con los activos que encajen en tus criterios. Tu cuenta gratuita incluye 1 alerta.

👉 Crear tu primera alerta ahora:
https://activosoffmarket.es/alertas-subastas`;
      }

      if (data.step === 2) {
        const name = user.displayName ? user.displayName.split(" ")[0] : "inversor";
        subject = "El riesgo oculto de las subastas (y cómo evitarlo)";
        text = `Hola, ${name}.

Un error muy frecuente al invertir en subastas es pujar sin entender las cargas del inmueble. Debes saber que, como adjudicatario, asumes las cargas anteriores; esto significa que un activo puede esconder miles de euros en deudas.

Es un riesgo económico real que puede convertir una gran oportunidad en una pérdida patrimonial. Para proteger tu capital, la revisión técnica del expediente no es opcional.

👉 Ver checklist antes de pujar:
https://www.activosoffmarket.es/checklist-subastas`;
      }

      if (data.step === 3) {
        const name = user.displayName ? user.displayName.split(" ")[0] : "inversor";
        subject = "Cómo analizar subastas sin ser experto jurídico";
        text = `Hola, ${name}.

Ya conoces el riesgo de pujar a ciegas. Ahora llega la solución: analizar a fondo el expediente antes de invertir.

No necesitas ser un experto legal para participar con seguridad. Nuestra plataforma simplifica la revisión técnica, analizando las cargas automáticamente y ofreciéndote claridad para que puedas decidir si el activo vale la pena.

👉 Analizar una subasta ahora:
https://activosoffmarket.es/subastas-recientes`;
      }

      if (data.step === 4) {
        const name = user.displayName ? user.displayName.split(" ")[0] : "inversor";

        if (!user.plan || user.plan === "free") {
          subject = "Da el siguiente paso en tus inversiones";
          text = `Hola, ${name}.

Ya estás usando la plataforma. Para invertir con ventaja real frente a otros inversores, necesitas acceso completo.

Con los planes superiores podrás:
- Crear más alertas
- Analizar más subastas
- Tomar decisiones con mayor seguridad

👉 Ver planes disponibles:
https://activosoffmarket.es/pro`;
        } else {
          subject = "Aprovecha al máximo la plataforma";
          text = `Hola, ${name}.

Ya tienes acceso a herramientas avanzadas. La clave ahora es utilizarlas con constancia para detectar oportunidades antes que el resto.

Revisa nuevas subastas y aplica análisis antes de tomar decisiones.

👉 Ver subastas activas:
https://activosoffmarket.es/subastas-recientes`;
        }
      }
    }

    /* =========================
       PLAN ACTIVATED
    ========================= */

    if (data.type === "plan_activated") {
      const name = user.displayName ? user.displayName.split(" ")[0] : "inversor";
      const planName = data.plan === "pro" ? "PRO" : "BASIC";

      subject = `Plan ${planName} activado correctamente`;
      text = `Hola, ${name}.

Tu plan ${planName} ya está activo.

Ya puedes:
- Crear más alertas
- Analizar más subastas
- Acceder a herramientas avanzadas

👉 Ir a tu cuenta:
https://activosoffmarket.es/mi-cuenta`;
    }

    /* =========================
       PLAN CANCELED
    ========================= */

    if (data.type === "plan_canceled") {
      const name = user.displayName ? user.displayName.split(" ")[0] : "inversor";

      subject = "Tu suscripción ha sido cancelada";
      text = `Hola, ${name}.

Hemos confirmado la cancelación de tu suscripción.

Seguirás teniendo acceso hasta el final del periodo ya pagado.

Si en el futuro quieres volver, tu cuenta seguirá disponible.

👉 Ver tu cuenta:
https://activosoffmarket.es/mi-cuenta`;
    }

    /* =========================
       ALERT EMAIL
    ========================= */

    if (data.type === "alert") {
      let auction: any = null;

      if (data.auctionId) {
        const auctionDoc = await db
          .collection("auctions")
          .doc(data.auctionId)
          .get();

        auction = auctionDoc.data();
      }

      const title = auction?.title || "Nueva subasta";
      const price = auction?.price || "";
      const city = auction?.city || "";

      subject = `Nueva subasta: ${title}`;

      text = `${title}

${price ? "Precio: " + price : ""}
${city ? "Ubicación: " + city : ""}

https://activosoffmarket.es/subasta/${data.auctionId}`;
    }

    try {
      await sendEmail(user.email, subject, text, data.userId, user.unsubscribeToken || "");

      await db
        .collection("notifications_queue")
        .doc(event.params.id)
        .update({ sent: true });

    } catch (e) {
      console.error("email error", e);
    }
  }
);
