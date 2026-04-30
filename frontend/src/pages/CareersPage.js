import React from 'react';
import { Briefcase, MapPin, Zap, Globe, Rocket } from 'lucide-react';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';

const CareersPage = () => {
  const jobs = [
    { title: "Senior AI Engineer", department: "Engineering", location: "Remote / New York", type: "Full-time" },
    { title: "Full Stack Developer", department: "Engineering", location: "Remote", type: "Full-time" },
    { title: "Product Designer (UX/UI)", department: "Design", location: "Remote / London", type: "Full-time" },
    { title: "Customer Success Manager", department: "Growth", location: "Remote", type: "Full-time" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      
      <section className="relative py-24 bg-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <Rocket className="text-indigo-400 mx-auto mb-6" size={48} />
          <h1 className="text-5xl font-bold mb-6">Build the Future of Career Prep</h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            We're a team of engineers, designers, and recruiters on a mission to empower candidates everywhere. Join us in building the world's most advanced AI interview coach.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200">
              <Zap className="text-indigo-600 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Fast-Paced Environment</h3>
              <p className="text-slate-600 text-sm leading-relaxed">We move fast, ship daily, and iterate constantly. You'll have immediate impact on a product used by thousands.</p>
            </div>
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200">
              <Globe className="text-teal-600 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Remote-First Culture</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Work from anywhere in the world. We believe in autonomy, trust, and clear communication.</p>
            </div>
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-200">
              <Briefcase className="text-blue-600 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Growth & Ownership</h3>
              <p className="text-slate-600 text-sm leading-relaxed">We provide a generous learning budget and encourage every team member to take full ownership of their projects.</p>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-8 text-center">Open Positions</h2>
          <div className="max-w-4xl mx-auto space-y-4">
            {jobs.map((job, i) => (
              <div key={i} className="group bg-white p-6 rounded-xl border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</h4>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1"><Briefcase size={14} /> {job.department}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                    <span className="px-2 py-0.5 bg-slate-100 rounded text-slate-700 text-xs font-semibold uppercase tracking-wider">{job.type}</span>
                  </div>
                </div>
                <button className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-600 transition-colors">Apply Now</button>
              </div>
            ))}
          </div>

          <div className="mt-20 text-center bg-indigo-50 p-12 rounded-3xl border border-indigo-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Don't see a perfect fit?</h3>
            <p className="text-slate-600 mb-8">We're always looking for talented individuals who share our passion. Send us your resume and a brief note about what you'd like to build at InterviewIQ.</p>
            <a href="mailto:careers@interviewiq.com" className="text-indigo-600 font-bold text-lg hover:underline">careers@interviewiq.com</a>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default CareersPage;
