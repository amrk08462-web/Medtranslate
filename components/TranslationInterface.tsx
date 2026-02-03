import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, ArrowRightLeft, Download, CheckCircle, RefreshCcw, XCircle, ChevronDown, FileCheck, Check, ArrowRight } from 'lucide-react';
import { LANGUAGES, LanguageOption, TranslationStatus } from '../types';
import { AdOverlay } from './AdOverlay';
import { extractTextFromFile, restoreFormulas } from '../services/fileExtractor';
import { translateText } from '../services/translationBackend';
import { rebuildFile, downloadFile } from '../services/fileRebuild';

// Helper Component for Custom Dropdown
interface LanguageSelectorProps {
  label: string;
  value: LanguageOption;
  onChange: (lang: LanguageOption) => void;
  disabled?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ label, value, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative group w-full md:w-1/3" ref={containerRef}>
      <label className="block text-xs text-white/40 uppercase tracking-wider mb-2 font-medium">{label}</label>
      <div className="relative">
        <button
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between transition-all duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/5 hover:border-white/20 cursor-pointer shadow-lg'}`}
          disabled={disabled}
        >
          <span className="text-white font-medium">{value.name}</span>
          <ChevronDown className={`h-4 w-4 text-white/50 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto bg-[#0A0A0A] border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 custom-scrollbar animate-slide-up">
            <div className="sticky top-0 bg-[#0A0A0A] p-2 border-b border-white/5 z-10">
               <p className="text-[10px] text-white/30 uppercase tracking-widest px-2">Select Language</p>
            </div>
            <div className="p-1">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    onChange(lang);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between group transition-colors ${
                    lang.code === value.code 
                      ? 'bg-white/10 text-white' 
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {lang.name}
                  {lang.code === value.code && <Check className="h-3 w-3 text-white" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const TranslationInterface: React.FC = () => {
  const [status, setStatus] = useState<TranslationStatus>(TranslationStatus.IDLE);
  const [sourceLang, setSourceLang] = useState<LanguageOption>(LANGUAGES[0]); // English
  const [targetLang, setTargetLang] = useState<LanguageOption>(LANGUAGES[1]); // Spanish
  const [file, setFile] = useState<File | null>(null);
  const [translatedBlob, setTranslatedBlob] = useState<Blob | null>(null);
  const [translatedFileName, setTranslatedFileName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0); // 0-100 progress for overlay
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      const validTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const validExtensions = ['.txt', '.pdf', '.docx'];
      
      const isValidType = validTypes.includes(selectedFile.type) || 
                          validExtensions.some(ext => selectedFile.name.toLowerCase().endsWith(ext));
      
      if (!isValidType) {
        setError("Please upload a valid document (TXT, PDF, or DOCX).");
        return;
      }
      
      setFile(selectedFile);
      setStatus(TranslationStatus.FILE_SELECTED);
      setError(null);
    }
  };

  const handleStartProcess = () => {
    if (!file) {
      setError("Please upload a valid document.");
      return;
    }
    // Step 1: Show Ad/Timer with processing
    setStatus(TranslationStatus.WAITING_FOR_AD);
    setProgress(0);
  };

  const handleAdComplete = async () => {
    // Step 2: Ad finished, now start on-device processing
    if (!file) return;

    try {
      // Step 2a: Extract text from file
      setStatus(TranslationStatus.EXTRACTING);
      setProgress(10);
      
      const extracted = await extractTextFromFile(file);
      let textToTranslate = extracted.text;
      setProgress(30);
      
      // Step 2b: Translate text using on-device model
      setStatus(TranslationStatus.TRANSLATING);
      setProgress(40);
      
      const translatedText = await translateText(
        textToTranslate,
        targetLang.name,
        sourceLang.name
      );
      setProgress(80);
      
      // Restore formulas in translated text
      const finalText = restoreFormulas(translatedText, extracted.formulas);
      setProgress(85);
      
      // Step 2c: Rebuild file with translated content
      setStatus(TranslationStatus.REBUILDING);
      setProgress(90);
      
      const rebuilt = await rebuildFile(file, finalText);
      setTranslatedBlob(rebuilt.blob);
      setTranslatedFileName(rebuilt.fileName);
      setProgress(100);
      
      setStatus(TranslationStatus.COMPLETED);
    } catch (err) {
      console.error('Processing error:', err);
      setError(`Processing failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setStatus(TranslationStatus.ERROR);
    }
  };

  const handleDownload = () => {
    if (!translatedBlob) return;
    downloadFile(translatedBlob, translatedFileName);
  };

  const reset = () => {
    setFile(null);
    setTranslatedBlob(null);
    setTranslatedFileName('');
    setStatus(TranslationStatus.IDLE);
    setError(null);
    setProgress(0);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
  };

  const isProcessing = status === TranslationStatus.EXTRACTING || 
                       status === TranslationStatus.TRANSLATING || 
                       status === TranslationStatus.REBUILDING;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 relative z-20 -mt-10">
      
      {/* Ad Overlay with Progress */}
      {status === TranslationStatus.WAITING_FOR_AD && (
        <AdOverlay 
          onComplete={handleAdComplete} 
          duration={30}
          progress={progress}
          showAd={true}
        />
      )}

      {/* Main Container */}
      <div className={`glass-panel rounded-3xl p-1 transition-all duration-500 ${(status === TranslationStatus.FILE_SELECTED || isProcessing) ? 'shadow-[0_0_50px_-10px_rgba(255,255,255,0.2)] scale-[1.01]' : ''}`}>
        <div className="bg-black/40 rounded-[22px] relative min-h-[500px] flex flex-col">
           
           {/* Ambient Glows */}
           <div className="absolute inset-0 overflow-hidden rounded-[22px] pointer-events-none">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
           </div>

          {/* Content Container */}
          <div className="p-8 md:p-12 relative z-10 flex flex-col flex-1">

            {/* Header of the Box */}
            {status !== TranslationStatus.COMPLETED && (
              <div className="flex flex-col md:flex-row gap-6 justify-between items-center mb-10 relative z-30 animate-slide-up">
                 
                 <LanguageSelector 
                   label="From" 
                   value={sourceLang} 
                   onChange={setSourceLang} 
                   disabled={isProcessing}
                 />

                 <button 
                    onClick={handleSwapLanguages}
                    disabled={isProcessing}
                    className="mt-6 p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:rotate-180 disabled:opacity-50 disabled:cursor-not-allowed group shadow-lg hover:scale-110 active:scale-95"
                    title="Swap Languages"
                 >
                    <ArrowRightLeft className="h-5 w-5 text-white/70 group-hover:text-white" />
                 </button>

                 <LanguageSelector 
                   label="To" 
                   value={targetLang} 
                   onChange={setTargetLang} 
                   disabled={isProcessing}
                 />

              </div>
            )}

            {/* Center Area */}
            <div className="relative z-10 flex-1 flex flex-col justify-center">
               
               {/* State: Upload Input */}
               {status !== TranslationStatus.COMPLETED && !isProcessing && status !== TranslationStatus.WAITING_FOR_AD && (
                  <div 
                    className={`border-2 border-dashed rounded-2xl transition-all duration-300 flex flex-col items-center justify-center p-12 text-center group cursor-pointer flex-1
                      ${file ? 'border-white/40 bg-white/5' : 'border-white/10 hover:border-white/30 hover:bg-white/5'}
                    `}
                    onClick={() => fileInputRef.current?.click()}
                  >
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        className="hidden" 
                        accept=".txt,.pdf,.docx"
                        onChange={handleFileChange}
                      />
                      
                      <div className={`h-20 w-20 rounded-2xl bg-gradient-to-tr from-gray-800 to-black flex items-center justify-center mb-6 shadow-xl transition-transform duration-500 ${file ? 'scale-110' : 'group-hover:scale-110'}`}>
                         {file ? <FileText className="text-white h-10 w-10" /> : <Upload className="text-white h-10 w-10" />}
                      </div>

                      <h3 className="text-xl font-medium text-white mb-2">
                        {file ? file.name : 'Upload Document'}
                      </h3>
                      <p className="text-white/40 text-sm max-w-sm mx-auto">
                        {file ? 'Ready to process.' : 'Supports PDF, DOCX, TXT. Full on-device processing.'}
                      </p>
                  </div>
               )}

               {/* State: Processing */}
               {isProcessing && (
                 <div className="flex flex-col items-center justify-center flex-1">
                   <div className="relative mb-8">
                     <div className="h-24 w-24 rounded-full border-4 border-white/10 border-t-white animate-spin" />
                     <div className="absolute inset-0 flex items-center justify-center">
                       <FileText className="h-8 w-8 text-white/50 animate-pulse" />
                     </div>
                   </div>
                   
                   <h3 className="text-2xl font-medium text-white mb-2 animate-pulse">
                     {status === TranslationStatus.EXTRACTING && 'Extracting Text...'}
                     {status === TranslationStatus.TRANSLATING && 'Translating...'}
                     {status === TranslationStatus.REBUILDING && 'Rebuilding File...'}
                   </h3>
                   <p className="text-white/40 text-sm mt-2">
                     {status === TranslationStatus.EXTRACTING && 'Extracting text from document'}
                     {status === TranslationStatus.TRANSLATING && 'On-device translation in progress'}
                     {status === TranslationStatus.REBUILDING && 'Reconstructing file with translated content'}
                   </p>
                   
                   {/* Progress bar */}
                   <div className="mt-6 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                     <div 
                       className="h-full bg-white/50 transition-all duration-500"
                       style={{ width: `${progress}%` }}
                     />
                   </div>
                 </div>
               )}

               {/* State: Result (File Download) */}
               {status === TranslationStatus.COMPLETED && (
                 <div className="animate-slide-up flex flex-col items-center justify-center flex-1 text-center">
                    <div className="h-24 w-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(74,222,128,0.2)] transform scale-100 hover:scale-110 transition-transform">
                      <CheckCircle className="text-green-500 h-12 w-12" />
                    </div>
                    
                    <h2 className="text-3xl font-bold text-white mb-2">Translation Ready</h2>
                    <p className="text-white/50 mb-8 max-w-md">
                      Your document has been successfully processed and translated on-device. The new file is ready for download.
                    </p>

                    <div className="bg-white/5 rounded-xl p-6 border border-white/10 mb-8 w-full max-w-md flex items-center gap-4 transform hover:scale-105 transition-transform">
                       <div className="h-12 w-12 bg-white/10 rounded-lg flex items-center justify-center">
                          <FileCheck className="text-white h-6 w-6" />
                       </div>
                       <div className="text-left flex-1 min-w-0">
                          <p className="text-white font-medium truncate">{translatedFileName}</p>
                          <p className="text-white/40 text-xs uppercase tracking-wider">{targetLang.name}</p>
                       </div>
                       <div className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded">READY</div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                      <button 
                        onClick={handleDownload}
                        className="flex-1 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transform hover:scale-105 active:scale-95"
                      >
                        <Download className="h-5 w-5" />
                        Download File
                      </button>
                      
                      <button 
                         onClick={reset} 
                         className="px-6 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium transform hover:scale-105 active:scale-95"
                      >
                         Translate Another
                      </button>
                    </div>
                 </div>
               )}
               
               {/* Error State */}
               {status === TranslationStatus.ERROR && (
                  <div className="text-center py-10 animate-slide-up flex-1 flex flex-col items-center justify-center">
                     <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
                     <h3 className="text-xl font-bold text-white mb-2">Processing Error</h3>
                     <p className="text-white/50 mb-8 max-w-md">{error}</p>
                     <button 
                       onClick={reset} 
                       className="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-colors uppercase tracking-wider font-medium transform hover:scale-105 active:scale-95"
                     >
                       Try Again
                     </button>
                  </div>
               )}

            </div>

            {/* Action Button */}
            {status === TranslationStatus.FILE_SELECTED && (
               <div className="mt-8 flex justify-center animate-slide-up">
                  <button 
                    onClick={handleStartProcess}
                    className="group relative px-10 py-5 bg-white text-black font-bold text-lg rounded-full overflow-hidden transition-all hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.15)] transform"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Start Translation <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1s_infinite]" />
                  </button>
               </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};