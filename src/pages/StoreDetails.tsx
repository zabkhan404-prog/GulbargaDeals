import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Store, getStores, trackStoreClick } from '../data';
import { ArrowLeft, MapPin, Phone, Flame, Utensils } from 'lucide-react';

export default function StoreDetails() {
  const { id } = useParams();
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      trackStoreClick(id);
      getStores().then((stores) => { setStore(stores.find(s => s.id === id) || null); setLoading(false); });
    }
  }, [id]);

  if (loading) return <div className="p-20 text-center font-serif text-xl italic text-stone-500">Loading premium deal...</div>;
  if (!store) return <div className="p-20 text-center text-xl">Deal Not Found. <Link to="/" className="text-amber-500">Go Back</Link></div>;

  return (
    <div className="bg-stone-50 min-h-screen pb-20">
      <div className="relative h-80 w-full">
        <img src={store.photo} className="w-full h-full object-cover" />
        <Link to="/" className="absolute top-6 left-6 flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-amber-400 shadow-lg"><ArrowLeft className="w-5 h-5" /></Link>
      </div>
      <div className="max-w-3xl mx-auto px-4 -mt-20 relative z-20">
        <div className="bg-white rounded-3xl p-8 shadow-2xl mb-8">
          <div className="inline-block px-3 py-1 bg-rose-100 text-rose-950 rounded-full text-xs font-bold uppercase mb-4">{store.type}</div>
          <h1 className="text-4xl font-black font-serif text-slate-900 mb-6">{store.name}</h1>
          <div className="flex flex-col sm:flex-row gap-4 mb-8 text-stone-600">
            <div className="flex items-center"><MapPin className="w-5 h-5 text-amber-500 mr-2" /> <span className="text-sm font-medium">{store.address}</span></div>
            <div className="flex items-center"><Phone className="w-5 h-5 text-amber-500 mr-2" /> <span className="text-sm font-medium">{store.contact}</span></div>
          </div>
          <div className="bg-rose-950 rounded-2xl p-6 shadow-lg text-center">
            <h3 className="text-amber-400 font-bold uppercase tracking-widest text-xs mb-2">Featured Deal</h3>
            <p className="text-white text-3xl font-black">{store.mainOffer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
