import React, { useState, useEffect } from 'react';
import { interviewAPI } from '../utils/api';
import DashboardNavbar from '../components/DashboardNavbar';
import { Calendar, ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const HistoryPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const res = await interviewAPI.getHistory();
      setInterviews(res.data);
    } catch (error) {
      toast.error('Failed to load history');
    }
    setLoading(false);
  };

  const filteredInterviews = interviews.filter(i => 
    i.interview_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (i.focus_area && i.focus_area.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <DashboardNavbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold dark:text-white">Interview History</h1>
            <p className="text-slate-600 dark:text-slate-400">Review your past performances and feedback</p>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search interviews..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {filteredInterviews.length > 0 ? (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInterviews.map((interview) => (
                <div key={interview.id} className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                        <Calendar size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg dark:text-white">{interview.interview_type} Interview</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {new Date(interview.started_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                          {interview.focus_area && ` • ${interview.focus_area}`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                      {interview.overall_score && (
                        <div className="text-right">
                          <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                            {interview.overall_score.toFixed(1)}<span className="text-xs text-slate-400">/10</span>
                          </div>
                          <div className="text-[10px] uppercase tracking-tighter text-slate-400 font-bold">Overall Score</div>
                        </div>
                      )}
                      
                      <Link 
                        to={interview.status === 'completed' ? `/evaluation/${interview.id}` : `/interview/${interview.id}`}
                        className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold hover:gap-2 transition-all"
                      >
                        {interview.status === 'completed' ? 'View Report' : 'Resume'}
                        <ChevronRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search size={32} />
              </div>
              <p className="text-slate-500 dark:text-slate-400">No interviews found matching your search.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default HistoryPage;
