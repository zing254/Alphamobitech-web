import { Phone, Mail } from 'lucide-react';

const PrivacyPolicy = () => (
  <section className="py-20 bg-white">
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-slate-800 mb-8">Privacy Policy</h1>
      
      <div className="prose prose-slate max-w-none">
        <p className="text-slate-600 mb-6">Last updated: April 21, 2026</p>
        
        <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">Information We Collect</h2>
        <p className="text-slate-600 mb-4">We collect information you provide directly, including:</p>
        <ul className="list-disc list-inside text-slate-600 mb-4 space-y-2">
          <li>Name and contact information (phone, email)</li>
          <li>Device details and service requirements</li>
          <li>Payment information (processed securely via M-Pesa)</li>
          <li>Communication preferences</li>
        </ul>
        
        <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">How We Use Your Information</h2>
        <ul className="list-disc list-inside text-slate-600 mb-4 space-y-2">
          <li>To provide and deliver repair services</li>
          <li>To communicate about your booking and service status</li>
          <li>To process payments via M-Pesa</li>
          <li>To improve our services</li>
          <li>To send promotional communications (with consent)</li>
        </ul>
        
        <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">Information Sharing</h2>
        <p className="text-slate-600 mb-4">
          We do not sell your personal information. We may share information with:
        </p>
        <ul className="list-disc list-inside text-slate-600 mb-4 space-y-2">
          <li>M-Pesa for payment processing</li>
          <li>Service providers who assist in our operations</li>
          <li>Legal authorities when required by law</li>
        </ul>
        
        <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">Data Security</h2>
        <p className="text-slate-600 mb-4">
          We implement appropriate security measures to protect your information. However, no method of 
          transmission over the Internet is 100% secure.
        </p>
        
        <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">Your Rights</h2>
        <ul className="list-disc list-inside text-slate-600 mb-4 space-y-2">
          <li>Access your personal information</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion of your information</li>
          <li>Opt out of marketing communications</li>
        </ul>
        
        <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">Contact Us</h2>
        <p className="text-slate-600 mb-4">
          For privacy-related questions, contact us:
        </p>
        <div className="bg-slate-50 p-4 rounded-xl mb-8">
          <p className="text-slate-600 flex items-center gap-2 mb-2">
            <Phone className="w-4 h-4" /> +254 703 555 449
          </p>
          <p className="text-slate-600 flex items-center gap-2">
            <Mail className="w-4 h-4" /> odhiamboj791@gmail.com
          </p>
        </div>
        
        <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">Cookies</h2>
        <p className="text-slate-600 mb-4">
          We use cookies to enhance your browsing experience. You can control cookie settings through 
          your browser preferences.
        </p>
        
        <h2 className="text-xl font-semibold text-slate-800 mt-8 mb-4">Changes to This Policy</h2>
        <p className="text-slate-600 mb-8">
          We may update this policy periodically. Changes will be posted on this page with an updated revision date.
        </p>
      </div>
    </div>
  </section>
);

export default PrivacyPolicy;