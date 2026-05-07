import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { analyticsAPI, interviewAPI } from '../utils/api';
import { Target, Calendar, TrendingUp, Brain, Play, BookOpen, ChevronRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import DashboardNavbar from '../components/DashboardNavbar';

const UserDashboard = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(None);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [analyticsRes, interviewsRes] = await Promise.all([
        analyticsAPI.getDashboard(),
        interviewAPI.getHistory()
      ]);
      setAnalytics(analyticsRes.data);
      setInterviews(interviewsRes.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardNavbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 dark:text-white">Welcome back, {user?.name}!</h1>
          <p className="text-slate-600 dark:text-slate-400">Here's an overview of your preparation progress.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Avg. Score</span>
              <Target className="text-indigo-600" size={20} />
            </div>
            <div className="text-3xl font-bold dark:text-white">
              {analytics?.overall_score?.toFixed(1) || '—'}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Total Interviews</span>
              <Calendar className="text-teal-600" size={20} />
            </div>
            <div className="text-3xl font-bold dark:text-white">{analytics?.total_interviews || 0}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Current Streak</span>
              <TrendingUp className="text-violet-600" size={20} />
            </div>
            <div className="text-3xl font-bold dark:text-white">{analytics?.streak || 0} days</div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
              <Brain className="text-indigo-600" size={20} />
            </div>
            <div className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
              analytics?.readiness_status === 'Ready' ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-600'
            }`}>
              {analytics?.readiness_status || 'Getting Started'}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Main Action Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-2xl text-white shadow-xl shadow-indigo-200 dark:shadow-none">
            <Sparkles className="mb-6 text-indigo-200" size={40} />
            <h2 className="text-3xl font-bold mb-4">Ready for your next challenge?</h2>
            <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
              Take a AI-powered mock interview to get detailed feedback and improve your performance.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/interview/start" className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors flex items-center gap-2">
                <Play size={20} /> Start Interview
              </Link>
              <Link to="/practice" className="bg-indigo-500/30 text-white border border-indigo-400/30 px-8 py-3 rounded-xl font-bold hover:bg-indigo-500/50 transition-colors flex items-center gap-2">
                <BookOpen size={20} /> Practice
              </Link>
            </div>
          </div>

          {/* Quick Insights Summary */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold dark:text-white">Recent Performance</h2>
                <Link to="/analytics" className="text-indigo-600 text-sm font-medium hover:underline">View Analytics</Link>
              </div>
              <div className="space-y-3">
                {analytics?.weak_areas?.slice(0, 2).map((area, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <span className="text-sm dark:text-slate-300">{area.area}</span>
                    <span className="text-xs font-bold text-rose-500">Needs Work</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold dark:text-white">Recent Activity</h2>
                <Link to="/history" className="text-indigo-600 text-sm font-medium hover:underline">Full History</Link>
              </div>
              {interviews.slice(0, 2).map((interview) => (
                <div key={interview.id} className="flex items-center justify-between py-3 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-sm dark:text-slate-300">{interview.interview_type} Interview</span>
                  <ChevronRight size={16} className="text-slate-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
