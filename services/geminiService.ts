import { GoogleGenAI } from "@google/genai";

const getGeminiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey });
};

const fileToGenerativePart = async (file: File): Promise<{inlineData: {data: string, mimeType: string}}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      // Remove data URL prefix (e.g. "data:application/pdf;base64,")
      const base64Content = base64Data.split(',')[1];
      resolve({
        inlineData: {
          data: base64Content,
          mimeType: file.type
        }
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const translateDocument = async (
  file: File,
  targetLang: string,
  sourceLang: string = 'Auto'
): Promise<string> => {
  try {
    const ai = getGeminiClient();
    // Using gemini-3-pro-preview for robust OCR and complex text handling
    const model = 'gemini-3-pro-preview';

    const filePart = await fileToGenerativePart(file);

    const prompt = `
      You are a high-precision medical translator and OCR engine.
      Task:
      1. Analyze the attached document (which may be a PDF, image, or text file).
      2. Perform Optical Character Recognition (OCR) to extract all text content accurately, preserving the original structure and formatting as much as possible.
      3. Translate the extracted text from ${sourceLang} to ${targetLang}.
      4. Return ONLY the translated text content. Do not include markdown code blocks (like \`\`\`json) or conversational filler. The output will be saved directly to a file.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [filePart, { text: prompt }]
      },
    });

    return response.text || "Translation failed to generate text.";
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
};