import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Brain, Target, Sparkles, TrendingUp, BarChart3, CheckCircle, XCircle } from 'lucide-react';
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

            <div className="flex gap-4">
              <Link to="/signup" className="btn-primary flex items-center gap-2" data-testid="hero-signup-btn">
                Start Mock Interview <ArrowRight size={20} />
              </Link>
              <Link to="/login" className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-full px-6 py-2.5 font-medium">
                Login
              </Link>
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="absolute inset-0 bg-indigo-500 rounded-3xl blur-3xl opacity-20 transform rotate-6"></div>
            <img 
              src="https://images.pexels.com/photos/5922538/pexels-photo-5922538.jpeg?auto=compress&cs=tinysrgb&w=800" 
              alt="Professional interview" 
              className="rounded-3xl shadow-2xl relative z-10"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-center text-slate-600 mb-12">Four simple steps to interview success</p>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <Target />, title: "Choose Role", desc: "Select HR, Technical, or Behavioral interview" },
              { icon: <Brain />, title: "Answer Questions", desc: "AI adapts questions based on your responses" },
              { icon: <Sparkles />, title: "Get Feedback", desc: "Explainable scoring with mistake corrections" },
              { icon: <TrendingUp />, title: "Track Growth", desc: "Monitor improvement over time" }
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-600">
                  {step.icon}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interview Types */}
      <section id="interview-types" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Interview Types</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "HR Interviews", desc: "Behavioral questions, culture fit, strengths & weaknesses", color: "indigo" },
              { title: "Technical Interviews", desc: "Project discussions, problem-solving, technology expertise", color: "teal" },
              { title: "Behavioral Interviews", desc: "STAR method, teamwork, conflict resolution, leadership", color: "violet" }
            ].map((type, i) => (
              <div key={i} className={`bg-white p-8 rounded-xl border-2 border-${type.color}-200 hover:shadow-lg transition-all`}>
                <h3 className={`text-2xl font-bold mb-4 text-${type.color}-600`}>{type.title}</h3>
                <p className="text-slate-600">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section id="why-us" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Why InterviewIQ?</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <XCircle className="text-red-500" /> Traditional Mock Interviews
              </h3>
              <ul className="space-y-4">
                {[
                  "Static questions",
                  "No personalization",
                  "No explanation of mistakes",
                  "No long-term growth tracking"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600">
                    <XCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CheckCircle className="text-teal-500" /> InterviewIQ
              </h3>
              <ul className="space-y-4">
                {[
                  "Adaptive AI interviewer",
                  "Explainable scoring (why you got that score)",
                  "Answer correction & improvement",
                  "Growth tracking over time",
                  "Interview readiness prediction"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600">
                    <CheckCircle className="text-teal-500 flex-shrink-0 mt-1" size={20} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-center text-xl font-semibold text-indigo-600 mt-12">
            InterviewIQ doesn't just test candidates — it trains them to improve.
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Why We Are Different</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Brain />, title: "Adaptive AI", desc: "Questions adjust based on your performance" },
              { icon: <Sparkles />, title: "Explainable Feedback", desc: "Understand exactly why you got each score" },
              { icon: <BarChart3 />, title: "Growth Tracking", desc: "Monitor improvement with detailed analytics" }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default LandingPage;