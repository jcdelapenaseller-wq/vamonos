import { getMessaging, getToken } from 'firebase/messaging';
import { doc, setDoc } from 'firebase/firestore';
import { app, db } from './firebase';

export const requestAndSaveFCMToken = async (userId: string) => {
  try {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification');
      return;
    }

    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      const messaging = getMessaging(app);
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
