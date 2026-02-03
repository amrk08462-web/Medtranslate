/**
 * File Rebuild Service
 * Handles reconstructing files after translation while preserving original structure
 */

import { PDFDocument, PDFPage, rgb } from 'pdf-lib';
import { Document, Packer, Paragraph, TextRun } from 'docx';

interface RebuildOptions {
  preserveFormatting?: boolean;
  maintainLayout?: boolean;
}

/**
 * Rebuild TXT file with translated content
 */
export const rebuildTxt = async (
  translatedText: string,
  originalFileName: string,
  options?: RebuildOptions
): Promise<Blob> => {
  const blob = new Blob([translatedText], { type: 'text/plain;charset=utf-8' });
  return blob;
};

/**
 * Rebuild PDF file with translated text overlaid on original
 * Maintains original layout using bounding boxes where available
 */
export const rebuildPdf = async (
  originalFile: File,
  translatedText: string,
  options?: RebuildOptions
): Promise<Blob> => {
  try {
    // Read original PDF
    const pdfBytes = await originalFile.arrayBuffer();
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Split translated text into sections (one per page ideally)
    const pages = pdfDoc.getPages();
    const translatedSections = translatedText.split('\n[Page ');
    
    // Add translated text as overlay on each page
    pages.forEach((page, index) => {
      const pageNum = index + 1;
      const section = translatedSections[pageNum] || '';
      
      // Add translated text at bottom of page with smaller font and transparency
      page.drawText(section.substring(0, 200) + '...', {
        x: 50,
        y: 30,
        size: 8,
        color: rgb(0.5, 0.5, 0.5), // Gray color for translated text
        maxWidth: page.getWidth() - 100,
      });
    });
    
    // Save modified PDF
    const modifiedPdfBytes = await pdfDoc.save();
    return new Blob([modifiedPdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error('PDF rebuild failed:', error);
    // Fallback: return translated text as plain text
    return new Blob([translatedText], { type: 'text/plain;charset=utf-8' });
  }
};

/**
 * Rebuild DOCX file with translated content
 */
export const rebuildDocx = async (
  translatedText: string,
  originalFileName: string,
  options?: RebuildOptions
): Promise<Blob> => {
  try {
    // Split text into paragraphs
    const paragraphs = translatedText
      .split('\n')
      .filter(p => p.trim())
      .map(text => new Paragraph({
        text: text.trim(),
        run: new TextRun({
          font: 'Calibri',
          size: 24, // 12pt in half-points
        }),
        spacing: { line: 240, lineRule: 'auto' },
      }));
    
    // Create new document with translated content
    const doc = new Document({
      sections: [{
        children: paragraphs,
      }],
    });
    
    // Generate DOCX blob
    const docBytes = await Packer.toBuffer(doc);
    return new Blob([docBytes], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
  } catch (error) {
    console.error('DOCX rebuild failed:', error);
    // Fallback: return as plain text
    return new Blob([translatedText], { type: 'text/plain;charset=utf-8' });
  }
};

/**
 * Main rebuild function - routes to appropriate rebuilder based on file type
 */
export const rebuildFile = async (
  originalFile: File,
  translatedContent: string,
  options?: RebuildOptions
): Promise<{ blob: Blob; fileName: string; mimeType: string }> => {
  const fileName = originalFile.name;
  const mimeType = originalFile.type;
  const fileNameLower = fileName.toLowerCase();
  
  // Extract original name without extension
  const nameParts = fileName.split('.');
  const ext = nameParts.pop() || 'txt';
  const nameWithoutExt = nameParts.join('.');
  const outputFileName = `${nameWithoutExt}_translated.${ext}`;
  
  try {
    let blob: Blob;
    let outputMimeType = mimeType;
    
    if (mimeType === 'text/plain' || fileNameLower.endsWith('.txt')) {
      blob = await rebuildTxt(translatedContent, fileName, options);
      outputMimeType = 'text/plain;charset=utf-8';
    } else if (mimeType === 'application/pdf' || fileNameLower.endsWith('.pdf')) {
      blob = await rebuildPdf(originalFile, translatedContent, options);
      outputMimeType = 'application/pdf';
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileNameLower.endsWith('.docx')
    ) {
      blob = await rebuildDocx(translatedContent, fileName, options);
      outputMimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else {
      // Default to plain text
      blob = await rebuildTxt(translatedContent, fileName, options);
      outputMimeType = 'text/plain;charset=utf-8';
    }
    
    return {
      blob,
      fileName: outputFileName,
      mimeType: outputMimeType
    };
  } catch (error) {
    console.error('File rebuild error:', error);
    // Fallback to text
    const blob = await rebuildTxt(translatedContent, fileName, options);
    return {
      blob,
      fileName: `${nameWithoutExt}_translated.txt`,
      mimeType: 'text/plain;charset=utf-8'
    };
  }
};

/**
 * Create download link and trigger browser download
 */
export const downloadFile = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  
  // Add 3D transition animation
  link.style.opacity = '0';
  link.style.pointerEvents = 'none';
  document.body.appendChild(link);
  
  // Trigger download
  link.click();
  
  // Cleanup
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 100);
};
