import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Store, getStores, trackStoreClick } from '../data';
import { ArrowLeft, MapPin, Phone, Flame, Utensils, Info, Image as ImageIcon } from 'lucide-react';

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

  if (loading) return <div className="flex flex-col items-center justify-center h-screen bg-stone-50"><div className="w-12 h-12 border-4 border-amber-400 border-t-rose-950 rounded-full animate-spin mb-4"></div><p className="text-stone-500 font-serif italic text-xl">Loading premium deal...</p></div>;
  if (!store) return <div className="max-w-4xl mx-auto px-4 py-16 text-center"><Info className="w-16 h-16 text-stone-300 mx-auto mb-4" /><h2 className="text-3xl font-serif text-rose-950 mb-4">Deal Not Found</h2><Link to="/" className="text-amber-600 font-bold uppercase">&larr; Return to Guide</Link></div>;

  return (
    <div className="bg-stone-50 min-h-screen pb-20">
      <div className="relative h-80 md:h-96 w-full">
        <div className="absolute inset-0 bg-stone-900/40 z-10"></div>
        <img src={store.photo} className="w-full h-full object-cover" />
        <Link to="/" className="absolute top-6 left-6 z-20 flex items-center justify-center w-10 h-10 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-amber-400 shadow-lg border border-white/30"><ArrowLeft className="w-5 h-5" /></Link>
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-32 relative z-20">
        <div className="bg-white rounded-3xl p-8 shadow-2xl shadow-rose-950/10 border border-stone-100 mb-8">
          <div className="inline-block px-3 py-1 bg-rose-100 text-rose-950 rounded-md text-xs font-bold uppercase tracking-widest mb-4 border border-rose-200">{store.type}</div>
          <h1 className="text-4xl md:text-5xl font-black font-serif text-slate-900 mb-6">{store.name}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center text-stone-600 gap-4 mb-8">
            <div className="flex items-center"><MapPin className="w-5 h-5 text-amber-500 mr-2 shrink-0" /><span className="text-sm font-medium">{store.address}</span></div>
            <div className="hidden sm:block text-stone-300">|</div>
            <div className="flex items-center"><Phone className="w-5 h-5 text-amber-500 mr-2 shrink-0" /><span className="text-sm font-medium tabular-nums">{store.contact}</span></div>
          </div>
          <div className="bg-gradient-to-r from-rose-950 to-rose-900 rounded-2xl p-6 shadow-lg relative overflow-hidden border border-rose-800">
            <h3 className="text-amber-400 font-bold uppercase tracking-widest text-xs mb-2 relative z-10">Featured Deal</h3>
            <p className="text-white text-2xl md:text-3xl font-black tabular-nums relative z-10">{store.mainOffer}</p>
          </div>
        </div>

        {/* NEW: MENU IMAGES SECTION */}
        {store.menuImages && store.menuImages.length > 0 && (
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-stone-200/50 border border-stone-100 mb-8">
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-8 flex items-center">
              <ImageIcon className="w-6 h-6 text-amber-500 mr-3" /> Menu
            </h3>
            <div className="space-y-4">
              {store.menuImages.map((img, idx) => (
                <div key={idx} className="border-2 border-stone-200 rounded-xl overflow-hidden hover:border-amber-300 transition-all">
                  <img 
                    src={img} 
                    alt={`Menu page ${idx + 1}`} 
                    className="w-full h-auto object-contain cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => window.open(img, '_blank')}
                  />
                </div>
              ))}
            </div>
            <p className="text-xs text-stone-500 text-center mt-4 italic">Click on menu images to view full size</p>
          </div>
        )}

        {store.menu && store.menu.length > 0 && (
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-stone-200/50 border border-stone-100 mb-8">
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-8 flex items-center"><Utensils className="w-6 h-6 text-amber-500 mr-3" /> Exclusive Menu</h3>
            <div className="space-y-6">
              {store.menu.map((item, idx) => (
                <div key={idx} className="flex justify-between items-end group">
                  <div className="flex-grow"><h4 className="text-lg font-bold text-stone-800 group-hover:text-rose-950">{item.name}</h4><div className="h-px bg-stone-200 mt-2 w-full border-b border-dashed border-stone-300"></div></div>
                  <div className="ml-4 flex-shrink-0"><span className="text-xl font-black text-amber-600 tabular-nums">{item.price}</span></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {store.offers && store.offers.length > 0 && (
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-stone-200/50 border border-stone-100 mb-8">
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-8 flex items-center"><Flame className="w-6 h-6 text-amber-500 mr-3" /> Current Offers</h3>
            <div className="grid gap-6">
              {store.offers.map((offer, idx) => (
                <div key={idx} className="bg-stone-50 rounded-2xl p-5 border border-stone-100 hover:border-amber-200 hover:shadow-md transition-all">
                  <h4 className="text-lg font-bold text-rose-950 mb-2">{offer.title}</h4>
                  <p className="text-stone-600 text-sm">{offer.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
      }
