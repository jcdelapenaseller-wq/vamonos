import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useUser } from './UserContext';

interface FavoritesContextType {
  favoritesMap: Record<string, boolean>;
  isLoaded: boolean;
  favoritesCount: number;
  isFavorite: (auctionId: string) => boolean;
  toggleFavorite: (auctionId: string) => Promise<{ success: boolean; limitReached?: boolean }>;
  isToggling: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, plan } = useUser();
  const [favoritesMap, setFavoritesMap] = useState<Record<string, boolean>>({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const fetchFavorites = async () => {
      if (!user?.id || !db) {
        if (mounted) {
          setFavoritesMap({});
          setIsLoaded(true);
        }
        return;
      }

      try {
        const q = query(
          collection(db, 'favorites'),
          where('userId', '==', user.id)
        );
        const snapshot = await getDocs(q);
        
        const newMap: Record<string, boolean> = {};
        snapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.auctionId) {
            newMap[data.auctionId] = true;
          }
        });
        
        if (mounted) {
          setFavoritesMap(newMap);
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        if (mounted) {
          setIsLoaded(true);
        }
      }
    };

    setIsLoaded(false);
    fetchFavorites();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const favoritesCount = Object.keys(favoritesMap).length;
  
  const isFavoriteFn = (auctionId: string) => !!favoritesMap[auctionId];

  const toggleFavorite = async (auctionId: string) => {
    if (!user?.id || !db || isToggling) return { success: false };
    
    setIsToggling(true);
    
    try {
      const isFav = !!favoritesMap[auctionId];

      if (isFav) {
        // Remove all matching docs to prevent duplicates
        const q = query(
          collection(db, 'favorites'),
          where('userId', '==', user.id),
          where('auctionId', '==', auctionId)
        );
        const snapshot = await getDocs(q);
        for (const document of snapshot.docs) {
          await deleteDoc(document.ref);
        }
        
        setFavoritesMap(prev => {
          const newMap = { ...prev };
          delete newMap[auctionId];
          return newMap;
        });
        return { success: true };
      } else {
        // Check limits for free
        if (plan === 'free' && Object.keys(favoritesMap).length >= 3) {
          return { success: false, limitReached: true };
        }
        
        // Prevent duplicate creation
        const existQ = query(
          collection(db, 'favorites'),
          where('userId', '==', user.id),
          where('auctionId', '==', auctionId)
        );
        const existSnap = await getDocs(existQ);
        if (!existSnap.empty) {
          setFavoritesMap(prev => ({ ...prev, [auctionId]: true }));
          return { success: true };
        }
        
        // Add
        await addDoc(collection(db, 'favorites'), {
          userId: user.id,
          auctionId: auctionId,
          createdAt: serverTimestamp()
        });
        
        setFavoritesMap(prev => ({ ...prev, [auctionId]: true }));
        return { success: true };
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      return { success: false };
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favoritesMap, isLoaded, favoritesCount, isFavorite: isFavoriteFn, toggleFavorite, isToggling }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
