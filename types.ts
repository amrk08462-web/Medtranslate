export enum TranslationStatus {
  IDLE = 'IDLE',
  FILE_SELECTED = 'FILE_SELECTED',
  EXTRACTING = 'EXTRACTING', // Extracting text from file
  WAITING_FOR_AD = 'WAITING_FOR_AD', // The timer phase with ad
  TRANSLATING = 'TRANSLATING', // On-device translation
  REBUILDING = 'REBUILDING', // Rebuilding file
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