import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      
      <section className="bg-slate-50 py-16 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4 text-indigo-600">
            <Shield size={32} />
            <span className="font-bold uppercase tracking-widest text-sm">Legal & Compliance</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-600">Last Updated: April 30, 2024</p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-slate max-w-none space-y-12">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Eye className="text-indigo-600" size={24} />
                1. Data Collection
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                At InterviewIQ, we collect information that you provide directly to us when you create an account, participate in mock interviews, or communicate with us. This includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
                <li>Personal identifiers (Name, Email address)</li>
                <li>Professional details (Current role, target industries)</li>
                <li>Voice recordings and transcripts from mock interviews</li>
                <li>Self-reported feedback and ratings</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Lock className="text-indigo-600" size={24} />
                2. How We Use Your Data
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Your data is used exclusively to provide and improve our AI coaching services. We use interview transcripts to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-600 ml-4">
                <li>Generate personalized performance evaluations</li>
                <li>Provide explainable feedback and suggested improvements</li>
                <li>Train and fine-tune our adaptive AI models (in an anonymized format)</li>
                <li>Monitor platform performance and security</li>
              </ul>
              <div className="mt-6 bg-indigo-50 p-4 rounded-lg border border-indigo-100 text-sm font-medium text-indigo-800">
                <strong>Important:</strong> We do NOT sell your personal data or interview transcripts to third-party advertisers.
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="text-indigo-600" size={24} />
                3. Data Retention & Security
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your information. Data is encrypted at rest and in transit.
              </p>
              <p className="text-slate-600 leading-relaxed">
                You have the right to request the deletion of your account and all associated interview data at any time through your dashboard settings or by contacting our support team.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Third-Party Services</h2>
              <p className="text-slate-600 leading-relaxed">
                We use secure AI processing partners (like OpenAI and Google Cloud) to analyze interview transcripts. These partners are strictly prohibited from using your data for their own purposes and must adhere to our rigorous security standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default PrivacyPolicyPage;
