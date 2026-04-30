import React from 'react';
import { Target, Brain, Sparkles, TrendingUp, ArrowRight, PlayCircle, FileText, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      
      {/* Hero Section */}
      <section className="bg-indigo-50 py-20 border-b border-indigo-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">How InterviewIQ Works</h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Our AI-driven platform guides you through a seamless, adaptive mock interview experience that feels just like the real thing. Here is the step-by-step breakdown of how you will improve.
          </p>
        </div>
      </section>

      {/* Steps Detail */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="space-y-24">
            
            {/* Step 1 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600 shadow-sm border border-blue-200">
                  <Target size={32} />
                </div>
                <h2 className="text-3xl font-bold mb-4">Step 1: Choose Your Interview Role</h2>
                <p className="text-lg text-slate-600 mb-6">
                  Every career path is different. Begin by selecting the exact type of interview you are preparing for:
                </p>
                <ul className="space-y-3 mb-6 text-slate-700">
                  <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-500"></div> <strong>HR / Behavioral:</strong> Focuses on your past experiences and cultural fit.</li>
                  <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-500"></div> <strong>Technical:</strong> Dives deep into your domain knowledge and problem-solving.</li>
                  <li className="flex items-center gap-3"><div className="w-2 h-2 rounded-full bg-blue-500"></div> <strong>System Design:</strong> Tests your architectural thinking and scalability concepts.</li>
                </ul>
              </div>
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-inner">
                <img src="https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Choosing role" className="rounded-xl shadow-md w-full object-cover h-64" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-inner">
                 <img src="https://images.pexels.com/photos/5922538/pexels-photo-5922538.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Answering questions" className="rounded-xl shadow-md w-full object-cover h-64" />
              </div>
              <div className="order-1 md:order-2">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 shadow-sm border border-indigo-200">
                  <Brain size={32} />
                </div>
                <h2 className="text-3xl font-bold mb-4">Step 2: Answer Adaptive Questions</h2>
                <p className="text-lg text-slate-600 mb-6">
                  Unlike traditional static questionnaires, our AI listens to your answers and generates follow-up questions dynamically. 
                  If you give a vague answer, the AI will probe deeper. If you excel, the questions become more challenging, simulating the pressure of a real top-tier interview.
                </p>
                <div className="flex items-center gap-2 text-indigo-600 font-semibold bg-indigo-50 px-4 py-2 rounded-lg inline-flex border border-indigo-100">
                  <PlayCircle size={20} /> Voice Input Supported
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-6 text-teal-600 shadow-sm border border-teal-200">
                  <Sparkles size={32} />
                </div>
                <h2 className="text-3xl font-bold mb-4">Step 3: Receive Explainable Feedback</h2>
                <p className="text-lg text-slate-600 mb-6">
                  Once the interview is complete, you don't just get a score out of 100. Our engine breaks down your performance into key metrics:
                </p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
                    <h4 className="font-bold text-teal-900 mb-1">Clarity</h4>
                    <p className="text-sm text-teal-700">How concise your answers were.</p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
                    <h4 className="font-bold text-teal-900 mb-1">Relevance</h4>
                    <p className="text-sm text-teal-700">Did you actually answer the prompt?</p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
                    <h4 className="font-bold text-teal-900 mb-1">Confidence</h4>
                    <p className="text-sm text-teal-700">Tone and structuring.</p>
                  </div>
                  <div className="bg-teal-50 p-4 rounded-xl border border-teal-100">
                    <h4 className="font-bold text-teal-900 mb-1">Structure</h4>
                    <p className="text-sm text-teal-700">Usage of the STAR method.</p>
                  </div>
                </div>
                <p className="text-slate-600">We even rewrite your answers to show you exactly how a 10/10 candidate would have responded.</p>
              </div>
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-inner">
                <img src="https://images.pexels.com/photos/7567443/pexels-photo-7567443.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Receiving Feedback" className="rounded-xl shadow-md w-full object-cover h-64" />
              </div>
            </div>

            {/* Step 4 */}
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1 bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-inner">
                <img src="https://images.pexels.com/photos/7567565/pexels-photo-7567565.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Track Growth" className="rounded-xl shadow-md w-full object-cover h-64" />
              </div>
              <div className="order-1 md:order-2">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-600 shadow-sm border border-purple-200">
                  <TrendingUp size={32} />
                </div>
                <h2 className="text-3xl font-bold mb-4">Step 4: Track Your Growth</h2>
                <p className="text-lg text-slate-600 mb-6">
                  Improvement takes practice. Your personalized dashboard tracks your scores over time, highlights your recurring weak spots, and eventually gives you the "Interview Ready" green light when you consistently hit high scores.
                </p>
                <Link to="/signup" className="btn-primary inline-flex items-center gap-2">
                  Try It Yourself <ArrowRight size={20} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default HowItWorksPage;
