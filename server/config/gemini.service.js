import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

export const generateTaskDescription = async (title) => {
  //   console.log("My Gemini API KEY: ", process.env.GEMINI_API_KEY);

  const prompt = `
You are a task management assistant.

Generate a professional task description for the following task:

Title: "${title}"

Respond ONLY in valid JSON with:
- description (string)

Do not include explanations.
Do not use markdown.
`;

  const result = await model.generateContent(prompt);
  const responseText = result.response.text();

  // Gemini sometimes wraps JSON in extra text → we must be careful
  try {
    console.log("Gemini Generator Worked Successfully!");
    return JSON.parse(responseText);
  } catch (error) {
    throw new Error("Failed to parse AI response");
  }
};

const modelList = async (req, res) => {
  try {
    const models = await genAI.listModels();
    res.json(models);
  } catch (e) {
    res.status(500).json({ message: "Failed to list models" });
  }
};
