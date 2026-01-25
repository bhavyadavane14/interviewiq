import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { interviewAPI } from '../utils/api';
import { Brain, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const InterviewStart = () => {
  const [interviewType, setInterviewType] = useState('HR');
  const [focusArea, setFocusArea] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStart = async () => {
    setLoading(true);
    try {
      const response = await interviewAPI.start({
        interview_type: interviewType,
        focus_area: focusArea || null
      });
      toast.success('Interview started!');
      navigate(`/interview/${response.data.id}`);
    } catch (error) {
      toast.error('Failed to start interview');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Brain className="text-indigo-600" size={32} />
          <h1 className="text-3xl font-bold">Start Mock Interview</h1>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-3">Select Interview Type</label>
            <div className="grid grid-cols-3 gap-4">
              {['HR', 'Technical', 'Behavioral'].map((type) => (
                <button
                  key={type}
                  onClick={() => setInterviewType(type)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    interviewType === type
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  data-testid={`interview-type-${type.toLowerCase()}`}
                >
                  <div className="font-semibold">{type}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Focus Area (Optional)</label>
            <input
              type="text"
              placeholder="e.g., Leadership, Python, Communication"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              data-testid="focus-area-input"
            />
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <h3 className="font-semibold mb-2">What to expect:</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• 5 adaptive questions based on your answers</li>
              <li>• AI adjusts difficulty as you progress</li>
              <li>• Detailed feedback with corrections after completion</li>
              <li>• Voice input available (Chrome/Edge only)</li>
            </ul>
          </div>

          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full btn-primary flex items-center justify-center gap-2"
            data-testid="start-interview-submit-btn"
          >
            {loading ? 'Starting...' : 'Start Interview'}
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterviewStart;