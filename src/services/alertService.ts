import { db, auth } from '../lib/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where, serverTimestamp } from 'firebase/firestore';

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
    const user = auth.currentUser;
    if (!user || !user.uid) throw new Error("Usuario no autenticado");
    
    if (!data.email || !data.province || !data.propertyType || !data.plan) {
      throw new Error("Faltan datos obligatorios para la alerta");
    }

    const alertsRef = collection(db, 'alerts');
    const docRef = await addDoc(alertsRef, {
      userId: user.uid,
      email: data.email,
      province: data.province,
      municipality: data.municipality || '',
      propertyType: data.propertyType,
      plan: data.plan,
      active: true,
      createdAt: serverTimestamp()
    });
    
    return docRef.id;
  },

  async getUserAlerts() {
    const user = auth.currentUser;
    if (!user || !user.uid) throw new Error("Usuario no autenticado");

    const alertsRef = collection(db, 'alerts');
    const q = query(alertsRef, where('userId', '==', user.uid));
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as AlertData[];
  },

  async deleteAlert(alertId: string) {
    const user = auth.currentUser;
    if (!user || !user.uid) throw new Error("Usuario no autenticado");
    if (!alertId) throw new Error("ID de alerta no proporcionado");

    const alertRef = doc(db, 'alerts', alertId);
    await deleteDoc(alertRef);
  },

  async getAlertCount() {
    const user = auth.currentUser;
    if (!user || !user.uid) return 0;

    const alertsRef = collection(db, 'alerts');
    const q = query(alertsRef, where('userId', '==', user.uid));
    const snapshot = await getDocs(q);
    return snapshot.size;
  }
};
