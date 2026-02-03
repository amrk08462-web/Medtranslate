import React from 'react';
import { Linkedin, Phone, Globe, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenTerms }) => {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
             <div className="flex items-center gap-2 mb-4">
               <span className="text-2xl font-bold text-white">Medtranslate</span>
             </div>
             <p className="text-white/40 text-sm leading-relaxed max-w-xs">
               Bridging language barriers with premium AI technology. 
               Experience seamless translation in a luxurious environment.
             </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              </li>
              <li>
                <a href="https://wa.me/1234567890" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm">
                  <Phone className="h-4 w-4" /> WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <div>
             <h3 className="text-white font-semibold mb-4">Address</h3>
             <ul className="space-y-3">
               <li className="flex items-start gap-2 text-white/60 text-sm">
                 <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                 <span>
                   100 Innovation Drive,<br />
                   Tech District, NY 10001
                 </span>
               </li>
               <li className="flex items-center gap-2 text-white/60 text-sm hover:text-white cursor-pointer">
                 <Globe className="h-4 w-4" /> medtranslate.io
               </li>
             </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs">© 2024 Medtranslate Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <button onClick={onOpenPrivacy} className="text-white/30 hover:text-white text-xs transition-colors">Privacy</button>
            <button onClick={onOpenTerms} className="text-white/30 hover:text-white text-xs transition-colors">Terms</button>
          </div>
        </div>
      </div>
    </footer>
  );
};