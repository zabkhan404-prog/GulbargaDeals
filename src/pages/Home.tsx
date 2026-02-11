import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, StoreType, getStores, trackPageView } from '../data';
import { Utensils, ShoppingBag, ShoppingCart, Info, Activity, Pill, Scissors, Smartphone, LayoutGrid, Search, Sparkles } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    trackPageView();
    getStores().then((data) => { setStores(data); setLoading(false); });
  }, []);

  // Filter by Category AND Search Query
  const filteredStores = stores.filter(s => {
    const matchesCategory = activeCategory === 'All' || s.type === activeCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.mainOffer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64">
      <Activity className="w-12 h-12 text-rose-950 animate-pulse mb-4" />
      <p className="text-stone-500 font-medium font-serif italic text-lg">Fetching live deals...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      
      {/* Premium Search Bar */}
      <div className="relative mb-8 z-10">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-stone-400" />
        </div>
        <input
          type="text"
          placeholder="Search for restaurants, stores, or offers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-stone-100 rounded-2xl shadow-lg shadow-stone-200/50 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-slate-900 placeholder-stone-400 transition-all font-medium text-base sm:text-lg"
        />
      </div>

      {/* Category Navigation */}
      <div className="flex overflow-x-auto no-scrollbar space-x-3 pb-6 mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
        {categories.map((cat) => (
          <button key={cat.name} onClick={() => setActiveCategory(cat.name)}
            className={`flex flex-col items-center justify-center min-w-[90px] h-24 rounded-2xl transition-all duration-300 shadow-sm border ${activeCategory === cat.name ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-rose-950 font-bold border-amber-300 shadow-amber-400/30 scale-105 shadow-lg' : 'bg-white text-stone-500 font-medium border-stone-100 hover:bg-stone-50'}`}>
            {cat.icon}
            <span className="text-xs uppercase tracking-wider mt-1">{cat.name}</span>
          </button>
        ))}
      </div>
      
      {/* Store Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {filteredStores.map(store => (
          <Link to={`/store/${store.id}`} key={store.id} className="group relative bg-white rounded-3xl overflow-hidden shadow-xl shadow-rose-950/5 border border-stone-100 hover:border-amber-400 hover:shadow-2xl hover:shadow-amber-400/20 transition-all duration-500 transform hover:-translate-y-2 block">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-rose-500 to-amber-400 z-20"></div>
            <div className="relative h-56 overflow-hidden">
              <img src={store.photo} alt={store.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 relative z-10" />
              <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1.5 text-xs font-bold uppercase tracking-widest bg-white/95 backdrop-blur-sm text-rose-950 rounded-md shadow-lg border border-white/20 inline-flex items-center">
                  {store.type}
                </span>
              </div>
            </div>
            <div className="p-6 relative">
              <h3 className="text-2xl font-bold font-serif text-slate-900 mb-1 tracking-tight group-hover:text-rose-950 transition-colors">{store.name}</h3>
              <div className="mt-5 relative">
                <div className="bg-gradient-to-r from-amber-300 to-amber-400 p-4 rounded-xl border border-amber-200 shadow-[0_4px_0_0_rgba(217,119,6,1)] relative overflow-hidden group-hover:shadow-[0_2px_0_0_rgba(217,119,6,1)] group-hover:translate-y-[2px] transition-all">
                  <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-[glint_1.5s_ease-in-out]"></div>
                  <p className="text-rose-950 font-black text-lg leading-tight relative z-10 tabular-nums">{store.mainOffer}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* SMART Empty State */}
      {filteredStores.length === 0 && !loading && (
        <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-stone-200 shadow-sm mt-8 px-6">
          {searchQuery ? (
            <>
              <Search className="w-12 h-12 text-stone-300 mx-auto mb-4" />
              <p className="text-stone-500 font-medium font-serif italic text-xl">No exact matches found.</p>
              <p className="text-stone-400 text-sm mt-2">Try adjusting your search terms to find great deals.</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-amber-500" />
              </div>
              <p className="text-rose-950 font-bold font-serif text-2xl mb-2">Exciting deals coming soon!</p>
              <p className="text-stone-500 text-sm leading-relaxed max-w-sm mx-auto">
                We are currently partnering with top local businesses in the <span className="font-bold text-amber-600">{activeCategory}</span> category. Check back shortly!
              </p>
            </>
          )}
        </div>
      )}

      <style>{`@keyframes glint { 100% { left: 200%; } }`}</style>
    </div>
  );
}
