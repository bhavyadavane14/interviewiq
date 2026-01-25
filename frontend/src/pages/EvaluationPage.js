import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { evaluationAPI } from '../utils/api';
import { Brain, CheckCircle, XCircle, TrendingUp, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const EvaluationPage = () => {
  const { interviewId } = useParams();
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvaluation();
  }, [interviewId]);

  const loadEvaluation = async () => {
    try {
      const response = await evaluationAPI.get(interviewId);
      setEvaluation(response.data);
    } catch (error) {
      toast.error('Failed to load evaluation');
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading evaluation...</div>;
  }

  if (!evaluation) {
    return <div className="min-h-screen flex items-center justify-center">Evaluation not found</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Brain className="text-indigo-600" size={32} />
            <span className="text-2xl font-bold">InterviewIQ</span>
          </div>
          <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Back to Dashboard
          </Link>
        </div>

        {/* Overall Score */}
        <div className="bg-gradient-to-br from-indigo-50 to-teal-50 p-8 rounded-2xl border border-indigo-200 mb-8" data-testid="evaluation-overall-score">
          <div className="text-center">
            <div className="text-6xl font-bold text-indigo-600 mb-2">
              {evaluation.overall_score}/10
            </div>
            <div className={`inline-block px-4 py-2 rounded-full font-semibold ${evaluation.readiness_flag === 'Ready' ? 'bg-teal-100 text-teal-700' :
                evaluation.readiness_flag === 'Needs Practice' ? 'bg-amber-100 text-amber-700' :
                  'bg-slate-200 text-slate-700'
              }`}>
              {evaluation.readiness_flag}
            </div>

            {evaluation.explainability_tags && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {evaluation.explainability_tags.map((tag, i) => (
                  <span key={i} className="text-xs font-medium px-3 py-1 bg-white/50 text-indigo-700 rounded-lg border border-indigo-200">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 mb-8">
          <h2 className="text-2xl font-bold mb-6">Performance Breakdown</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {Object.entries(evaluation.breakdown).map(([key, value]) => (
              <div key={key} className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-1">
                  {value.toFixed(1)}
                </div>
                <div className="text-sm text-slate-600 capitalize">{key}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CheckCircle className="text-teal-500" />
            Your Strengths
          </h2>
          <ul className="space-y-3">
            {evaluation.strengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="text-teal-500 flex-shrink-0 mt-1" size={20} />
                <span className="text-slate-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Mistakes & Corrections */}
        {evaluation.mistakes && evaluation.mistakes.length > 0 && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 mb-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <XCircle className="text-red-500" />
              Mistakes & How to Fix Them
            </h2>
            <div className="space-y-6">
              {evaluation.mistakes.map((mistake, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-lg">
                  <div className="flex items-start gap-2 mb-2">
                    <XCircle className="text-red-500 flex-shrink-0 mt-1" size={18} />
                    <div>
                      <div className="font-semibold text-slate-900">What went wrong:</div>
                      <div className="text-slate-600">{mistake.what_went_wrong}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 mt-3">
                    <CheckCircle className="text-teal-500 flex-shrink-0 mt-1" size={18} />
                    <div>
                      <div className="font-semibold text-slate-900">Correction:</div>
                      <div className="text-slate-600">{mistake.correction}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Feedback */}
        {evaluation.detailed_feedback && evaluation.detailed_feedback.length > 0 && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 mb-8">
            <h2 className="text-2xl font-bold mb-6">Question-by-Question Analysis</h2>
            <div className="space-y-8">
              {evaluation.detailed_feedback.map((feedback, i) => (
                <div key={i} className="border-b border-slate-200 last:border-0 pb-6 last:pb-0">
                  <div className="font-semibold text-lg mb-3">Question {i + 1}: {feedback.question}</div>

                  <div className="mb-4">
                    <div className="text-sm font-medium text-slate-600 mb-1">Your Answer:</div>
                    <div className="bg-slate-50 p-4 rounded-lg text-slate-700">
                      {feedback.your_answer}
                    </div>
                    <div className="text-sm font-bold text-indigo-600 mt-2">
                      Score: {feedback.score}/10
                    </div>

                    {feedback.explainability_tags && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {feedback.explainability_tags.map((tag, i) => (
                          <span key={i} className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200 uppercase tracking-tighter">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {feedback.improved_answer && (
                    <div className="mb-4">
                      <div className="text-sm font-medium text-slate-600 mb-1">Improved Version:</div>
                      <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg text-slate-700">
                        {feedback.improved_answer}
                      </div>
                      {feedback.why_improved && (
                        <div className="text-sm text-slate-600 mt-2 italic">
                          💡 Why this is better: {feedback.why_improved}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Improvement Tips */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="text-violet-500" />
            Improvement Tips
          </h2>
          <ul className="space-y-3">
            {evaluation.improvement_tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <ArrowRight className="text-violet-500 flex-shrink-0 mt-1" size={20} />
                <span className="text-slate-700">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link to="/interview/start" className="btn-primary">
            Take Another Interview
          </Link>
          <Link to="/practice" className="bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-full px-6 py-2.5 font-medium">
            Practice Questions
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EvaluationPage;
