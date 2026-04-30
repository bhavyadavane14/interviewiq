import React from 'react';
import { Scale, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';

const TermsOfServicePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      
      <section className="bg-slate-50 py-16 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4 text-indigo-600">
            <Scale size={32} />
            <span className="font-bold uppercase tracking-widest text-sm">Agreement</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Terms of Service</h1>
          <p className="text-slate-600">Last Updated: April 30, 2024</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-slate max-w-none space-y-12 text-slate-600 leading-relaxed">
            <p>
              Welcome to InterviewIQ. By accessing or using our website and services, you agree to be bound by these Terms of Service. Please read them carefully.
            </p>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="text-indigo-600" size={24} />
                1. Use of Services
              </h2>
              <p>
                InterviewIQ provides AI-powered interview coaching for personal career preparation. You agree to use the service only for lawful purposes and in accordance with these terms. You are responsible for maintaining the confidentiality of your account credentials.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="text-indigo-600" size={24} />
                2. AI Feedback & Accuracy
              </h2>
              <p>
                While our AI models are highly advanced, evaluations and feedback provided by InterviewIQ are for educational purposes only. We do not guarantee employment results or represent that our AI scores reflect the final decisions of human recruiters or companies.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="text-indigo-600" size={24} />
                3. Prohibited Conduct
              </h2>
              <p>You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Reverse engineer or attempt to extract the underlying AI models of InterviewIQ.</li>
                <li>Use the service to generate harmful, offensive, or discriminatory content.</li>
                <li>Attempt to bypass any security measures or access data not intended for you.</li>
                <li>Use automated scripts or "bots" to interact with the interview simulations.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Intellectual Property</h2>
              <p>
                All content on the InterviewIQ platform, including the AI logic, branding, and user interface, is the property of InterviewIQ and is protected by copyright and other intellectual property laws.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Limitation of Liability</h2>
              <p>
                InterviewIQ is provided "as is" without warranties of any kind. We shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform.
              </p>
            </div>
          </div>

          <div className="mt-16 p-8 bg-slate-900 text-white rounded-2xl text-center">
            <h3 className="text-xl font-bold mb-4">Questions about our terms?</h3>
            <p className="text-slate-400 mb-6">If you have any questions regarding these Terms of Service, please reach out to our legal team.</p>
            <a href="mailto:legal@interviewiq.com" className="text-indigo-400 font-bold hover:underline">legal@interviewiq.com</a>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default TermsOfServicePage;
