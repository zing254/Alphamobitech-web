import { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(() => localStorage.getItem('cookieConsent') === null);

  useEffect(() => {
    if (!showBanner && !localStorage.getItem('cookieConsent')) {
      localStorage.setItem('cookieConsent', 'accepted');
    }
  }, [showBanner]);

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-white p-4 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-300">
          <p>
            We use cookies to improve your experience. By continuing to visit this site you agree to our{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = '#privacy'; }} className="text-amber-500 hover:underline">Privacy Policy</a> and{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); window.location.hash = '#terms'; }} className="text-amber-500 hover:underline">Terms of Service</a>.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { localStorage.setItem('cookieConsent', 'accepted'); setShowBanner(false); }}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm font-medium transition-colors"
          >
            Accept
          </button>
          <button
            onClick={() => { localStorage.setItem('cookieConsent', 'declined'); setShowBanner(false); }}
            className="px-4 py-2 bg-transparent border border-slate-600 hover:bg-slate-800 rounded-lg text-sm transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
