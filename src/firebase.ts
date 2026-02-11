import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDfQInzm-3Fw87aZzAOk4GVlhwZBM8Lwrw",
  authDomain: "gulbarga-deals.firebaseapp.com",
  projectId: "gulbarga-deals",
  storageBucket: "gulbarga-deals.firebasestorage.app",
  messagingSenderId: "337803433531",
  appId: "1:337803433531:web:c212c07f8494b9bc3dee1e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
