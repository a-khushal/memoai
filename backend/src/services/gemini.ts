import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { GOOGLE_API_KEY } from "../config";

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

const embeddingModel = genAI.getGenerativeModel({ model: "embedding-001" });

const chatModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function getEmbedding(text: string): Promise<number[]> {
  const res = await embeddingModel.embedContent(text);
  return res.embedding.values;
}

export async function getChatResponse(context: string, message: string): Promise<string> {
  const prompt = `Context:\n${context}\n\nUser: ${message}\nAI:`;

  const res = await chatModel.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { maxOutputTokens: 2000 },
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ],
  });

  return res.response.candidates?.[0]?.content.parts[0].text || "";
}
