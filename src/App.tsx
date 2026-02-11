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
      <div className="min-h-screen bg-stone-50 font-sans selection:bg-rose-950 selection:text-amber-400 flex flex-col">
        {/* Premium Header */}
        <header className="bg-rose-950 text-white shadow-xl sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col items-center relative overflow-hidden">
            {/* Subtle elegant pattern overlay */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent"></div>
            
            {/* THE FIX: Made Title Massive, Made Tagline Smaller & Softer */}
            <h1 className="text-5xl sm:text-6xl font-black font-serif tracking-tight text-white drop-shadow-lg z-10 relative mb-1">
              Gulbarga <span className="text-amber-400">Deals</span>
            </h1>
            <p 
              onClick={handleSecretTap}
              className="text-[10px] sm:text-xs text-stone-300/80 uppercase tracking-[0.3em] font-medium z-10 relative cursor-pointer hover:text-white transition-colors text-center"
            >
              {tagline || "Gulbarga's Premier Guide for #1 Offers"}
            </p>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/store/:id" element={<StoreDetails />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        {/* Refined Footer */}
        <footer className="bg-rose-950 border-t border-rose-900/50 py-8 mt-12 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-serif font-bold text-white mb-2">Gulbarga <span className="text-amber-400">Deals</span></h2>
            <p className="text-stone-300 text-sm mb-6">Discover the city's finest offers.</p>
            <div className="h-px w-24 bg-rose-800 mx-auto mb-6"></div>
            <p className="text-stone-400 text-[10px] tracking-wider uppercase">
              &copy; {new Date().getFullYear()} Gulbarga Deals. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
