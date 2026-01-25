import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminAPI } from '../utils/api';
import { Brain, Users, TrendingUp, Calendar, LogOut, Search, Award, AlertTriangle, BarChart2 } from 'lucide-react';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [dashboardStats, setDashboardStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [insights, setInsights] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      const [dashRes, usersRes, insightsRes] = await Promise.all([
        adminAPI.getDashboard(),
        adminAPI.getUsers(),
        adminAPI.getInsights()
      ]);
      setDashboardStats(dashRes.data);
      setUsers(usersRes.data);
      setInsights(insightsRes.data);
    } catch (error) {
      toast.error('Failed to load admin data');
    }
    setLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || u.readiness_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const hasUsers = users.length > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="text-indigo-600" size={32} />
            <span className="text-2xl font-bold">InterviewIQ Admin</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-slate-600 hover:text-red-600">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8" data-testid="admin-dashboard">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Platform overview and user management</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Total Users</span>
              <Users className="text-indigo-600" size={20} />
            </div>
            <div className="text-3xl font-bold" data-testid="total-users">
              {dashboardStats?.total_users || 0}
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Ready for Interview</span>
              <TrendingUp className="text-teal-600" size={20} />
            </div>
            <div className="text-3xl font-bold">
              {dashboardStats?.ready_for_interview || 0}
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Needs Practice</span>
              <TrendingUp className="text-amber-600" size={20} />
            </div>
            <div className="text-3xl font-bold">
              {dashboardStats?.needs_practice || 0}
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-slate-600">Active This Week</span>
              <Calendar className="text-violet-600" size={20} />
            </div>
            <div className="text-3xl font-bold">
              {dashboardStats?.active_this_week || 0}
            </div>
          </div>
        </div>

        {/* Performers and Weak Candidates */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Award className="text-amber-500" size={24} />
              Top Performers
            </h2>
            <div className="space-y-4">
              {dashboardStats?.top_performers?.map((u, i) => (
                <div key={u.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 flex items-center justify-center bg-amber-100 text-amber-700 rounded-full text-xs font-bold">{i+1}</span>
                    <span className="font-medium">{u.name}</span>
                  </div>
                  <span className="font-bold text-indigo-600">{u.average_score.toFixed(1)}</span>
                </div>
              ))}
              {(!dashboardStats?.top_performers || dashboardStats.top_performers.length === 0) && (
                <p className="text-slate-400 text-center py-4">No top performers yet</p>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <AlertTriangle className="text-red-500" size={24} />
              Weak Candidates
            </h2>
            <div className="space-y-4">
              {dashboardStats?.weak_candidates?.map((u, i) => (
                <div key={u.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{u.name}</span>
                  </div>
                  <span className="font-bold text-red-600">{u.average_score.toFixed(1)}</span>
                </div>
              ))}
              {(!dashboardStats?.weak_candidates || dashboardStats.weak_candidates.length === 0) && (
                <p className="text-slate-400 text-center py-4">No candidates in this category</p>
              )}
            </div>
          </div>
        </div>

        {/* Platform Insights */}
        {insights && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 mb-8">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BarChart2 className="text-indigo-600" size={24} />
              AI Interview Insights
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-500 mb-4 tracking-wider uppercase">Common Mistakes</h3>
                <div className="space-y-3">
                  {insights.common_mistakes?.slice(0, 5).map((mistake, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-slate-700 text-sm font-medium">{mistake.mistake}</div>
                      <div className="text-xs text-slate-500 mt-1">{mistake.frequency} occurrences</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-500 mb-4 tracking-wider uppercase">Most Failed Questions</h3>
                <div className="space-y-3">
                  {insights.most_failed_questions?.slice(0, 5).map((item, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-lg">
                      <div className="text-slate-700 text-sm font-medium line-clamp-2">{item.question}</div>
                      <div className="text-xs text-red-500 mt-1">{item.count} failures</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-500 mb-4 tracking-wider uppercase">AI Confidence Distribution</h3>
                <div className="space-y-4 mt-6">
                  {['high', 'medium', 'low'].map(level => {
                    const count = insights.confidence_distribution?.[level] || 0;
                    const total = Object.values(insights.confidence_distribution || {}).reduce((a, b) => a + b, 0) || 1;
                    const percentage = (count / total) * 100;
                    return (
                      <div key={level}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="capitalize">{level} Confidence</span>
                          <span>{count}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${level === 'high' ? 'bg-teal-500' : level === 'medium' ? 'bg-amber-500' : 'bg-red-500'}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Management */}
        <div className="bg-white p-6 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">All Users</h2>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  data-testid="user-search-input"
                />
              </div>
              <select
                className="px-4 py-2 border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                data-testid="status-filter"
              >
                <option value="all">All Status</option>
                <option value="Ready">Ready</option>
                <option value="Needs Practice">Needs Practice</option>
                <option value="Not Ready">Not Ready</option>
              </select>
            </div>
          </div>

          {!hasUsers ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-lg font-medium mb-2">No candidates have used the platform yet.</p>
              <p className="text-sm">Users will appear here once they complete interviews.</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p>No users match your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full" data-testid="users-table">
                <thead>
                  <tr className="border-b border-slate-200 text-left">
                    <th className="pb-3 text-sm font-semibold text-slate-600">Name</th>
                    <th className="pb-3 text-sm font-semibold text-slate-600">Email</th>
                    <th className="pb-3 text-sm font-semibold text-slate-600">Interviews</th>
                    <th className="pb-3 text-sm font-semibold text-slate-600">Avg Score</th>
                    <th className="pb-3 text-sm font-semibold text-slate-600">Streak</th>
                    <th className="pb-3 text-sm font-semibold text-slate-600">Status</th>
                    <th className="pb-3 text-sm font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3">{u.name}</td>
                      <td className="py-3 text-slate-600">{u.email}</td>
                      <td className="py-3">{u.total_interviews}</td>
                      <td className="py-3 font-semibold">{u.average_score.toFixed(1)}</td>
                      <td className="py-3">{u.streak}d</td>
                      <td className="py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          u.readiness_status === 'Ready' ? 'bg-teal-50 text-teal-700' :
                          u.readiness_status === 'Needs Practice' ? 'bg-amber-50 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {u.readiness_status}
                        </span>
                      </td>
                      <td className="py-3">
                        <Link
                          to={`/admin/users/${u.id}`}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                          data-testid={`view-user-${u.id}`}
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
