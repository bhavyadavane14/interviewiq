import React, { useState } from 'react';
import { Mail, MessageSquare, Phone, Send, CheckCircle } from 'lucide-react';
import PublicHeader from '../components/PublicHeader';
import PublicFooter from '../components/PublicFooter';
import { toast } from 'sonner';

const ContactSupportPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Message sent successfully!");
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicHeader />
      
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Contact Support</h1>
            <p className="text-lg text-slate-600">Need help with your account? Have a question about our AI evaluations? Our team is here to support your journey.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 text-indigo-600">
                  <Mail size={20} />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Email Us</h3>
                <p className="text-sm text-slate-600 mb-4">Expect a response within 24 hours.</p>
                <a href="mailto:support@interviewiq.com" className="text-indigo-600 font-medium hover:underline text-sm">support@interviewiq.com</a>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center mb-4 text-teal-600">
                  <MessageSquare size={20} />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Live Chat</h3>
                <p className="text-sm text-slate-600 mb-4">Available Mon-Fri, 9am - 6pm EST.</p>
                <button className="text-teal-600 font-medium hover:underline text-sm">Start a conversation</button>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                  <Phone size={20} />
                </div>
                <h3 className="font-bold text-slate-900 mb-1">Phone Support</h3>
                <p className="text-sm text-slate-600 mb-4">For urgent enterprise inquiries.</p>
                <span className="text-blue-600 font-medium text-sm">+1 (555) 123-4567</span>
              </div>
            </div>

            <div className="md:col-span-2">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-lg">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                        <input type="text" required className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-indigo-500 outline-none" placeholder="John" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                        <input type="text" required className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-indigo-500 outline-none" placeholder="Doe" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                      <input type="email" required className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-indigo-500 outline-none" placeholder="john@example.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                      <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-indigo-500 outline-none">
                        <option>General Inquiry</option>
                        <option>Technical Issue</option>
                        <option>Billing Question</option>
                        <option>Partnership Request</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                      <textarea required rows={6} className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:border-indigo-500 outline-none resize-none" placeholder="How can we help?"></textarea>
                    </div>
                    <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2 py-3">
                      <Send size={20} />
                      Send Message
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600">
                      <CheckCircle size={40} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Message Received!</h2>
                    <p className="text-slate-600 mb-8 text-lg">Thank you for reaching out. One of our support specialists will get back to you within 24 hours.</p>
                    <button onClick={() => setSubmitted(false)} className="text-indigo-600 font-semibold hover:underline">Send another message</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default ContactSupportPage;
