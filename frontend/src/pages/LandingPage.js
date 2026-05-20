import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Target, Sparkles, TrendingUp, BarChart3, CheckCircle, XCircle } from 'lucide-react';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <PublicHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-teal-50 flex-grow flex items-center py-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight mb-6">
              AI Interview Coach that <span className="text-indigo-600">Adapts</span>, <span className="text-teal-600">Evaluates</span> & <span className="text-violet-600">Improves</span> You
            </h1>

            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Get real-time AI feedback, understand your mistakes, and track your growth with explainable scoring.
            </p>
            
            <div className="space-y-6 mb-8 max-w-lg">
              <div className="pl-4 border-l-2 border-indigo-500">
                <h3 className="font-bold text-slate-900 text-lg">Adaptive AI</h3>
                <p className="text-slate-500">Personalized questions that evolve with your performance.</p>
              </div>
              <div className="pl-4 border-l-2 border-teal-500">
                <h3 className="font-bold text-slate-900 text-lg">Detailed Evaluation</h3>
                <p className="text-slate-500">Instant feedback on communication and technical accuracy.</p>
              </div>
              <div className="pl-4 border-l-2 border-violet-500">
                <h3 className="font-bold text-slate-900 text-lg">Progress Tracking</h3>
                <p className="text-slate-500">Monitor your growth with professional visual dashboards.</p>
              </div>
              <div className="pl-4 border-l-2 border-amber-500">
                <h3 className="font-bold text-slate-900 text-lg">Realistic Experience</h3>
                <p className="text-slate-500">Simulate high-pressure interviews with our interactive engine.</p>
              </div>
            </div>

          </div>
          <div className="relative mt-12 lg:mt-0">
            <div className="absolute inset-0 bg-indigo-500 rounded-3xl blur-3xl opacity-20 transform rotate-6"></div>
            <img 
              src="https://images.pexels.com/photos/5922538/pexels-photo-5922538.jpeg?auto=compress&cs=tinysrgb&w=800" 
              alt="Professional interview" 
              className="rounded-3xl shadow-2xl relative z-10"
            />
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default LandingPage;