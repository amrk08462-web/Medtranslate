import React, { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TranslationInterface } from './components/TranslationInterface';
import { PrivacyModal, TermsModal } from './components/LegalModals';

const App: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'none' | 'privacy' | 'terms'>('none');

  return (
    <div className="min-h-screen bg-[#000000] text-white relative selection:bg-white/20 selection:text-white overflow-x-hidden">
      
      {/* 
        LIQUID CHROME BACKGROUND
        Recreating the reference image style using SVGs and Filters.
        Strictly Black, White, and Silver.
      */}
      <div className="fixed inset-0 bg-black pointer-events-none z-0">
        
        {/* Base Texture */}
        <div className="absolute inset-0 bg-noise opacity-[0.08] mix-blend-overlay z-[20]" />
        
        {/* Subtle Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_90%)] z-[10]" />

        {/* CHROME SVG LAYER */}
        <svg className="absolute inset-0 w-full h-full z-[1] opacity-80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            {/* Chrome Gradient: Transparent -> White Highlight -> Transparent */}
            <linearGradient id="chrome" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
                <stop offset="30%" stopColor="rgba(255, 255, 255, 0.1)" />
                <stop offset="50%" stopColor="rgba(255, 255, 255, 0.9)" />
                <stop offset="70%" stopColor="rgba(255, 255, 255, 0.1)" />
                <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
            </linearGradient>
            
            {/* Liquid Filter to smooth edges and create the 'melted' look */}
            <filter id="liquid">
                <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
                <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
            </filter>

            <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
          </defs>

          {/* Large Liquid Flow - Top Right */}
          <g filter="url(#liquid)">
             <path d="M 800 -200 Q 500 400 1200 600 T 1800 200" fill="none" stroke="url(#chrome)" strokeWidth="60" className="animate-float" style={{opacity: 0.4}} />
             <path d="M 800 -200 Q 500 400 1200 600 T 1800 200" fill="none" stroke="white" strokeWidth="2" className="animate-float" style={{opacity: 0.6}} />
          </g>

          {/* Sharp Chrome Curve - Bottom Left */}
          <g filter="url(#glow)">
             <path d="M -200 800 C 200 600, 400 900, 800 800 S 1400 1200, 1600 1000" fill="none" stroke="url(#chrome)" strokeWidth="20" className="animate-float" style={{animationDelay: '-2s', opacity: 0.5}} />
             <path d="M -200 800 C 200 600, 400 900, 800 800 S 1400 1200, 1600 1000" fill="none" stroke="white" strokeWidth="1" className="animate-float" style={{animationDelay: '-2s', opacity: 0.8}} />
          </g>

          {/* Abstract Center Pools */}
          <circle cx="85%" cy="85%" r="300" stroke="url(#chrome)" strokeWidth="40" fill="none" filter="url(#liquid)" className="animate-blob opacity-20" />
          <path d="M 100 200 Q 300 100 400 300 T 100 500" stroke="url(#chrome)" strokeWidth="15" fill="none" filter="url(#liquid)" className="animate-float opacity-30" style={{animationDuration: '10s'}} />
        </svg>

        {/* Extra "Specular Highlights" (The bright white spots on black) */}
        <div className="absolute top-[20%] right-[30%] w-[100px] h-[100px] bg-white blur-[50px] opacity-20 animate-pulse" />
        <div className="absolute bottom-[30%] left-[20%] w-[150px] h-[150px] bg-white blur-[60px] opacity-10 animate-pulse" style={{animationDelay: '1s'}} />

      </div>

      <Header />

      <main className="pt-32 pb-10 relative z-10">
        
        {/* Hero Section */}
        <section className="relative px-4 sm:px-6 lg:px-8 mb-20 text-center">
           {/* Badge - Monochrome Silver */}
           <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-white/20 bg-white/5 backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.05)] animate-slide-up">
             <span className="text-xs font-bold tracking-widest text-zinc-300 uppercase">Your smart learning partner</span>
           </div>
           
           {/* Main Heading with Silver Gradient */}
           <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
             <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-600 filter drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
               Don't let language <br /> stop your passion
             </span>
           </h1>
           
           {/* Subtext - Cool Gray */}
           <p className="max-w-2xl mx-auto text-lg text-zinc-400 leading-relaxed mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
             We know how exhausting it is to translate and learn simultaneously. We've designed a tool that translates your files accurately while preserving their original formatting, so you can focus on what matters most: knowledge.
           </p>

           {/* Robot Doctor Image */}
           <div className="relative w-full max-w-xl mx-auto mb-10 animate-float min-h-[300px] flex items-center justify-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
              {/* Image Back Glow - Pure White/Silver */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/10 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />
              
              <img 
                 src="https://file-service.M6P77.use1.dev/file/a7cc2107-1e5e-4c7b-b5d1-678550170a4a" 
                 alt="AI Medical Robot" 
                 referrerPolicy="no-referrer"
                 className="relative z-10 w-full h-auto max-h-[600px] object-contain mx-auto drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                 onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?q=80&w=800&auto=format&fit=crop";
                    e.currentTarget.style.filter = "grayscale(100%) contrast(120%)"; 
                 }}
               />
           </div>
        </section>

        {/* Translation Box Area */}
        <div id="translation-section" className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <TranslationInterface />
        </div>
        
      </main>

      <Footer 
        onOpenPrivacy={() => setActiveModal('privacy')} 
        onOpenTerms={() => setActiveModal('terms')} 
      />

      <PrivacyModal 
        isOpen={activeModal === 'privacy'} 
        onClose={() => setActiveModal('none')} 
      />
      
      <TermsModal 
        isOpen={activeModal === 'terms'} 
        onClose={() => setActiveModal('none')} 
      />

    </div>
  );
};

export default App;