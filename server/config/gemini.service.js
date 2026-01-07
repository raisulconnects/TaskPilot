import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODEL_PRIORITY = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash",
];

export const generateTaskDescription = async (title) => {
  const prompt = `
You are a task management assistant.

Generate a professional task description for the following task:

Title: "${title}"

Respond ONLY in valid JSON with:
- description (string)

Do not include explanations.
Do not use markdown.
`;

  for (const modelName of MODEL_PRIORITY) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();

      console.log(`✅ Gemini worked with model: ${modelName}`);

      return JSON.parse(responseText);
    } catch (error) {
      console.warn(`⚠️ Model failed: ${modelName}`);
      console.warn(error.message);
    }
  }

  throw new Error("All AI models are currently unavailable");
};
