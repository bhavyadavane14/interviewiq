import React from 'react';
import { Users, Code, MessagesSquare, CheckCircle2 } from 'lucide-react';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';

const InterviewTypesPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />
      
      <section className="bg-indigo-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">Master Any Interview Type</h1>
          <p className="text-xl text-indigo-100 leading-relaxed">
            From behavioral assessments to deep technical system designs, our AI models are specialized to grill you exactly like a real hiring manager would.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          
          {/* HR / Behavioral */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-12 border-b md:border-b-0 md:border-r border-slate-200">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                  <Users size={32} />
                </div>
                <h2 className="text-3xl font-bold mb-4">HR & Behavioral Interviews</h2>
                <p className="text-slate-600 mb-6">
                  Designed to evaluate your cultural fit, leadership qualities, and how you handle workplace conflicts. 
                  The AI focuses heavily on your ability to use the STAR method (Situation, Task, Action, Result) to structure your answers.
                </p>
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900">What the AI looks for:</h4>
                  <ul className="space-y-2">
                    <li className="flex gap-2 text-slate-600"><CheckCircle2 className="text-green-500 shrink-0" size={20} /> Empathy and emotional intelligence</li>
                    <li className="flex gap-2 text-slate-600"><CheckCircle2 className="text-green-500 shrink-0" size={20} /> Clear, concise storytelling</li>
                    <li className="flex gap-2 text-slate-600"><CheckCircle2 className="text-green-500 shrink-0" size={20} /> Alignment with company core values</li>
                  </ul>
                </div>
              </div>
              <div className="bg-slate-50 p-12 flex flex-col justify-center">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Example AI Progression</h4>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative">
                    <div className="absolute -left-2 -top-2 w-6 h-6 bg-blue-500 rounded-full text-white text-xs flex items-center justify-center font-bold">1</div>
                    <p className="text-sm text-slate-700 italic">"Tell me about a time you had a conflict with a coworker."</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative ml-8">
                    <div className="absolute -left-2 -top-2 w-6 h-6 bg-blue-600 rounded-full text-white text-xs flex items-center justify-center font-bold">2</div>
                    <p className="text-sm text-slate-700 italic">"Interesting. You mentioned you escalated it to your manager. Why didn't you try to resolve it 1-on-1 first?"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-12 border-b md:border-b-0 md:border-r border-slate-200 order-1 md:order-2">
                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mb-6 text-teal-600">
                  <Code size={32} />
                </div>
                <h2 className="text-3xl font-bold mb-4">Technical & System Design</h2>
                <p className="text-slate-600 mb-6">
                  Perfect for software engineers. The AI will ask you to explain complex concepts, debate architectural trade-offs, and test your knowledge of databases, caching, and scalability.
                </p>
                <div className="space-y-3">
                  <h4 className="font-semibold text-slate-900">What the AI looks for:</h4>
                  <ul className="space-y-2">
                    <li className="flex gap-2 text-slate-600"><CheckCircle2 className="text-green-500 shrink-0" size={20} /> Deep understanding of trade-offs (e.g. SQL vs NoSQL)</li>
                    <li className="flex gap-2 text-slate-600"><CheckCircle2 className="text-green-500 shrink-0" size={20} /> Identification of edge cases</li>
                    <li className="flex gap-2 text-slate-600"><CheckCircle2 className="text-green-500 shrink-0" size={20} /> Scalability and performance considerations</li>
                  </ul>
                </div>
              </div>
              <div className="bg-slate-50 p-12 flex flex-col justify-center order-2 md:order-1 border-r border-slate-200">
                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Example AI Progression</h4>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative">
                    <div className="absolute -left-2 -top-2 w-6 h-6 bg-teal-500 rounded-full text-white text-xs flex items-center justify-center font-bold">1</div>
                    <p className="text-sm text-slate-700 italic">"How would you design a URL shortening service like Bitly?"</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative ml-8">
                    <div className="absolute -left-2 -top-2 w-6 h-6 bg-teal-600 rounded-full text-white text-xs flex items-center justify-center font-bold">2</div>
                    <p className="text-sm text-slate-700 italic">"You chose a relational database. How would you handle scaling if the read-to-write ratio suddenly became 1000:1?"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default InterviewTypesPage;
