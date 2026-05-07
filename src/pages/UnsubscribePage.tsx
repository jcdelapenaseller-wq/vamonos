import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { doc, getDoc, collection, query, where, getDocs, writeBatch } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function UnsubscribePage() {
  const [params] = useSearchParams();
  const uid = params.get("u");
  const token = params.get("t");
  const email = params.get("email");

  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnsubscribing, setIsUnsubscribing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    async function validateToken() {
      if (!uid || !token) {
        setIsValid(false);
        setIsLoading(false);
        return;
      }
      try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists() && userSnap.data()?.unsubscribeToken === token) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        console.error("Error validating unsubscribe token:", error);
        setIsValid(false);
      } finally {
        setIsLoading(false);
      }
    }
    
    validateToken();
  }, [uid, token]);

  const handleUnsubscribe = async () => {
    if (!uid) return;
    
    setIsUnsubscribing(true);
    try {
      const alertsRef = collection(db, "alerts");
      const q = query(alertsRef, where("userId", "==", uid));
      const querySnapshot = await getDocs(q);
      
      const batch = writeBatch(db);
      querySnapshot.forEach((docSnap) => {
        batch.update(docSnap.ref, { active: false });
      });
      
      await batch.commit();
      setIsSuccess(true);
    } catch (error) {
      console.error("Error al desactivar alertas:", error);
      alert("Hubo un error al intentar desactivar las alertas. Por favor, inténtalo de nuevo.");
    } finally {
      setIsUnsubscribing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="bg-white rounded-2xl shadow p-6 max-w-md w-full text-center">
        
        <h1 className="text-xl font-semibold text-slate-900 mb-4">
          Gestión de notificaciones
        </h1>

        {isLoading ? (
          <p className="text-slate-500 text-sm mb-6">
            Validando enlace...
          </p>
        ) : isSuccess ? (
          <p className="text-emerald-600 text-base font-medium mb-2">
            ✔️ Tus alertas han sido desactivadas correctamente
          </p>
        ) : isValid ? (
          <>
            <p className="text-slate-600 text-sm mb-6">
              {email
                ? `Estás gestionando las alertas para ${email}`
                : "Estás gestionando tus alertas"}
            </p>

            <p className="text-emerald-600 text-sm mb-6 font-medium">
              Puedes darte de baja de tus alertas
            </p>

            <button 
              onClick={handleUnsubscribe}
              disabled={isUnsubscribing}
              className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isUnsubscribing ? "Desactivando..." : "Darse de baja"}
            </button>
          </>
        ) : (
          <p className="text-red-600 text-sm mb-6 font-medium">
            Enlace inválido o expirado
          </p>
        )}

      </div>
    </div>
  );
}
