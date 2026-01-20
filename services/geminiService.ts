
import { GoogleGenAI } from "@google/genai";

export const extractTextFromPdf = async (file: File): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
  
  // Convert File to base64
  const base64Data = await new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]);
    };
    reader.readAsDataURL(file);
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: file.type,
                data: base64Data,
              },
            },
            {
              text: "Please extract all the text from this document in its original reading order. Provide only the plain text content without any summaries or additional commentary. Ensure words are correctly spaced.",
            },
          ],
        },
      ],
    });

    return response.text || "";
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw new Error("Failed to extract text from PDF. Please check your file or try again.");
  }
};
