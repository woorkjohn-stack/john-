import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question, Difficulty } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the schema for the output validation
const quizSchema: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      text: {
        type: Type.STRING,
        description: "نص السؤال",
      },
      options: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "قائمة من 4 خيارات للإجابة",
      },
      correctAnswerIndex: {
        type: Type.INTEGER,
        description: "رقم الفهرس للإجابة الصحيحة (0-3)",
      },
    },
    required: ["text", "options", "correctAnswerIndex"],
  },
};

export const generateQuestions = async (
  topic: string,
  count: number,
  difficulty: Difficulty
): Promise<Question[]> => {
  const prompt = `
    قم بإنشاء ${count} أسئلة اختبار من نوع اختيار من متعدد (Multiple Choice) حول موضوع "${topic}".
    مستوى الصعوبة: ${difficulty}.
    اللغة: العربية.
    كل سؤال يجب أن يحتوي على 4 خيارات.
    تأكد أن الإجابة الصحيحة واضحة ودقيقة.
    قم بإرجاع النتيجة بتنسيق JSON صارم.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizSchema,
        temperature: 0.7,
      },
    });

    const rawData = response.text;
    if (!rawData) {
      throw new Error("لم يتم استلام أي بيانات من النموذج.");
    }

    const parsedData = JSON.parse(rawData);
    
    // Add unique IDs to the generated questions
    const questionsWithIds: Question[] = parsedData.map((q: any) => ({
      id: crypto.randomUUID(),
      text: q.text,
      options: q.options,
      correctAnswerIndex: q.correctAnswerIndex,
    }));

    return questionsWithIds;

  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("حدث خطأ أثناء توليد الأسئلة. الرجاء المحاولة مرة أخرى.");
  }
};
