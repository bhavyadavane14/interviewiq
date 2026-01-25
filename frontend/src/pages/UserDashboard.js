import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { analyticsAPI, interviewAPI } from '../utils/api';
import { Brain, TrendingUp, Target, Calendar, LogOut, BookOpen, Play } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const [analytics, setAnalytics] = useState(null);
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

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const hasData = analytics && analytics.total_interviews > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="text-indigo-600" size={32} />
            <span className="text-2xl font-bold">InterviewIQ</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-slate-900 font-medium">Dashboard</Link>
            <Link to="/practice" className="text-slate-600 hover:text-indigo-600">Practice</Link>
            <button onClick={handleLogout} className="flex items-center gap-2 text-slate-600 hover:text-red-600">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8" data-testid="user-dashboard">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-slate-600">Track your interview performance and growth</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Overall Score</span>
              <Target className="text-indigo-600" size={20} />
            </div>
            <div className="text-3xl font-bold" data-testid="overall-score">
              {hasData ? analytics.overall_score.toFixed(1) : '—'}
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Interviews Taken</span>
              <Calendar className="text-teal-600" size={20} />
            </div>
            <div className="text-3xl font-bold" data-testid="total-interviews">
              {analytics?.total_interviews || 0}
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Practice Streak</span>
              <TrendingUp className="text-violet-600" size={20} />
            </div>
            <div className="text-3xl font-bold" data-testid="streak">
              {analytics?.streak || 0} days
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Readiness</span>
              <Brain className="text-indigo-600" size={20} />
            </div>
            <div className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
              analytics?.readiness_status === 'Ready' ? 'bg-teal-50 text-teal-700' :
              analytics?.readiness_status === 'Needs Practice' ? 'bg-amber-50 text-amber-700' :
              'bg-slate-100 text-slate-600'
            }`} data-testid="readiness-status">
              {analytics?.readiness_status || 'Not Ready'}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Growth Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200">
            <h2 className="text-xl font-bold mb-6">Skill Growth Over Time</h2>
            {hasData && analytics.growth_data.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.growth_data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis domain={[0, 10]} stroke="#64748b" />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <p className="mb-4">No growth data yet</p>
                  <p className="text-sm">Start your first mock interview to see insights</p>
                </div>
              </div>
            )}
          </div>

          {/* Weak Areas */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h2 className="text-xl font-bold mb-6">Areas to Improve</h2>
            {hasData && analytics.weak_areas.length > 0 ? (
              <div className="space-y-4">
                {analytics.weak_areas.map((area, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-slate-700">{area.area}</span>
                    <span className="text-sm text-slate-500">{area.count}x</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-8">
                <p>No weak areas identified yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Link 
            to="/interview/start" 
            className="btn-primary flex items-center gap-2"
            data-testid="start-interview-btn"
          >
            <Play size={20} />
            Start New Interview
          </Link>
          <Link 
            to="/practice" 
            className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-full px-6 py-2.5 font-medium flex items-center gap-2"
          >
            <BookOpen size={20} />
            Practice Questions
          </Link>
        </div>

        {/* Recent Interviews */}
        <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="text-xl font-bold mb-6">Recent Interviews</h2>
          {interviews.length > 0 ? (
            <div className="space-y-4">
              {interviews.slice(0, 5).map((interview) => (
                <div key={interview.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:shadow-sm transition-all">
                  <div>
                    <div className="font-semibold">{interview.interview_type} Interview</div>
                    <div className="text-sm text-slate-500">
                      {new Date(interview.started_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {interview.overall_score && (
                      <div className="text-lg font-bold text-indigo-600">
                        {interview.overall_score.toFixed(1)}/10
                      </div>
                    )}
                    {interview.status === 'completed' && (
                      <Link 
                        to={`/evaluation/${interview.id}`}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                      >
                        View Report
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-400 py-8">
              <p>No interviews yet</p>
              <p className="text-sm mt-2">Click "Start New Interview" to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
