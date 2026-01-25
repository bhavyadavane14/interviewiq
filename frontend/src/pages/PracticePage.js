import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { practiceAPI } from '../utils/api';
import { Brain, Download, BookOpen, Check } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';

const PracticePage = () => {
  const [category, setCategory] = useState('HR');
  const [questions, setQuestions] = useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [attemptedAnswers, setAttemptedAnswers] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadQuestions();
  }, [category]);

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const response = await practiceAPI.getQuestions(category);
      setQuestions(response.data);
    } catch (error) {
      toast.error('Failed to load questions');
    }
    setLoading(false);
  };

  const handleAnswerSubmit = (index) => {
    setAttemptedAnswers({ ...attemptedAnswers, [index]: true });
    toast.success('Answer submitted! See the ideal answer below.');
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = 20;

    doc.setFontSize(18);
    doc.text(`${category} Interview Questions`, margin, yPosition);
    yPosition += 15;

    doc.setFontSize(12);
    questions.forEach((q, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFont(undefined, 'bold');
      const questionLines = doc.splitTextToSize(`Q${index + 1}: ${q.question}`, maxWidth);
      doc.text(questionLines, margin, yPosition);
      yPosition += questionLines.length * 7 + 5;

      doc.setFont(undefined, 'normal');
      const answerLines = doc.splitTextToSize(`Ideal Answer: ${q.ideal_answer}`, maxWidth);
      doc.text(answerLines, margin, yPosition);
      yPosition += answerLines.length * 7 + 10;
    });

    doc.save(`${category}_Interview_Questions.pdf`);
    toast.success('PDF downloaded!');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Brain className="text-indigo-600" size={32} />
            <span className="text-2xl font-bold">InterviewIQ</span>
          </Link>
          <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12" data-testid="practice-page">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Practice Questions</h1>
          <p className="text-slate-600">Practice first, then attempt a mock interview for evaluation</p>
        </div>

        {/* Category Selection */}
        <div className="flex gap-4 mb-8">
          {['HR', 'Technical', 'Behavioral'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                category === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
              data-testid={`category-${cat.toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Download Button */}
        <button
          onClick={downloadPDF}
          className="mb-6 flex items-center gap-2 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 rounded-full px-6 py-2.5 font-medium"
          data-testid="download-pdf-btn"
        >
          <Download size={20} />
          Download as PDF
        </button>

        {/* Questions List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12 text-slate-400">Loading questions...</div>
          ) : (
            questions.map((q, index) => (
              <div key={q.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden" data-testid={`question-${index}`}>
                <button
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="w-full p-6 text-left flex items-start justify-between hover:bg-slate-50 transition-all"
                >
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-indigo-600 mb-1">
                      Question {index + 1}
                    </div>
                    <div className="font-semibold text-lg">{q.question}</div>
                  </div>
                  <BookOpen className="text-slate-400 flex-shrink-0 ml-4" size={20} />
                </button>

                {expandedIndex === index && (
                  <div className="px-6 pb-6 space-y-4 border-t border-slate-200 pt-4">
                    {!attemptedAnswers[index] ? (
                      <div>
                        <label className="block text-sm font-medium mb-2">Your Answer:</label>
                        <textarea
                          rows={4}
                          className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                          placeholder="Type your answer here..."
                        />
                        <button
                          onClick={() => handleAnswerSubmit(index)}
                          className="mt-3 btn-primary flex items-center gap-2"
                        >
                          <Check size={20} />
                          Submit to See Ideal Answer
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm font-medium text-teal-600 mb-2">✓ Ideal Answer:</div>
                          <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg text-slate-700">
                            {q.ideal_answer}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-indigo-600 mb-2">Key Points to Cover:</div>
                          <ul className="list-disc list-inside space-y-1 text-slate-700">
                            {q.key_points.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <div className="text-sm font-medium text-red-600 mb-2">Common Mistakes to Avoid:</div>
                          <ul className="list-disc list-inside space-y-1 text-slate-700">
                            {q.common_mistakes.map((mistake, i) => (
                              <li key={i}>{mistake}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-br from-indigo-50 to-teal-50 p-8 rounded-2xl border border-indigo-200 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready for a Full Mock Interview?</h2>
          <p className="text-slate-600 mb-6">Test your skills with AI-powered adaptive questions and get detailed feedback</p>
          <Link to="/interview/start" className="btn-primary inline-block">
            Start Mock Interview
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;