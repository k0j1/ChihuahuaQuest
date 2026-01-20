import { GoogleGenAI, Type } from "@google/genai";
import { Treasure } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using a specific model suitable for creative text generation
const MODEL_NAME = "gemini-3-flash-preview";

export const generateTreasure = async (): Promise<Treasure> => {
  try {
    const prompt = `
      ファンタジーRPGの世界で、犬の冒険家が地面を掘って見つけた宝物を1つ生成してください。
      ユニークで、少しユーモラスなものが良いです。
      以下のJSON形式で返してください。
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "宝物の名前（日本語）" },
            description: { type: Type.STRING, description: "宝物の説明文（日本語、50文字以内、ユーモアを含めて）" },
            value: { type: Type.INTEGER, description: "ゴールドの価値 (10〜1000)" },
            icon: { type: Type.STRING, description: "宝物を表す絵文字1つ" },
          },
          required: ["name", "description", "value", "icon"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    const data = JSON.parse(text);
    
    return {
      id: crypto.randomUUID(),
      name: data.name,
      description: data.description,
      value: data.value,
      icon: data.icon,
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if API fails
    return {
      id: crypto.randomUUID(),
      name: "不思議な骨",
      description: "なんだか美味しそうな匂いがする古い骨。Geminiとの通信に失敗したようだ。",
      value: 10,
      icon: "🦴",
    };
  }
};