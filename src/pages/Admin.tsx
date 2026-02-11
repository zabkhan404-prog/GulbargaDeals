import React, { useState, useEffect } from 'react';
import { Store, StoreType, getStores, saveStores, deleteStore, getAnalytics, Analytics, getTagline, saveTagline } from '../data';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Lock, Plus, Edit2, Trash2, LayoutDashboard, Copy, AlertTriangle } from 'lucide-react';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({ views: 0, clicks: {} });
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [tagline, setTagline] = useState('');
  const [dbLockedError, setDbLockedError] = useState(false);

  useEffect(() => {
    if (isAuthenticated) fetchData();
  }, [isAuthenticated]);

  const fetchData = async () => {
    try { setStores(await getStores()); setDbLockedError(false); } 
    catch (e: any) { if (e.code === 'permission-denied') setDbLockedError(true); }
    setAnalytics(await getAnalytics());
    setTagline(await getTagline());
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = 800; canvas.height = img.height * (800 / img.width);
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.7));
        };
      };
    });
  };

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
      <form onSubmit={(e) => { e.preventDefault(); if (password === 'zabulous') setIsAuthenticated(true); else alert('Incorrect'); }} className="bg-stone-800 p-8 rounded-3xl shadow-2xl w-full max-w-sm">
        <Lock className="w-12 h-12 text-amber-500 mx-auto mb-6" />
        <h2 className="text-2xl font-serif text-white text-center mb-6">Owner Access</h2>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-stone-900 text-white rounded-xl px-4 py-3 mb-6" placeholder="Password" />
        <button type="submit" className="w-full bg-amber-500 text-stone-900 font-bold rounded-xl py-3">Unlock Dashboard</button>
      </form>
    </div>
  );

  return (
    <div className="bg-stone-100 min-h-screen p-4 pb-20">
      <div className="max-w-6xl mx-auto space-y-8">
        {dbLockedError && <div className="bg-red-100 p-4 rounded-xl text-red-800 font-bold">Database Locked! Fix Firebase Rules.</div>}
        <div className="bg-rose-950 p-6 rounded-3xl text-white flex justify-between items-center">
          <h1 className="text-3xl font-serif font-bold">Admin Portal</h1>
          <div className="bg-rose-900 px-4 py-2 rounded-xl text-amber-400 font-bold">Views: {analytics.views}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg flex gap-4">
          <input type="text" value={tagline} onChange={(e) => setTagline(e.target.value)} className="flex-grow border rounded-xl px-4 py-2" placeholder="Site Tagline" />
          <button onClick={() => { saveTagline(tagline); alert('Saved!'); }} className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold">Update Settings</button>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Manage Deals</h2>
            <button onClick={() => setEditingStore({ id: Date.now().toString(), type: 'Restaurants', name: '', photo: '', mainOffer: '', address: '', contact: '' })} className="bg-amber-400 px-4 py-2 rounded-xl font-bold flex items-center"><Plus className="w-5 h-5 mr-1" /> Add Deal</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map(store => (
              <div key={store.id} className="border rounded-2xl p-4 bg-stone-50 flex flex-col">
                <img src={store.photo} className="w-full h-32 object-cover rounded-xl mb-4" />
                <h3 className="font-bold text-lg mb-1">{store.name}</h3>
                <p className="text-rose-950 font-black mb-4">{store.mainOffer}</p>
                <div className="mt-auto flex gap-2">
                  <button onClick={() => setEditingStore(store)} className="flex-1 bg-white border py-1.5 rounded-lg text-sm font-bold flex justify-center items-center"><Edit2 className="w-4 h-4 mr-1"/> Edit</button>
                  <button onClick={() => { if(window.confirm('Delete?')) { deleteStore(store.id); setStores(stores.filter(s => s.id !== store.id)); } }} className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg border flex justify-center items-center"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {editingStore && (
          <div className="fixed inset-0 bg-stone-900/80 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-3xl w-full max-w-2xl p-6 shadow-2xl">
              <h2 className="text-2xl font-bold mb-4">Edit Deal</h2>
              <div className="space-y-4">
                <input type="text" placeholder="Store Name" value={editingStore.name} onChange={e => setEditingStore({...editingStore, name: e.target.value})} className="w-full border rounded-xl px-4 py-2" />
                <select value={editingStore.type} onChange={e => setEditingStore({...editingStore, type: e.target.value as StoreType})} className="w-full border rounded-xl px-4 py-2">
                  <option value="Restaurants">Restaurants</option><option value="Clothing">Clothing</option><option value="Grocery">Grocery</option><option value="Pharma">Pharma</option><option value="Salon">Salon</option><option value="Electronics">Electronics</option><option value="More">More</option>
                </select>
                <div className="border-2 border-dashed p-4 rounded-xl">
                  <input type="file" accept="image/*" onChange={async (e) => { if (e.target.files?.[0]) setEditingStore({...editingStore, photo: await compressImage(e.target.files[0])}); }} />
                </div>
                <input type="text" placeholder="Main Offer (e.g. 50% OFF)" value={editingStore.mainOffer} onChange={e => setEditingStore({...editingStore, mainOffer: e.target.value})} className="w-full border-2 border-amber-200 rounded-xl px-4 py-2 font-bold" />
                <input type="text" placeholder="Address" value={editingStore.address} onChange={e => setEditingStore({...editingStore, address: e.target.value})} className="w-full border rounded-xl px-4 py-2" />
                <input type="text" placeholder="Contact" value={editingStore.contact} onChange={e => setEditingStore({...editingStore, contact: e.target.value})} className="w-full border rounded-xl px-4 py-2" />
                <div className="flex gap-4 mt-6">
                  <button onClick={() => setEditingStore(null)} className="flex-1 bg-stone-100 font-bold py-3 rounded-xl">Cancel</button>
                  <button onClick={async () => { await saveStores([editingStore]); setStores(stores.find(s=>s.id===editingStore.id) ? stores.map(s=>s.id===editingStore.id?editingStore:s) : [...stores, editingStore]); setEditingStore(null); }} className="flex-1 bg-rose-950 text-amber-400 font-bold py-3 rounded-xl">Save</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
                                                                                                                                                      }
