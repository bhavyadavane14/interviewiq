import React, { useState, useEffect } from 'react';
import { analyticsAPI } from '../utils/api';
import DashboardNavbar from '../components/DashboardNavbar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { toast } from 'sonner';

const AnalyticsPage = () => {
  const { isDarkMode } = useTheme();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await analyticsAPI.getDashboard();
      setAnalytics(res.data);
    } catch (error) {
      toast.error('Failed to load analytics');
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold dark:text-white">Detailed Analytics</h1>
          <p className="text-slate-600 dark:text-slate-400">Deep dive into your performance metrics</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Growth Chart */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold mb-6 dark:text-white">Performance Growth</h2>
            <ResponsiveContainer width="100%" height={300}>
              {analytics?.growth_data?.length > 0 ? (
                <LineChart data={analytics?.growth_data}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis domain={[0, 10]} stroke="#64748b" />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                </LineChart>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  Take your first interview to see growth data
                </div>
              )}
            </ResponsiveContainer>
          </div>

          {/* Skill Breakdown */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold mb-6 dark:text-white">Skill Matrix</h2>
            <ResponsiveContainer width="100%" height={300}>
              {analytics?.skill_breakdown?.some(s => s.A > 0) ? (
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analytics?.skill_breakdown}>
                  <PolarGrid stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: isDarkMode ? "#94a3b8" : "#64748b" }} />
                  <PolarRadiusAxis tick={{ fill: isDarkMode ? "#94a3b8" : "#64748b" }} />
                  <Radar name="Skills" dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.6} />
                </RadarChart>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  Complete an interview to generate your skill matrix
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           {/* Weak Areas */}
           <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold mb-6 dark:text-white">Knowledge Gaps</h2>
            <div className="space-y-4">
              {analytics?.weak_areas?.length > 0 ? (
                analytics?.weak_areas.map((area, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{area.area}</span>
                      <span className="text-xs text-rose-500 font-bold bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded">High Priority</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-rose-400 h-full w-4/5"></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-slate-400 text-sm">
                  No gaps identified yet. Keep it up!
                </div>
              )}
            </div>
          </div>

          {/* Detailed Progress */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold mb-6 dark:text-white">Milestone Tracking</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* This could be more detailed */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <h3 className="font-semibold dark:text-white mb-2">Weekly Target</h3>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {analytics?.goal_progress.current} / {analytics?.goal_progress.target}
                </div>
                <p className="text-xs text-slate-500 mt-1">Interviews completed this week</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <h3 className="font-semibold dark:text-white mb-2">Community Standing</h3>
                <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                  Top {100 - analytics?.community_percentile}%
                </div>
                <p className="text-xs text-slate-500 mt-1">Global percentile ranking</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnalyticsPage;
