const Employee = require("../models/employee.model");

const allEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select("_id name email role");

    return res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error.message);

    return res.status(500).json({
      message: "Failed to fetch employees",
    });
  }
};

module.exports = { allEmployees };
