import { db, auth, updateLastActiveAt } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, serverTimestamp, updateDoc } from 'firebase/firestore';

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
    
    if (!data.email || !data.province || !data.propertyType || !data.plan) {
      throw new Error("Faltan datos obligatorios para la alerta");
    }

    const alertsRef = collection(db, 'alerts');
    const docRef = await addDoc(alertsRef, {
      userId: auth.currentUser.uid,
      email: data.email,
      province: data.province,
      municipality: data.municipality || '',
      propertyType: data.propertyType,
      plan: data.plan,
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
