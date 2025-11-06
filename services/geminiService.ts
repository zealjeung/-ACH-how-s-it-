
import { GoogleGenAI } from "@google/genai";
import { NewsSummary, GroundingChunk } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const fetchNewsSummary = async (tokenName: string, tokenSymbol: string): Promise<NewsSummary> => {
  const prompt = `Summarize to me daily what's the latest with the Token $${tokenSymbol.toUpperCase()} ${tokenName}`;
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const summary = response.text;
    const groundingChunks: GroundingChunk[] = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    // Filter out any potential empty or malformed chunks
    const validSources = groundingChunks.filter(chunk => chunk.web && chunk.web.uri && chunk.web.title);

    return {
      summary,
      sources: validSources,
    };
  } catch (error) {
    console.error("Error fetching news summary:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to fetch news summary from Gemini API: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching the news summary.");
  }
};