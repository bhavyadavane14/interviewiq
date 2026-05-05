import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { analyticsAPI, interviewAPI } from '../utils/api';
import { Brain, TrendingUp, Target, Calendar, LogOut, BookOpen, Play, Sparkles, Sun, Moon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { toast } from 'sonner';
import { useTheme } from '../contexts/ThemeContext';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="text-indigo-600 dark:text-indigo-400" size={32} />
            <span className="text-2xl font-bold dark:text-white">InterviewIQ</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="text-slate-900 dark:text-white font-medium">Dashboard</Link>
            <Link to="/practice" className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400">Practice</Link>
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button onClick={handleLogout} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8" data-testid="user-dashboard">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 dark:text-white">Welcome back, {user?.name}!</h1>
          <p className="text-slate-600 dark:text-slate-400">Track your interview performance and growth</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="stat-card bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-6 rounded-xl border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Overall Score</span>
              <Target className="text-indigo-600 dark:text-indigo-400" size={20} />
            </div>
            <div className="text-3xl font-bold dark:text-white" data-testid="overall-score">
              {hasData ? analytics.overall_score.toFixed(1) : '—'}
            </div>
          </div>

          <div className="stat-card bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-6 rounded-xl border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Interviews Taken</span>
              <Calendar className="text-teal-600 dark:text-teal-400" size={20} />
            </div>
            <div className="text-3xl font-bold dark:text-white" data-testid="total-interviews">
              {analytics?.total_interviews || 0}
            </div>
          </div>

          <div className="stat-card bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-6 rounded-xl border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Practice Streak</span>
              <TrendingUp className="text-violet-600 dark:text-violet-400" size={20} />
            </div>
            <div className="text-3xl font-bold dark:text-white" data-testid="streak">
              {analytics?.streak || 0} days
            </div>
          </div>

          <div className="stat-card bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-6 rounded-xl border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600 dark:text-slate-400">Readiness</span>
              <Brain className="text-indigo-600 dark:text-indigo-400" size={20} />
            </div>
            <div className={`text-sm font-semibold px-3 py-1 rounded-full inline-block ${
              analytics?.readiness_status === 'Ready' ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400' :
              analytics?.readiness_status === 'Needs Practice' ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' :
              'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`} data-testid="readiness-status">
              {analytics?.readiness_status || 'Not Ready'}
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Growth Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold mb-6 dark:text-white">Skill Growth Over Time</h2>
            {hasData && analytics.growth_data.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics.growth_data}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
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

          {/* Areas to Improve */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold mb-6 dark:text-white">Areas to Improve</h2>
            {hasData && analytics.weak_areas.length > 0 ? (
              <div className="space-y-4">
                {analytics.weak_areas.map((area, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{area.area}</span>
                      <span className="text-xs text-rose-500 font-bold bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded">Action Needed</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-rose-400 h-full w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-8">
                <p>No weak areas identified yet</p>
              </div>
            )}

            {/* Community Benchmark */}
            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-4">Community Benchmark</h3>
              <div className="flex items-end gap-2">
                <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{analytics?.community_percentile}%</span>
                <span className="text-slate-500 dark:text-slate-400 mb-1">higher than others</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">You are in the top 15% of candidates preparing for this role.</p>
            </div>
          </div>
        </div>

        {/* Second Row Content */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
           {/* Skill Breakdown */}
           <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold mb-6 dark:text-white">Skill Breakdown</h2>
            {hasData && analytics.skill_breakdown ? (
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analytics.skill_breakdown}>
                  <PolarGrid stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: isDarkMode ? "#94a3b8" : "#64748b" }} />
                  <PolarRadiusAxis tick={{ fill: isDarkMode ? "#94a3b8" : "#64748b" }} />
                  <Radar name="Skills" dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400">Not enough data</div>
            )}
          </div>

          {/* Goal Progress */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Goal Progress</h2>
            {analytics?.goal_progress ? (
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">{analytics.goal_progress.label}</span>
                  <span className="text-2xl font-bold dark:text-white">{analytics.goal_progress.current}/{analytics.goal_progress.target}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden mb-4">
                   <div 
                    className="bg-indigo-600 h-full transition-all duration-1000" 
                    style={{ width: `${(analytics.goal_progress.current / analytics.goal_progress.target) * 100}%` }}
                   ></div>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">You're on track to reach your monthly goal! Keep practicing.</p>
              </div>
            ) : null}
          </div>

          {/* Tips Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-xl text-white">
            <Sparkles className="mb-4 text-indigo-200" size={32} />
            <h2 className="text-xl font-bold mb-2">Pro Tip</h2>
            <p className="text-indigo-100 text-sm leading-relaxed mb-4">
              Candidates who use the <strong>STAR Method</strong> (Situation, Task, Action, Result) consistently score 35% higher in behavioral interviews.
            </p>
            <button className="text-white bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Learn STAR Method
            </button>
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
            className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-full px-6 py-2.5 font-medium flex items-center gap-2 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700"
          >
            <BookOpen size={20} />
            Practice Questions
          </Link>
        </div>

        {/* Recent Interviews */}
        <div className="mt-8 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold mb-6 dark:text-white">Recent Interviews</h2>
          {interviews.length > 0 ? (
            <div className="space-y-4">
              {interviews.slice(0, 5).map((interview) => (
                <div key={interview.id} className="flex items-center justify-between p-4 border border-slate-200 dark:border-slate-800 rounded-lg hover:shadow-sm transition-all dark:hover:bg-slate-800/50">
                  <div>
                    <div className="font-semibold dark:text-white">{interview.interview_type} Interview</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {new Date(interview.started_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {interview.overall_score && (
                      <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                        {interview.overall_score.toFixed(1)}/10
                      </div>
                    )}
                    {interview.status === 'completed' && (
                      <Link 
                        to={`/evaluation/${interview.id}`}
                        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm font-medium"
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
