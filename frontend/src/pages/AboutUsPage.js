import React from 'react';
import { Target, Users, Heart, Award } from 'lucide-react';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';

const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      
      <section className="bg-slate-50 py-20 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-slate-900 mb-6">Our Mission</h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            At InterviewIQ, we believe that everyone deserves the chance to shine in their dream job. Our mission is to democratize high-quality interview coaching through the power of Generative AI.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold mb-6">Built for Candidates, by Experts</h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                InterviewIQ was born out of a simple observation: traditional interview prep is either too expensive or too static. We combined decades of recruiting expertise with cutting-edge AI technology to create a coach that truly understands the nuances of professional communication.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-100 p-1.5 rounded-full text-indigo-600"><Users size={18} /></div>
                  <div>
                    <h4 className="font-bold text-slate-900">User-Centric Design</h4>
                    <p className="text-slate-600 text-sm">Every feature is built based on real candidate feedback and pain points.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-indigo-100 p-1.5 rounded-full text-indigo-600"><Target size={18} /></div>
                  <div>
                    <h4 className="font-bold text-slate-900">Precision Evaluation</h4>
                    <p className="text-slate-600 text-sm">Our AI models are trained on thousands of successful interview transcripts.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
               <div className="absolute inset-0 bg-indigo-500 rounded-2xl blur-3xl opacity-10 transform -rotate-3"></div>
               <img src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Our Team" className="rounded-2xl shadow-xl relative z-10" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <Heart className="text-rose-500 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Empathy First</h3>
              <p className="text-slate-600 text-sm">We understand that interviews are stressful. Our platform is designed to build confidence, not just test skills.</p>
            </div>
            <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <Award className="text-amber-500 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Excellence Driven</h3>
              <p className="text-slate-600 text-sm">We push for the highest standards in AI response quality and evaluation accuracy.</p>
            </div>
            <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <Target className="text-teal-500 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Transparent AI</h3>
              <p className="text-slate-600 text-sm">We believe in explainable AI. You'll always know exactly why you received your score.</p>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default AboutUsPage;
