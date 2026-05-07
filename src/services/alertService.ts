import { db, auth, updateLastActiveAt } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, serverTimestamp, updateDoc, getDoc } from 'firebase/firestore';

export interface AlertData {
  id?: string;
  userId: string;
  email: string;
  province: string;
  municipality: string;
  propertyType: string;
  plan: string;
  active: boolean;
  createdAt?: any;
}

export const alertService = {
  async createAlert(data: Omit<AlertData, 'userId' | 'createdAt' | 'active' | 'id'>) {
    console.log("AUTH USER (createAlert):", auth.currentUser);
    console.log("AUTH UID (createAlert):", auth.currentUser?.uid);
    if (!auth.currentUser || !auth.currentUser.uid) throw new Error("Usuario no autenticado");
    
    if (!data.email || !data.province || !data.propertyType) {
      throw new Error("Faltan datos obligatorios para la alerta");
    }

    const uid = auth.currentUser.uid;
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    const userPlan = userDoc.exists() ? (userDoc.data().plan || 'free') : 'free';

    const alertsRef = collection(db, 'alerts');
    const q = query(alertsRef, where('userId', '==', uid));
    const snapshot = await getDocs(q);
    const currentAlertsCount = snapshot.size;

    let limit = 1;
    if (userPlan === 'basic') limit = 3;
    if (userPlan === 'pro') limit = 5;

    if (currentAlertsCount >= limit) {
      throw new Error(`Límite alcanzado: Tu plan ${userPlan.toUpperCase()} permite un máximo de ${limit} alerta(s)`);
    }

    const docRef = await addDoc(alertsRef, {
      userId: uid,
      email: data.email,
      province: data.province,
      municipality: data.municipality || '',
      propertyType: data.propertyType,
      plan: userPlan,
      active: true,
      createdAt: serverTimestamp()
    });
    
    // Update user's lastActiveAt
    updateLastActiveAt(auth.currentUser.uid).catch(console.error);
    
    return docRef.id;
  },

  async getUserAlerts() {
    console.log("AUTH USER (getUserAlerts):", auth.currentUser);
    console.log("AUTH UID (getUserAlerts):", auth.currentUser?.uid);
    if (!auth.currentUser || !auth.currentUser.uid) throw new Error("Usuario no autenticado");

    const alertsRef = collection(db, 'alerts');
    const q = query(alertsRef, where('userId', '==', auth.currentUser.uid));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AlertData[];
  },

  async deleteAlert(alertId: string) {
    if (!auth.currentUser || !auth.currentUser.uid) throw new Error("Usuario no autenticado");
    if (!alertId) throw new Error("ID de alerta no proporcionado");

    const alertRef = doc(db, 'alerts', alertId);
    await deleteDoc(alertRef);
  },

  async updateAlert(alertId: string, data: Partial<AlertData>) {
    if (!auth.currentUser || !auth.currentUser.uid) throw new Error("Usuario no autenticado");
    if (!alertId) throw new Error("ID de alerta no proporcionado");

    const alertRef = doc(db, 'alerts', alertId);
    await updateDoc(alertRef, data);
  },

  async getAlertCount() {
    console.log("AUTH USER (getAlertCount):", auth.currentUser);
    console.log("AUTH UID (getAlertCount):", auth.currentUser?.uid);
    if (!auth.currentUser || !auth.currentUser.uid) return 0;

    const alertsRef = collection(db, 'alerts');
    const q = query(alertsRef, where('userId', '==', auth.currentUser.uid));
    const snapshot = await getDocs(q);
    return snapshot.size;
  }
};
