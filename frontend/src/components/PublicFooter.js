import React from 'react';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

const PublicFooter = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Brain size={28} className="text-indigo-400" />
              <span className="text-xl font-bold">InterviewIQ</span>
            </div>
            <p className="text-slate-400 text-sm">AI-powered interview coaching platform that adapts to you.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-slate-100">Product</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><Link to="/how-it-works" className="hover:text-indigo-400 transition-colors">How It Works</Link></li>
              <li><Link to="/interview-types" className="hover:text-indigo-400 transition-colors">Interview Types</Link></li>
              <li><Link to="/features" className="hover:text-indigo-400 transition-colors">Features</Link></li>
              <li><Link to="/why-us" className="hover:text-indigo-400 transition-colors">Why Us</Link></li>
              <li><Link to="/practice" className="hover:text-indigo-400 transition-colors">Practice</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-slate-100">Company</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact Support</Link></li>
              <li><Link to="/careers" className="hover:text-indigo-400 transition-colors">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-slate-100">Legal</h4>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><Link to="/privacy" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} InterviewIQ. Built for GenAI Hackathon.</p>
          <p className="mt-2 md:mt-0 flex items-center gap-1">Your data is private <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block ml-2"></span> Secure Platform</p>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
