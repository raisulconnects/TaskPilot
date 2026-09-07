const prisma = require("../config/prisma");

const allEmployees = async (req, res) => {
  try {
    // Field names follow Prisma (`id`); the client was renamed accordingly.
    const employees = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true },
    });

    return res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error.message);

    return res.status(500).json({
      message: "Failed to fetch employees",
    });
  }
};

module.exports = { allEmployees };
