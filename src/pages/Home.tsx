import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, StoreType, getStores, trackPageView } from '../data';
import { Utensils, ShoppingBag, ShoppingCart, Info, Activity, Pill, Scissors, Smartphone, LayoutGrid } from 'lucide-react';

const categories: { name: StoreType | 'All', icon: React.ReactNode }[] = [
  { name: 'All', icon: <LayoutGrid className="w-5 h-5 mb-1" /> },
  { name: 'Restaurants', icon: <Utensils className="w-5 h-5 mb-1" /> },
  { name: 'Clothing', icon: <ShoppingBag className="w-5 h-5 mb-1" /> },
  { name: 'Grocery', icon: <ShoppingCart className="w-5 h-5 mb-1" /> },
  { name: 'Pharma', icon: <Pill className="w-5 h-5 mb-1" /> },
  { name: 'Salon', icon: <Scissors className="w-5 h-5 mb-1" /> },
  { name: 'Electronics', icon: <Smartphone className="w-5 h-5 mb-1" /> },
  { name: 'More', icon: <Info className="w-5 h-5 mb-1" /> },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<StoreType | 'All'>('All');
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageView();
    getStores().then((data) => { setStores(data); setLoading(false); });
  }, []);

  const filteredStores = activeCategory === 'All' ? stores : stores.filter(s => s.type === activeCategory);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64">
      <Activity className="w-12 h-12 text-rose-950 animate-pulse mb-4" />
      <p className="text-stone-500 font-serif italic text-lg">Fetching live deals...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex overflow-x-auto no-scrollbar space-x-3 pb-6 mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((cat) => (
          <button key={cat.name} onClick={() => setActiveCategory(cat.name)}
            className={`flex flex-col items-center justify-center min-w-[90px] h-24 rounded-2xl transition-all shadow-sm border ${activeCategory === cat.name ? 'bg-amber-400 text-rose-950 font-bold shadow-lg scale-105' : 'bg-white text-stone-500 hover:bg-stone-50'}`}>
            {cat.icon}
            <span className="text-xs uppercase tracking-wider mt-1">{cat.name}</span>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {filteredStores.map(store => (
          <Link to={`/store/${store.id}`} key={store.id} className="group bg-white rounded-3xl overflow-hidden shadow-lg border hover:border-amber-400 hover:shadow-2xl transition-all block">
            <div className="relative h-56 overflow-hidden">
              <img src={store.photo} alt={store.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-4 left-4 z-20"><span className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest bg-white/95 text-rose-950 rounded-full shadow-lg">{store.type}</span></div>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold font-serif text-slate-900 mb-5 group-hover:text-rose-950">{store.name}</h3>
              <div className="bg-amber-300 p-4 rounded-xl border border-amber-200 shadow-md">
                <p className="text-rose-950 font-black text-lg">{store.mainOffer}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
