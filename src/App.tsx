import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTagline } from './data';
import Home from './pages/Home';
import StoreDetails from './pages/StoreDetails';
import Admin from './pages/Admin';

function App() {
  const { tagline } = useTagline();
  let secretTapCount = 0;
  let secretTapTimeout: number;

  const handleSecretTap = () => {
    secretTapCount++;
    clearTimeout(secretTapTimeout);
    if (secretTapCount >= 5) window.location.href = '/admin';
    secretTapTimeout = setTimeout(() => { secretTapCount = 0; }, 1000);
  };

  return (
    <Router>
      <div className="min-h-screen bg-stone-50 font-sans flex flex-col">
        <header className="bg-rose-950 text-white shadow-xl sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-5 flex flex-col items-center relative">
            <h1 className="text-4xl font-black font-serif text-white z-10">
              Gulbarga <span className="text-amber-400">Deals</span>
            </h1>
            <p onClick={handleSecretTap} className="mt-1 text-sm text-stone-200 uppercase tracking-[0.2em] font-medium z-10 cursor-pointer">
              {tagline || "Gulbarga's Premier Guide for #1 Offers"}
            </p>
          </div>
        </header>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store/:id" element={<StoreDetails />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
export default App;
