import React, { useState, useEffect } from 'react';
import { Menu, Mail, Linkedin, Phone, X } from 'lucide-react';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const reloadPage = () => {
    window.location.reload();
  };

  const scrollToTranslation = () => {
    const element = document.getElementById('translation-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[60]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mt-4 rounded-2xl glass-panel px-5 py-4 flex items-center justify-between shadow-2xl relative transition-all duration-300 backdrop-blur-xl bg-black/20">
            {/* Top Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            
            <div className="flex items-center gap-3 z-20">
              {/* Custom Logo Design: Boxed MED TRANSLATE */}
              <div 
                onClick={reloadPage}
                className="border-2 border-white px-2 py-1 flex flex-col items-center justify-center leading-none select-none hover:bg-white hover:text-black transition-colors duration-500 group cursor-pointer"
                title="Reload Page"
              >
                <span className="text-xl font-black tracking-widest group-hover:text-black">MED</span>
                <div className="h-[1px] w-full bg-white group-hover:bg-black my-0.5" />
                <span className="text-[0.6rem] font-bold tracking-[0.2em] group-hover:text-black">TRANSLATE</span>
              </div>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 z-20">
              <a href="mailto:support@medtranslate.com" className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors">
                <Mail className="h-4 w-4" /> Contact
              </a>
              
              <div className="h-4 w-[1px] bg-white/20" />
              
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors">
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
              
              <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-white/70 hover:text-white transition-colors">
                <Phone className="h-4 w-4" /> WhatsApp
              </a>
            </nav>

            <div className="flex items-center gap-4 z-20">
              <button 
                onClick={scrollToTranslation}
                className="hidden md:block px-4 py-2 text-sm font-medium text-black bg-white rounded-lg hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              >
                Get Started
              </button>
              
              {/* Mobile Menu Button - Ultra High Z-Index, large touch target */}
              <button 
                className="md:hidden relative z-[100] text-white hover:text-white/80 transition-colors p-3 rounded-full hover:bg-white/10 active:bg-white/20"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
            
            {/* Bottom Gradient Line */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 z-[50] bg-black/95 backdrop-blur-3xl md:hidden transition-all duration-500 ease-in-out ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-10'
        }`}
      >
          {/* Aesthetic Background for Menu - Monochrome Silver */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             {/* Use similar gradient blobs as App background but simpler */}
            <div className="absolute top-[-10%] right-[-20%] w-[80vw] h-[80vw] bg-white/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-20%] w-[80vw] h-[80vw] bg-zinc-800/20 rounded-full blur-[100px]" />
          </div>

          <nav className="relative z-10 flex flex-col items-center justify-center h-full gap-8 p-6">
            <a 
              href="mailto:support@medtranslate.com" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-4 text-2xl font-medium text-white/80 hover:text-white transition-colors"
            >
              <Mail className="h-6 w-6" /> Contact Support
            </a>
            
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)} 
              className="flex items-center gap-4 text-2xl font-medium text-white/80 hover:text-white transition-colors"
            >
              <Linkedin className="h-6 w-6" /> LinkedIn
            </a>
            
            <a 
              href="https://wa.me/" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)} 
              className="flex items-center gap-4 text-2xl font-medium text-white/80 hover:text-white transition-colors"
            >
              <Phone className="h-6 w-6" /> WhatsApp
            </a>

            <div className="h-[1px] w-24 bg-white/20 my-4" />

            <button 
               onClick={scrollToTranslation}
               className="w-full max-w-xs py-4 text-black bg-white rounded-xl hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.4)] font-bold text-lg"
             >
              Get Started Now
            </button>
          </nav>
      </div>
    </>
  );
};