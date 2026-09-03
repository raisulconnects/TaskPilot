const {
  generateTaskDescription,
  generateTaskCategoryAndPriority,
} = require("../config/gemini.service");

const geminiGenerator = async (req, res) => {
  console.log("Gemini Generator Started....");
  try {
    // Title validated by aiTitleSchema (routes/geminiRoutes.js).
    const { title } = req.body;

    const aiResult = await generateTaskDescription(title);

    res.status(200).json(aiResult);
  } catch (error) {
    console.error("AI Error:", error.message);

    res.status(500).json({
      message: "Failed to generate task description",
    });
  }
};

const geminiCategoryPriorityGenerator = async (req, res) => {
  console.log("Gemini Category & Priority Generator Started....");
  try {
    // Title validated by aiTitleSchema (routes/geminiRoutes.js).
    const { title } = req.body;

    const aiResult = await generateTaskCategoryAndPriority(title);

    res.status(200).json(aiResult);
  } catch (error) {
    console.error("AI Error:", error.message);

    res.status(500).json({
      message: "Failed to generate category and priority",
    });
  }
};

module.exports = { geminiGenerator, geminiCategoryPriorityGenerator };
