/**
 * File Extractor Service
 * Handles extraction of text from various file formats (TXT, PDF, DOCX)
 * with support for math formulas and special formatting preservation
 */

// Regex patterns for LaTeX/math formulas
const LATEX_PATTERN = /\$\$[\s\S]*?\$\$|\$[^\$]*\$|\\[\w]+\{[^}]*\}|\\[\w]+\[[\^\w]+\]|\\[a-zA-Z]+/g;

interface ExtractedContent {
  text: string;
  formulas: Map<string, string>; // Store formulas for later restoration
  metadata?: {
    pages?: number;
    language?: string;
  };
}

/**
 * Extract text from TXT file
 */
export const extractFromTxt = async (file: File): Promise<ExtractedContent> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const { preservedText, formulas } = preserveFormulas(text);
        
        resolve({
          text: preservedText,
          formulas,
          metadata: { language: 'auto' }
        });
      } catch (err) {
        reject(err);
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read TXT file'));
    reader.readAsText(file);
  });
};

/**
 * Extract text from PDF file using PDF.js
 */
export const extractFromPdf = async (file: File): Promise<ExtractedContent> => {
  try {
    const pdfjsLib = await import('pdfjs-dist');
    
    // Set up worker for PDF processing
    const workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    const pageCount = pdf.numPages;
    
    // Extract text from each page
    for (let i = 1; i <= pageCount; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item: any) => item.str || '')
        .join(' ');
      
      fullText += `\n[Page ${i}]\n` + pageText + '\n';
    }
    
    const { preservedText, formulas } = preserveFormulas(fullText);
    
    return {
      text: preservedText,
      formulas,
      metadata: {
        pages: pageCount,
        language: 'auto'
      }
    };
  } catch (error) {
    throw new Error(`Failed to extract from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Extract text from DOCX file using JSZip
 */
export const extractFromDocx = async (file: File): Promise<ExtractedContent> => {
  try {
    const JSZip = await import('jszip');
    
    const zip = new JSZip.default();
    const zipFile = await zip.loadAsync(file);
    
    // Extract text from document.xml
    const documentXml = await zipFile.file('word/document.xml')?.async('string');
    
    if (!documentXml) {
      throw new Error('Invalid DOCX file structure');
    }
    
    // Parse XML and extract text
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(documentXml, 'text/xml');
    
    // Extract text from all text elements
    const textElements = xmlDoc.getElementsByTagName('w:t');
    let fullText = '';
    
    for (let i = 0; i < textElements.length; i++) {
      fullText += textElements[i].textContent || '';
    }
    
    const { preservedText, formulas } = preserveFormulas(fullText);
    
    return {
      text: preservedText,
      formulas,
      metadata: { language: 'auto' }
    };
  } catch (error) {
    throw new Error(`Failed to extract from DOCX: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

/**
 * Preserve LaTeX formulas during text processing
 * Replaces formulas with placeholders and stores them for later restoration
 */
const preserveFormulas = (text: string): { preservedText: string; formulas: Map<string, string> } => {
  const formulas = new Map<string, string>();
  let preservedText = text;
  let formulaIndex = 0;
  
  // Find and store all formulas
  const matches = text.match(LATEX_PATTERN) || [];
  
  matches.forEach((formula) => {
    const placeholder = `__FORMULA_${formulaIndex}__`;
    formulas.set(placeholder, formula);
    preservedText = preservedText.replace(formula, placeholder);
    formulaIndex++;
  });
  
  return { preservedText, formulas };
};

/**
 * Restore LaTeX formulas in translated text
 */
export const restoreFormulas = (text: string, formulas: Map<string, string>): string => {
  let restoredText = text;
  
  formulas.forEach((formula, placeholder) => {
    restoredText = restoredText.replace(new RegExp(placeholder, 'g'), formula);
  });
  
  return restoredText;
};

/**
 * Main file extraction function - routes to appropriate extractor
 */
export const extractTextFromFile = async (file: File): Promise<ExtractedContent> => {
  const mimeType = file.type;
  const fileName = file.name.toLowerCase();
  
  // Route by file type
  if (mimeType === 'text/plain' || fileName.endsWith('.txt')) {
    return extractFromTxt(file);
  } else if (mimeType === 'application/pdf' || fileName.endsWith('.pdf')) {
    return extractFromPdf(file);
  } else if (
    mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    fileName.endsWith('.docx')
  ) {
    return extractFromDocx(file);
  } else {
    throw new Error(`Unsupported file type: ${mimeType || fileName}`);
  }
};
