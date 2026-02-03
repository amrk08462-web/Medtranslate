export enum TranslationStatus {
  IDLE = 'IDLE',
  FILE_SELECTED = 'FILE_SELECTED',
  WAITING_FOR_AD = 'WAITING_FOR_AD', // The timer phase
  PROCESSING = 'PROCESSING', // Calling Gemini
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface LanguageOption {
  code: string;
  name: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'ar', name: 'Arabic' },
];