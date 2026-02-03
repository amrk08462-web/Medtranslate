import React, { useEffect, useState } from 'react';
import { X, Clock } from 'lucide-react';

interface AdOverlayProps {
  onComplete: () => void;
  duration?: number; // Duration in seconds
}

export const AdOverlay: React.FC<AdOverlayProps> = ({ onComplete, duration = 5 }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl">
      <div className="w-full max-w-lg p-1 relative">
        {/* Glow behind the ad */}
        <div className="absolute inset-0 bg-white/20 blur-3xl opacity-20" />
        
        <div className="relative glass-panel rounded-2xl p-8 text-center border border-white/20 shadow-2xl">
          
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="relative h-20 w-20 flex items-center justify-center mb-4">
               <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                 <circle cx="50" cy="50" r="45" fill="none" stroke="#333" strokeWidth="8" />
                 <circle 
                    cx="50" 
                    cy="50" 
                    r="45" 
                    fill="none" 
                    stroke="#fff" 
                    strokeWidth="8" 
                    strokeDasharray="283"
                    strokeDashoffset={283 - (283 * (duration - timeLeft) / duration)}
                    className="transition-all duration-1000 ease-linear"
                 />
               </svg>
               <span className="text-2xl font-bold font-mono">{timeLeft}</span>
            </div>
            <p className="text-white/60 text-sm uppercase tracking-widest font-medium animate-pulse">
              Translating your document...
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-black rounded-xl p-6 border border-white/10 mb-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 bg-white/10 px-2 py-1 text-[10px] text-white/50 uppercase">Ad</div>
            <h3 className="text-xl font-bold text-white mb-2">Upgrade to Medtranslate Pro</h3>
            <p className="text-white/60 text-sm mb-4">Get instant translations, zero wait times, and batch processing for your medical documents.</p>
            <button className="w-full py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-200 transition-colors">
              Start Free Trial
            </button>
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12" />
          </div>

          <p className="text-xs text-white/30">
            Please wait while we process your request securely.
          </p>
        </div>
      </div>
    </div>
  );
};