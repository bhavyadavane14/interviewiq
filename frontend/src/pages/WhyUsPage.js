import React from 'react';
import { CheckCircle, XCircle, Users, Target, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';

const WhyUsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />
      
      <section className="bg-white py-24 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6 text-slate-900">Why InterviewIQ?</h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            The traditional way of preparing for interviews is broken. Rehearsing in front of a mirror doesn't give you feedback, and hiring a human coach costs hundreds of dollars per hour. We built a better way.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* The Old Way */}
            <div className="bg-white p-10 rounded-2xl border border-red-100 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <XCircle className="text-red-500" size={32} />
                <h3 className="text-3xl font-bold text-slate-900">The Old Way</h3>
              </div>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-red-100 p-1.5 rounded-full text-red-600"><XCircle size={16} /></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1">Static Question Banks</h4>
                    <p className="text-slate-600">You read top 50 interview questions online, but real interviewers ask dynamic follow-ups you can't memorize.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-red-100 p-1.5 rounded-full text-red-600"><XCircle size={16} /></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1">Zero Objective Feedback</h4>
                    <p className="text-slate-600">Practicing with friends is nice, but they rarely give you harsh, objective, metric-driven feedback.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-red-100 p-1.5 rounded-full text-red-600"><XCircle size={16} /></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1">High Cost of Coaching</h4>
                    <p className="text-slate-600">Professional interview coaches charge upwards of $200/hr for a single mock session.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* The InterviewIQ Way */}
            <div className="bg-white p-10 rounded-2xl border border-teal-100 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-[100px] -z-0"></div>
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <CheckCircle className="text-teal-500" size={32} />
                <h3 className="text-3xl font-bold text-slate-900">The InterviewIQ Way</h3>
              </div>
              <ul className="space-y-6 relative z-10">
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-teal-100 p-1.5 rounded-full text-teal-600"><CheckCircle size={16} /></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1">Adaptive Conversational AI</h4>
                    <p className="text-slate-600">Our engine listens to your responses and pivots the conversation, pushing you exactly where you are weak.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-teal-100 p-1.5 rounded-full text-teal-600"><CheckCircle size={16} /></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1">Explainable Data</h4>
                    <p className="text-slate-600">We grade your clarity, relevance, and structure instantly. We literally rewrite your answers to show you how to improve.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="mt-1 bg-teal-100 p-1.5 rounded-full text-teal-600"><CheckCircle size={16} /></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg mb-1">Unlimited Practice</h4>
                    <p className="text-slate-600">Interview at 2 AM or 2 PM. Run 5 back-to-back mocks. The AI never gets tired.</p>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-indigo-50 border-t border-indigo-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Rocket className="mx-auto text-indigo-600 mb-6" size={48} />
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-xl text-slate-700 leading-relaxed mb-8">
            We believe that interviewing is a skill, not an innate talent. Our mission is to democratize access to elite interview coaching through the power of Generative AI, helping candidates land their dream jobs with confidence.
          </p>
          <Link to="/signup" className="btn-primary text-lg px-8 py-4">
            Start Your Journey Today
          </Link>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default WhyUsPage;
