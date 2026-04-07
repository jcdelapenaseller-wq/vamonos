import { getMessaging, getToken } from 'firebase/messaging';
import { doc, setDoc } from 'firebase/firestore';
import { app, db } from './firebase';

export const requestAndSaveFCMToken = async (userId: string) => {
  console.log("[FCM_DEBUG] FCM request start for user:", userId);
  try {
    console.log("[FCM_DEBUG] 'Notification' in window:", 'Notification' in window);
    if (!('Notification' in window)) {
      console.log('[FCM_DEBUG] This browser does not support desktop notification');
      return;
    }

    console.log("[FCM_DEBUG] Current permission state:", Notification.permission);
    console.log("[FCM_DEBUG] Requesting permission...");
    const permission = await Notification.requestPermission();
    console.log("[FCM_DEBUG] Permission result:", permission);
    
    if (permission === 'granted') {
      console.log("[FCM_DEBUG] Initializing messaging...");
      const messaging = getMessaging(app);
      console.log("[FCM_DEBUG] Getting token...");
      const currentToken = await getToken(messaging);
      
      if (currentToken) {
        const userRef = doc(db, 'users', userId);
        await setDoc(userRef, { fcmToken: currentToken }, { merge: true });
        console.log('[FCM] Token saved successfully.');
      } else {
        console.log('[FCM] No registration token available. Request permission to generate one.');
      }
    } else {
      console.log('[FCM] Notification permission not granted.');
    }
  } catch (error) {
    console.error('[FCM] Error retrieving or saving token:', error);
  }
};
