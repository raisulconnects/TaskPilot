const {
  generateTaskDescription,
  generateTaskCategoryAndPriority,
} = require("../config/gemini.service");

const geminiGenerator = async (req, res) => {
  console.log("Gemini Generator Started....");
  try {
    const { title } = req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({
        message: "Task title must be at least 3 characters long",
      });
    }

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
    const { title } = req.body;

    if (!title || title.trim().length < 3) {
      return res.status(400).json({
        message: "Task title must be at least 3 characters long",
      });
    }

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
