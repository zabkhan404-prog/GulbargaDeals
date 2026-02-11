import React, { useState, useEffect } from 'react';
import { Store, StoreType, getStores, saveStores, deleteStore, getAnalytics, Analytics, getTagline, saveTagline } from '../data';
import { LayoutDashboard, Lock, Plus, Edit2, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, AlertTriangle } from 'lucide-react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({ views: 0, clicks: {} });
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [tagline, setTagline] = useState('');
  const [dbLockedError, setDbLockedError] = useState(false);

  useEffect(() => { if (isAuthenticated) fetchData(); }, [isAuthenticated]);

  const fetchData = async () => {
    try { setStores(await getStores()); setDbLockedError(false); } catch (e: any) { if (e.code === 'permission-denied') setDbLockedError(true); }
    setAnalytics(await getAnalytics()); setTagline(await getTagline());
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader(); reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image(); img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 800; canvas.height = img.height * (800 / img.width);
          const ctx = canvas.getContext('2d'); ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
    });
  };

  const handleSave = async () => {
    if(!editingStore) return;
    try {
      // Give new stores an order number at the bottom of the list
      const storeToSave = { ...editingStore, order: editingStore.order ?? stores.length };
      const isExisting = stores.find(s => s.id === storeToSave.id);
      const updatedList = isExisting 
        ? stores.map(s => s.id === storeToSave.id ? storeToSave : s)
        : [...stores, storeToSave];
      
      await saveStores([storeToSave]);
      setStores(updatedList.sort((a, b) => (a.order ?? 999) - (b.order ?? 999)));
      setEditingStore(null);
    } catch(e) { alert("Database locked! Update Firebase rules."); }
  };

  const moveStore = async (idx: number, direction: number) => {
    const newStores = [...stores];
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= newStores.length) return;

    // Swap their places
    const temp = newStores[idx];
    newStores[idx] = newStores[targetIdx];
    newStores[targetIdx] = temp;

    // Re-assign the rank numbers
    const updatedStores = newStores.map((s, i) => ({ ...s, order: i }));
    setStores(updatedStores);
    await saveStores(updatedStores); // Save the new order to Firebase!
  };

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
      <form onSubmit={(e) => { e.preventDefault(); if (password === 'zabulous') setIsAuthenticated(true); else alert('Incorrect'); }} className="bg-stone-800 p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-stone-700">
        <Lock className="w-12 h-12 text-amber-500 mx-auto mb-6" />
        <h2 className="text-2xl font-serif text-white text-center mb-6">Owner Access</h2>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-stone-900 text-white border border-stone-600 rounded-xl px-4 py-3 mb-6 focus:border-amber-500 outline-none" placeholder="Password" />
        <button type="submit" className="w-full bg-amber-500 hover:bg-amber-400 text-stone-900 font-bold rounded-xl py-3">Unlock Dashboard</button>
      </form>
    </div>
  );

  return (
    <div className="bg-stone-100 min-h-screen p-4 pb-20">
      <div className="max-w-6xl mx-auto space-y-8">
        {dbLockedError && <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-xl shadow-sm text-red-800 font-bold">Firebase Database Locked! Change Rules to allow read/write.</div>}
        
        <div className="bg-rose-950 p-6 rounded-3xl text-white shadow-xl flex justify-between items-center">
          <div className="flex items-center"><LayoutDashboard className="w-8 h-8 text-amber-400 mr-4" /><h1 className="text-3xl font-serif font-bold">Admin Portal</h1></div>
          <div className="bg-rose-900/50 px-4 py-2 rounded-xl text-amber-400 font-bold">Views: {analytics.views}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg flex gap-4">
          <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className="flex-grow border rounded-xl px-4 py-2" placeholder="Tagline" />
          <button onClick={() => { saveTagline(tagline); alert('Updated!'); }} className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold">Update</button>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-serif">Manage & Rank Deals</h2>
            <button onClick={() => setEditingStore({ id: Date.now().toString(), type: 'Restaurants', name: '', photo: '', mainOffer: '', address: '', contact: '', menu: [], offers: [] })} className="bg-amber-400 text-slate-900 px-4 py-2 rounded-xl font-bold flex items-center"><Plus className="w-5 h-5 mr-1" /> Add Deal</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store, idx) => (
              <div key={store.id} className="border border-stone-200 rounded-2xl p-4 bg-stone-50 hover:border-amber-300 transition-all flex flex-col relative shadow-sm">
                
                {/* RANK BADGE */}
                <div className="absolute top-4 left-4 bg-white text-slate-900 text-sm font-black px-3 py-1 rounded-lg shadow-md border border-stone-200 z-10">
                  #{idx + 1}
                </div>
                
                <div className="absolute top-4 right-4 bg-rose-100 text-rose-950 text-xs font-bold px-2 py-1 rounded-lg z-10 border border-rose-200">{analytics.clicks[store.id] || 0} Clicks</div>
                
                <img src={store.photo} className="w-full h-32 object-cover rounded-xl mb-4 opacity-90" />
                <span className="text-xs font-bold text-amber-600 uppercase mb-1">{store.type}</span>
                <h3 className="font-bold text-lg mb-1">{store.name}</h3>
                <p className="text-rose-950 font-black mb-4 bg-amber-100 inline-block px-2 py-1 rounded-md text-sm">{store.mainOffer}</p>
                
                {/* UP/DOWN AND EDIT/DELETE BUTTONS */}
                <div className="mt-auto pt-4 border-t border-stone-200 space-y-2">
                  <div className="flex gap-2">
                    <button onClick={() => moveStore(idx, -1)} disabled={idx === 0} className="flex-1 bg-white border border-stone-200 text-slate-800 py-2 rounded-lg flex justify-center items-center shadow-sm disabled:opacity-30 disabled:bg-stone-100"><ArrowUp className="w-4 h-4 mr-1"/> Move Up</button>
                    <button onClick={() => moveStore(idx, 1)} disabled={idx === stores.length - 1} className="flex-1 bg-white border border-stone-200 text-slate-800 py-2 rounded-lg flex justify-center items-center shadow-sm disabled:opacity-30 disabled:bg-stone-100"><ArrowDown className="w-4 h-4 mr-1"/> Move Down</button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingStore(store)} className="flex-1 bg-amber-100 text-amber-800 py-1.5 rounded-lg flex justify-center items-center font-bold text-sm border border-amber-200"><Edit2 className="w-4 h-4 mr-1"/> Edit</button>
                    <button onClick={() => { if(window.confirm('Delete?')) { deleteStore(store.id); setStores(stores.filter(s => s.id !== store.id)); } }} className="flex-1 bg-red-50 text-red-600 py-1.5 rounded-lg border border-red-100 flex justify-center items-center text-sm font-bold"><Trash2 className="w-4 h-4 mr-1"/> Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Modal... */}
        {editingStore && (
          <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-3xl w-full max-w-2xl p-6 my-8 shadow-2xl">
              <h2 className="text-2xl font-serif font-bold mb-6">Edit Deal</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Store Name" value={editingStore.name} onChange={e => setEditingStore({...editingStore, name: e.target.value})} className="w-full border rounded-xl px-4 py-2" />
                  <select value={editingStore.type} onChange={e => setEditingStore({...editingStore, type: e.target.value as StoreType})} className="w-full border rounded-xl px-4 py-2">
                    <option value="Restaurants">Restaurants</option><option value="Clothing">Clothing</option><option value="Grocery">Grocery</option><option value="Pharma">Pharma</option><option value="Salon">Salon</option><option value="Electronics">Electronics</option><option value="More">More</option>
                  </select>
                </div>
                <div className="border-2 border-dashed border-stone-200 rounded-xl p-4 flex gap-4 items-center">
                  <label className="cursor-pointer bg-amber-400 text-rose-950 px-4 py-2 rounded-lg font-bold flex"><ImageIcon className="w-5 h-5 mr-2" /> Upload Image<input type="file" accept="image/*" className="hidden" onChange={async (e) => { if (e.target.files?.[0]) setEditingStore({...editingStore, photo: await compressImage(e.target.files[0])}); }} /></label>
                  {editingStore.photo && <img src={editingStore.photo} className="h-12 w-12 object-cover rounded" />}
                </div>
                <input type="text" placeholder="Main Highlight Offer (e.g. 50% OFF)" value={editingStore.mainOffer} onChange={e => setEditingStore({...editingStore, mainOffer: e.target.value})} className="w-full border-2 border-amber-200 bg-amber-50 rounded-xl px-4 py-2 font-bold text-rose-950" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Address" value={editingStore.address} onChange={e => setEditingStore({...editingStore, address: e.target.value})} className="border rounded-xl px-4 py-2" />
                  <input type="text" placeholder="Contact" value={editingStore.contact} onChange={e => setEditingStore({...editingStore, contact: e.target.value})} className="border rounded-xl px-4 py-2" />
                </div>
                
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 mt-4">
                  <h3 className="font-bold text-slate-900 mb-2">Menu Items</h3>
                  {editingStore.menu?.map((item, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input type="text" placeholder="Item Name" value={item.name} onChange={e => { const newMenu = [...(editingStore.menu||[])]; newMenu[idx].name = e.target.value; setEditingStore({...editingStore, menu: newMenu}); }} className="flex-grow border rounded-lg px-3 py-1 text-sm" />
                      <input type="text" placeholder="Price" value={item.price} onChange={e => { const newMenu = [...(editingStore.menu||[])]; newMenu[idx].price = e.target.value; setEditingStore({...editingStore, menu: newMenu}); }} className="w-24 border rounded-lg px-3 py-1 text-sm" />
                      <button onClick={() => { const newMenu = editingStore.menu!.filter((_, i) => i !== idx); setEditingStore({...editingStore, menu: newMenu}); }} className="bg-red-100 text-red-600 px-2 rounded-lg text-sm">X</button>
                    </div>
                  ))}
                  <button onClick={() => setEditingStore({...editingStore, menu: [...(editingStore.menu||[]), {name: '', price: ''}]})} className="text-sm font-bold text-amber-600 mt-2">+ Add Menu Item</button>
                </div>

                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 mt-4">
                  <h3 className="font-bold text-slate-900 mb-2">Other Offers</h3>
                  {editingStore.offers?.map((offer, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input type="text" placeholder="Offer Title" value={offer.title} onChange={e => { const newOff = [...(editingStore.offers||[])]; newOff[idx].title = e.target.value; setEditingStore({...editingStore, offers: newOff}); }} className="flex-grow border rounded-lg px-3 py-1 text-sm" />
                      <input type="text" placeholder="Details" value={offer.description} onChange={e => { const newOff = [...(editingStore.offers||[])]; newOff[idx].description = e.target.value; setEditingStore({...editingStore, offers: newOff}); }} className="flex-grow border rounded-lg px-3 py-1 text-sm" />
                      <button onClick={() => { const newOff = editingStore.offers!.filter((_, i) => i !== idx); setEditingStore({...editingStore, offers: newOff}); }} className="bg-red-100 text-red-600 px-2 rounded-lg text-sm">X</button>
                    </div>
                  ))}
                  <button onClick={() => setEditingStore({...editingStore, offers: [...(editingStore.offers||[]), {title: '', description: ''}]})} className="text-sm font-bold text-amber-600 mt-2">+ Add Offer</button>
                </div>

                <div className="flex gap-4 mt-8 pt-4 border-t">
                  <button onClick={() => setEditingStore(null)} className="flex-1 bg-stone-100 font-bold py-3 rounded-xl">Cancel</button>
                  <button onClick={handleSave} className="flex-1 bg-rose-950 text-amber-400 font-bold py-3 rounded-xl shadow-lg">Save Deal</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
                      }  
          
