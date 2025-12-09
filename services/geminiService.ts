import { GoogleGenAI, Type, Schema } from "@google/genai";
import { GeneratedContent, Trend } from "../types";

// Helper to get a fresh client instance (important for API key updates)
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeTrendRelevance = async (trend: Trend, clientVoice: string, clientIndustry: string): Promise<string> => {
  try {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash';
    const prompt = `
      Analyze the relevance of the trend "${trend.keyword}" (${trend.description}) for a client in the ${clientIndustry} industry.
      The client's brand voice is "${clientVoice}".
      Provide a concise 3-sentence strategy on how they can leverage this trend.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "Unable to generate analysis.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "Error generating analysis. Please check your API key.";
  }
};

export const generateSocialContent = async (
  topic: string,
  clientVoice: string,
  platforms: string[]
): Promise<GeneratedContent[]> => {
  try {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash';
    
    // Define the schema using the Type enum from the SDK
    const responseSchema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          platform: { type: Type.STRING, enum: ['LinkedIn', 'Twitter', 'Instagram', 'TikTok'] },
          content: { type: Type.STRING },
          hashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedImagePrompt: { type: Type.STRING }
        },
        required: ['platform', 'content', 'hashtags'],
      }
    };

    const prompt = `
      You are a world-class social media manager.
      Generate content for the following topic: "${topic}".
      Target Audience: Professionals and consumers interested in this topic.
      Brand Voice: ${clientVoice}.
      
      Generate unique posts for the following platforms: ${platforms.join(', ')}.
      For LinkedIn, be professional and insightful.
      For Twitter, be punchy and thread-like if needed.
      For Instagram/TikTok, focus on visual descriptions or script hooks.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned");
    
    return JSON.parse(jsonText) as GeneratedContent[];

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    // Return a fallback error object structure if API fails
    return [{
      platform: 'LinkedIn',
      content: "Failed to generate content. Please ensure your API Key is valid.",
      hashtags: [],
    }] as GeneratedContent[];
  }
};

export const generateMarketingImage = async (
  prompt: string,
  size: '1K' | '2K' | '4K' = '1K'
): Promise<string | null> => {
  try {
    const ai = getAiClient();
    const model = 'gemini-3-pro-image-preview';
    
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: "1:1"
        }
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};

export const generateMarketingVideo = async (
  imageBytes: string,
  prompt: string,
  aspectRatio: '16:9' | '9:16'
): Promise<string | null> => {
  try {
    const ai = getAiClient();
    const model = 'veo-3.1-fast-generate-preview';

    // Remove header if present (e.g., data:image/png;base64,)
    const base64Data = imageBytes.split(',')[1] || imageBytes;

    let operation = await ai.models.generateVideos({
      model,
      prompt: prompt,
      image: {
        imageBytes: base64Data,
        mimeType: 'image/png', // Assuming PNG for simplicity, Veo supports common types
      },
      config: {
        numberOfVideos: 1,
        resolution: '720p', // Veo fast supports 720p
        aspectRatio: aspectRatio
      }
    });

    // Poll for completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Check every 5s
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) return null;

    // Fetch the actual video bytes using the API Key
    const response = await fetch(`${videoUri}&key=${process.env.API_KEY}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);

  } catch (error) {
    console.error("Video Generation Error:", error);
    throw error;
  }
};

export const findTrends = async (clientIndustry: string, clientVoice: string): Promise<Trend[]> => {
  try {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash';
    
    const responseSchema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          keyword: { type: Type.STRING },
          category: { type: Type.STRING },
          volume: { type: Type.NUMBER },
          growth: { type: Type.NUMBER },
          sentiment: { type: Type.STRING, enum: ['positive', 'neutral', 'negative'] },
          description: { type: Type.STRING }
        },
        required: ['id', 'keyword', 'category', 'volume', 'growth', 'sentiment', 'description']
      }
    };

    const prompt = `
      Find 5 emerging trends in the ${clientIndustry} industry that would be relevant for a brand with a "${clientVoice}" tone of voice.
      For each trend, provide:
      - A unique ID (e.g., "t_gen_1").
      - A keyword/title.
      - A category.
      - Estimated monthly search volume (number).
      - Estimated growth percentage (number).
      - General sentiment (positive, neutral, or negative).
      - A brief description.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned");
    
    return JSON.parse(jsonText) as Trend[];

  } catch (error) {
    console.error("Gemini Trend Finding Error:", error);
    return [];
  }
};
