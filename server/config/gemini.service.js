const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const MODEL_PRIORITY = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-flash",
];

const generateTaskDescription = async (title) => {
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

const generateTaskCategoryAndPriority = async (title) => {
  const prompt = `
You are a task management assistant.

Analyze the following task title and determine the appropriate category and priority:

Title: "${title}"

Categories available: General, Design, Development, Debugging
Priorities available: General, Average, High

Respond ONLY in valid JSON with:
- category (string, must be one of: General, Design, Development, Debugging)
- priority (string, must be one of: General, Average, High)

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

module.exports = {
  generateTaskDescription,
  generateTaskCategoryAndPriority,
};
