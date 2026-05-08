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
        focus_area: focusArea || interviewType
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
            <label className="block text-sm font-medium mb-2">Select Focus Area</label>
            <select
              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none bg-white"
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              data-testid="focus-area-select"
            >
              <option value="">-- Choose a Focus Area --</option>
              <optgroup label="Engineering">
                <option value="Frontend Development">Frontend Development</option>
                <option value="Backend Development">Backend Development</option>
                <option value="Full Stack Engineering">Full Stack Engineering</option>
                <option value="Mobile App Development">Mobile App Development</option>
                <option value="DevOps & Infrastructure">DevOps & Infrastructure</option>
                <option value="System Design">System Design</option>
                <option value="Cloud Architecture">Cloud Architecture</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Embedded Systems">Embedded Systems</option>
              </optgroup>
              <optgroup label="Data & AI">
                <option value="Data Science & ML">Data Science & ML</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Database Management">Database Management</option>
                <option value="Blockchain Technology">Blockchain Technology</option>
              </optgroup>
              <optgroup label="Design & Product">
                <option value="Product Management">Product Management</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Content Strategy">Content Strategy</option>
              </optgroup>
              <optgroup label="Business & Management">
                <option value="Project Management">Project Management</option>
                <option value="Leadership & Management">Leadership & Management</option>
                <option value="Customer Success">Customer Success</option>
                <option value="Sales & Business Development">Sales & Business Development</option>
                <option value="Financial Analysis">Financial Analysis</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Marketing & Analytics">Marketing & Analytics</option>
              </optgroup>
              <option value="Quality Assurance (QA)">Quality Assurance (QA)</option>
            </select>
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
            <h3 className="font-semibold mb-2">What to expect:</h3>
            <ul className="text-sm text-slate-600 space-y-1">
              <li>• 10 adaptive questions tailored to your focus area</li>

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