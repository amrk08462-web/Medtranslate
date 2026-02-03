import React, { useEffect, useState, useRef } from 'react';
import { X } from 'lucide-react';

interface AdOverlayProps {
  onComplete: () => void;
  duration?: number; // Duration in seconds
  showAd?: boolean;
  progress?: number; // 0-100 progress percentage
}

export const AdOverlay: React.FC<AdOverlayProps> = ({ 
  onComplete, 
  duration = 30,
  showAd = true,
  progress = 0
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [displayProgress, setDisplayProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Animate progress bar smoothly
  useEffect(() => {
    setDisplayProgress(progress);
  }, [progress]);

  // Timer countdown
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

  // Load AdSense script on mount
  useEffect(() => {
    if (showAd && typeof window !== 'undefined') {
      // Load Google AdSense script
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXX';
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);

      // Push ads configuration
      window.setTimeout(() => {
        try {
          (window as any).adsbygoogle = (window as any).adsbygoogle || [];
          (window as any).adsbygoogle.push({});
        } catch (e) {
          console.warn('AdSense loading skipped:', e);
        }
      }, 500);
    }
  }, [showAd]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl">
      {/* Ambient glass particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/5 blur-2xl animate-float"
            style={{
              width: Math.random() * 300 + 100 + 'px',
              height: Math.random() * 300 + 100 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: (Math.random() * 10 + 15) + 's'
            }}
          />
        ))}
      </div>

      <div ref={containerRef} className="w-full max-w-2xl px-6 relative z-10">
        {/* Premium glass panel with blur effect */}
        <div className="relative glass-panel rounded-3xl p-1 shadow-2xl animate-slide-up">
          <div className="relative bg-black/40 rounded-[22px] overflow-hidden backdrop-blur-xl">
            {/* Inner glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="relative p-8 md:p-12 text-center">
              
              {/* Loader Circle with Timer */}
              <div className="flex flex-col items-center justify-center mb-8">
                <div className="relative h-32 w-32 flex items-center justify-center mb-6">
                  {/* Background circle */}
                  <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-lg" viewBox="0 0 120 120">
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="54" 
                      fill="none" 
                      stroke="rgba(255,255,255,0.1)" 
                      strokeWidth="6" 
                    />
                    {/* Progress circle */}
                    <circle 
                      cx="60" 
                      cy="60" 
                      r="54" 
                      fill="none" 
                      stroke="url(#progressGradient)" 
                      strokeWidth="6"
                      strokeDasharray={`${2 * Math.PI * 54}`}
                      strokeDashoffset={2 * Math.PI * 54 * (1 - displayProgress / 100)}
                      className="transition-all duration-500 ease-out drop-shadow-lg filter blur-[0.5px]"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.5)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Center content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black font-mono bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                      {Math.ceil(timeLeft)}
                    </span>
                    <span className="text-xs text-white/50 mt-1 uppercase tracking-widest font-medium">seconds</span>
                  </div>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Processing...</h2>
                <p className="text-white/60 text-sm md:text-base">Your document is being translated</p>
              </div>

              {/* Linear progress bar */}
              <div className="mb-8">
                <div className="relative w-full h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm border border-white/20">
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-white/40 via-white/80 to-white/40 rounded-full shadow-lg"
                    style={{
                      width: `${displayProgress}%`,
                      transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: '0 0 20px rgba(255,255,255,0.4), inset 0 0 10px rgba(255,255,255,0.2)'
                    }}
                  />
                  <div className="absolute inset-0 opacity-0 animate-pulse" style={{animationDuration: '2s'}} />
                </div>
                <p className="text-xs text-white/40 mt-2">{Math.round(displayProgress)}% Complete</p>
              </div>

              {/* Google AdSense Placeholder */}
              {showAd && (
                <div className="mb-6 p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                  <div className="text-xs text-white/40 uppercase tracking-widest mb-3 font-medium">Advertisement</div>
                  <div className="ad-container" style={{ minHeight: '250px' }}>
                    {/* AdSense ad will be injected here */}
                    <ins 
                      className="adsbygoogle" 
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        width: '100%',
                        height: '100%'
                      }}
                      data-ad-layout="in-article"
                      data-ad-format="auto"
                      data-ad-client="ca-pub-XXXXXXXXXXXXX"
                      data-ad-slot="XXXXXXXXX"
                    />
                  </div>
                </div>
              )}

              {/* Status message */}
              <div className="flex items-center justify-center gap-2 text-white/70 text-sm">
                <div className="w-2 h-2 rounded-full bg-white/50 animate-pulse" />
                <span>Converting & Translating Document</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
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