import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getGeminiModel = (modelName = "gemini-2.5-flash") => {
  return genAI.getGenerativeModel({ model: modelName });
};

export const generateResponse = async (prompt, context = "") => {
  try {
    const model = getGeminiModel();
    const fullPrompt = `${context}\n\nUser: ${prompt}`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating response:", error);
    return "Maaf, terjadi error saat memproses permintaan Anda.";
  }
};
