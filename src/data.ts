import { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, increment, deleteDoc } from 'firebase/firestore';

export type StoreType = 'Restaurants' | 'Clothing' | 'Grocery' | 'Pharma' | 'Salon' | 'Electronics' | 'More';

export interface Offer { title: string; description: string; }
export interface MenuItem { name: string; price: string; }

export interface Store {
  id: string; type: StoreType; name: string; photo: string;
  mainOffer: string; address: string; contact: string;
  menu?: MenuItem[]; offers?: Offer[];
}

export interface Analytics { views: number; clicks: Record<string, number>; }

export const getTagline = async (): Promise<string> => {
  try {
    const snap = await getDoc(doc(db, 'system', 'settings'));
    if (snap.exists()) return snap.data().tagline || "Gulbarga's Premier Guide for #1 Offers";
  } catch (e) { console.error(e); }
  return "Gulbarga's Premier Guide for #1 Offers";
};

export const saveTagline = async (tagline: string) => {
  try { await setDoc(doc(db, 'system', 'settings'), { tagline }, { merge: true }); } 
  catch (e) { console.error(e); }
};

export const useTagline = () => {
  const [tagline, setTagline] = useState<string>('');
  useEffect(() => { getTagline().then(setTagline); }, []);
  return { tagline };
};

export const getStores = async (): Promise<Store[]> => {
  try {
    const snap = await getDocs(collection(db, 'stores'));
    const stores: Store[] = [];
    snap.forEach((d) => stores.push({ id: d.id, ...d.data() } as Store));
    return stores;
  } catch (e: any) {
    if (e.code === 'permission-denied') alert("Database Access Denied! Set Firestore Rules to true.");
    throw e;
  }
};

export const saveStores = async (stores: Store[]) => {
  for (const store of stores) await setDoc(doc(db, 'stores', store.id), store);
};

export const deleteStore = async (id: string) => {
  await deleteDoc(doc(db, 'stores', id));
};

export const trackPageView = async () => {
  try { await updateDoc(doc(db, 'system', 'analytics'), { views: increment(1) }); } 
  catch (e) { await setDoc(doc(db, 'system', 'analytics'), { views: 1, clicks: {} }, { merge: true }); }
};

export const trackStoreClick = async (storeId: string) => {
  try { await updateDoc(doc(db, 'system', 'analytics'), { [`clicks.${storeId}`]: increment(1) }); } 
  catch (e) { await setDoc(doc(db, 'system', 'analytics'), { views: 0, clicks: { [storeId]: 1 } }, { merge: true }); }
};

export const getAnalytics = async (): Promise<Analytics> => {
  try {
    const snap = await getDoc(doc(db, 'system', 'analytics'));
    if (snap.exists()) return snap.data() as Analytics;
  } catch (e) { console.error(e); }
  return { views: 0, clicks: {} };
};
