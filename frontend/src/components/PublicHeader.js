import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Menu, X } from 'lucide-react';

const PublicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => currentPath === path 
    ? "text-indigo-600 dark:text-indigo-400 font-semibold" 
    : "text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400";

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <Brain className="text-indigo-600 dark:text-indigo-400" size={32} />
          <span className="text-2xl font-bold text-slate-900 dark:text-white">InterviewIQ</span>
        </Link>

          <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
          <Link to="/login" className="btn-primary">Login</Link>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        
      </nav>

      {/* Menu Overlay */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 py-6 px-6 shadow-xl animate-in slide-in-from-top duration-300 z-40">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className={`p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all ${isActive('/')}`}>
              <div className="font-bold text-lg">Home</div>
              <p className="text-sm text-slate-500">Back to start</p>
            </Link>
            <Link to="/how-it-works" onClick={() => setIsMenuOpen(false)} className={`p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all ${isActive('/how-it-works')}`}>
              <div className="font-bold text-lg">How It Works</div>
              <p className="text-sm text-slate-500">Learn about our AI interview process</p>
            </Link>
            <Link to="/interview-types" onClick={() => setIsMenuOpen(false)} className={`p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all ${isActive('/interview-types')}`}>
              <div className="font-bold text-lg">Interview Types</div>
              <p className="text-sm text-slate-500">HR, Technical, Behavioral and more</p>
            </Link>
            <Link to="/features" onClick={() => setIsMenuOpen(false)} className={`p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all ${isActive('/features')}`}>
              <div className="font-bold text-lg">Features</div>
              <p className="text-sm text-slate-500">Real-time feedback and detailed reports</p>
            </Link>
            <Link to="/why-us" onClick={() => setIsMenuOpen(false)} className={`p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all ${isActive('/why-us')}`}>
              <div className="font-bold text-lg">Why Us</div>
              <p className="text-sm text-slate-500">Trusted by 10,000+ candidates</p>
            </Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className={`p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all ${isActive('/about')}`}>
              <div className="font-bold text-lg">About Us</div>
              <p className="text-sm text-slate-500">Meet the team behind InterviewIQ</p>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;
