import React from 'react';
import { Brain, Sparkles, BarChart3, Mic, ShieldCheck, Zap } from 'lucide-react';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      
      <section className="py-20 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Cutting-Edge Features</h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            InterviewIQ is powered by state-of-the-art Large Language Models. We don't just ask questions—we simulate real human interaction.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
                <Brain size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Adaptive AI Engine</h3>
              <p className="text-slate-600 leading-relaxed">
                The questions aren't pre-written. The AI analyzes your resume, the job role, and your ongoing answers to generate questions specifically tailored to grill your weak points.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mb-6 text-teal-600">
                <Sparkles size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Explainable Scoring</h3>
              <p className="text-slate-600 leading-relaxed">
                Stop wondering why you failed. We provide a transparent breakdown of your clarity, relevance, and confidence, pointing exactly to the sentences where you lost points.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 text-blue-600">
                <Mic size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Real-Time Voice Input</h3>
              <p className="text-slate-600 leading-relaxed">
                Typing an interview answer isn't realistic. Use your microphone to speak your answers naturally. We transcribe, analyze tone, and evaluate structure in real-time.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6 text-purple-600">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Analytics Dashboard</h3>
              <p className="text-slate-600 leading-relaxed">
                A gorgeous dashboard tracks your progression. Watch your average scores climb, see your streak, and know exactly when you cross the threshold into "Interview Ready".
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
              <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center mb-6 text-rose-600">
                <Zap size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Instant Feedback</h3>
              <p className="text-slate-600 leading-relaxed">
                No waiting for a human coach to review your tape. Get a comprehensive, multi-page PDF evaluation report instantly upon finishing your mock interview.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 text-emerald-600">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Private & Secure</h3>
              <p className="text-slate-600 leading-relaxed">
                Your voice data and text answers are processed securely. We don't use your personal interview data to train public models. Your mistakes stay between you and the AI.
              </p>
            </div>

          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default FeaturesPage;
