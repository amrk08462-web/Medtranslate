import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

const BaseModal: React.FC<ModalProps> = ({ isOpen, onClose, title, lastUpdated, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-slide-up">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-3xl max-h-[85vh] overflow-y-auto glass-panel rounded-2xl border border-white/10 shadow-2xl bg-[#050505] z-10 custom-scrollbar">
        <div className="sticky top-0 right-0 z-20 flex justify-end p-4 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none">
           <button 
            onClick={onClose}
            className="pointer-events-auto p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-colors backdrop-blur-md"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="px-8 pb-10 pt-2 text-white/80 space-y-6">
          <div className="border-b border-white/10 pb-6">
            <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
            {lastUpdated && <p className="text-sm text-white/40 font-mono">Last Updated: {lastUpdated}</p>}
          </div>
          
          <div className="space-y-6 text-sm leading-relaxed text-white/70">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const PrivacyModal: React.FC<{isOpen: boolean, onClose: () => void}> = (props) => (
  <BaseModal {...props} title="Privacy Policy" lastUpdated="February 2026">
    <p>Welcome to Medtranslate. We respect your privacy and are committed to protecting the data you share with us. This Privacy Policy explains how we handle your information when you use our PDF translation and formatting services.</p>

    <div>
        <h3 className="text-lg font-bold text-white mb-2">1. Information We Collect</h3>
        <p>Since our service does not require account creation, we collect minimal data:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
        <li><strong>Uploaded Files:</strong> The PDF documents you upload for translation.</li>
        <li><strong>Usage Data:</strong> Non-identifiable information such as browser type, device type, and time of visit (for analytics purposes).</li>
        <li><strong>Payment Information:</strong> All payments are processed by third-party providers (e.g., Stripe). We do not store or view your credit card details.</li>
        </ul>
    </div>

    <div>
        <h3 className="text-lg font-bold text-white mb-2">2. How We Use Your Information</h3>
        <p>We use your uploaded files solely for the purpose of:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
        <li>Extracting text using OCR technology.</li>
        <li>Translating content via AI models.</li>
        <li>Reconstructing the document layout.</li>
        </ul>
    </div>

    <div>
        <h3 className="text-lg font-bold text-white mb-2">3. Data Retention & File Deletion</h3>
        <p>We prioritize your security.</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
        <li><strong>Temporary Processing:</strong> Your files are processed in real-time.</li>
        <li><strong>Automatic Deletion:</strong> Once the translated file is generated and downloaded, the original and translated files are automatically deleted from our servers within 24 hours. We do not store your documents permanently.</li>
        </ul>
    </div>

    <div>
        <h3 className="text-lg font-bold text-white mb-2">4. Third-Party Services</h3>
        <p>To provide our service, we share data with trusted third-party providers:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
        <li><strong>AI & Translation:</strong> We use Google Gemini API to process and translate text. Google does not use your data to train their models in this API context (subject to Google's API data policy).</li>
        <li><strong>Hosting:</strong> Our infrastructure is hosted on secure cloud providers.</li>
        </ul>
    </div>

    <div>
        <h3 className="text-lg font-bold text-white mb-2">5. Cookies</h3>
        <p>We may use essential cookies to ensure the website functions correctly (e.g., to keep your session active during file processing). We do not use cookies for tracking personal ads.</p>
    </div>

    <div>
        <h3 className="text-lg font-bold text-white mb-2">6. Contact Us</h3>
        <p>If you have any questions about this policy, please contact us at: <a href="mailto:support@medtranslate.com" className="text-white hover:underline">support@medtranslate.com</a>.</p>
    </div>
  </BaseModal>
);

export const TermsModal: React.FC<{isOpen: boolean, onClose: () => void}> = (props) => (
  <BaseModal {...props} title="Terms of Use" lastUpdated="February 2026">
    <p>By accessing or using Medtranslate, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not use our service.</p>

    <div>
        <h3 className="text-lg font-bold text-white mb-2">1. Description of Service</h3>
        <p>Medtranslate provides an AI-powered tool that translates PDF documents while attempting to preserve the original layout.</p>
    </div>

    <div>
        <h3 className="text-lg font-bold text-white mb-2">2. Accuracy and AI Disclaimer</h3>
        <ul className="list-disc pl-5 space-y-2 mt-2">
        <li><strong>"As Is" Basis:</strong> The service is provided on an "as is" and "as available" basis.</li>
        <li><strong>AI Limitations:</strong> Translations are generated by Artificial Intelligence (Google Gemini). While we strive for high quality, we do not guarantee 100% accuracy in translation or formatting.</li>
        <li><strong>Not Professional Advice:</strong> This tool should not be used as a substitute for certified translation services (e.g., for legal or medical documents). We are not liable for any misunderstandings or errors resulting from the translation.</li>
        </ul>
    </div>

    <div>
        <h3 className="text-lg font-bold text-white mb-2">3. User Conduct</h3>
        <p>You agree NOT to upload:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
        <li>Files containing viruses or malicious code.</li>
        <li>Content that is illegal, hateful, or violates the intellectual property rights of others.</li>
        <li>Confidential data that you do not have permission to share.</li>
        </ul>
    </div>

    <div>
        <h3 className="text-lg font-bold text-white mb-2">4. Intellectual Property</h3>
        <ul className="list-disc pl-5 space-y-2 mt-2">
        <li><strong>Your Data:</strong> You retain all rights and ownership of the files you upload. We do not claim ownership of your content.</li>
        <li><strong>Our Service:</strong> The design, code, and branding of Medtranslate are owned by us.</li>
        </ul>
    </div>

    <div>
        <h3 className="text-lg font-bold text-white mb-2">5. Payments and Refunds</h3>
        <ul className="list-disc pl-5 space-y-2 mt-2">
        <li><strong>Pricing:</strong> Prices are displayed clearly before payment.</li>
        <li><strong>Refunds:</strong> Due to the nature of digital goods (immediate consumption of server resources), all sales are final. However, if a technical error prevents the file from being delivered, please contact support for a resolution.</li>
        </ul>
    </div>

    <div>
        <h3 className="text-lg font-bold text-white mb-2">6. Limitation of Liability</h3>
        <p>To the fullest extent permitted by law, Medtranslate shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.</p>
    </div>

    <div>
        <h3 className="text-lg font-bold text-white mb-2">7. Changes to Terms</h3>
        <p>We reserve the right to modify these terms at any time. Continued use of the website constitutes acceptance of the new terms.</p>
    </div>
  </BaseModal>
);
