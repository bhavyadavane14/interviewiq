import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminAPI } from '../utils/api';
import { Brain, ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const AdminUserDetail = () => {
  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    try {
      const response = await adminAPI.getUserDetail(userId);
      setUserData(response.data);
    } catch (error) {
      toast.error('Failed to load user data');
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!userData) {
    return <div className="min-h-screen flex items-center justify-center">User not found</div>;
  }

  const { user, interviews, growth_data, weak_areas } = userData;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Link to="/admin" className="text-slate-600 hover:text-indigo-600">
            <ArrowLeft size={24} />
          </Link>
          <div className="flex items-center gap-2">
            <Brain className="text-indigo-600" size={32} />
            <span className="text-2xl font-bold">InterviewIQ Admin</span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* User Info */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 mb-8">
          <h1 className="text-3xl font-bold mb-4">{user.name}</h1>
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-slate-600">Email</div>
              <div className="font-medium">{user.email}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Total Interviews</div>
              <div className="font-medium">{user.total_interviews}</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Average Score</div>
              <div className="font-medium text-indigo-600">{user.average_score.toFixed(1)}/10</div>
            </div>
            <div>
              <div className="text-sm text-slate-600">Readiness Status</div>
              <div className={`text-sm font-semibold px-3 py-1 rounded-full inline-block mt-1 ${{
                'Ready': 'bg-teal-50 text-teal-700',
                'Needs Practice': 'bg-amber-50 text-amber-700',
                'Not Ready': 'bg-slate-100 text-slate-600'
              }[user.readiness_status]}`}>
                {user.readiness_status}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Growth Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200">
            <h2 className="text-xl font-bold mb-6">Performance Over Time</h2>
            {growth_data.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={growth_data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" />
                  <YAxis domain={[0, 10]} stroke="#64748b" />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#4F46E5" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400">
                No performance data yet
              </div>
            )}
          </div>

          {/* Weak Areas */}
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <h2 className="text-xl font-bold mb-6">Common Weaknesses</h2>
            {weak_areas.length > 0 ? (
              <div className="space-y-3">
                {weak_areas.map((area, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <span className="text-slate-700">{area.area}</span>
                    <span className="text-sm text-slate-500">{area.count}x</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-slate-400 py-8">No weaknesses identified</div>
            )}
          </div>
        </div>

        {/* Interview History */}
        <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200">
          <h2 className="text-xl font-bold mb-6">Interview History</h2>
          {interviews.length > 0 ? (
            <div className="space-y-4">
              {interviews.map((interview) => (
                <div key={interview.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <div className="font-semibold">{interview.interview_type} Interview</div>
                    <div className="text-sm text-slate-500">
                      {new Date(interview.started_at).toLocaleString()}
                    </div>
                  </div>
                  {interview.overall_score && (
                    <div className="text-lg font-bold text-indigo-600">
                      {interview.overall_score.toFixed(1)}/10
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-400 py-8">No interviews completed yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminUserDetail;