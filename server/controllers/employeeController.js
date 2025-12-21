const Employee = require("../models/employee.model");
const bcrypt = require("bcryptjs");

const employeeLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Employee logged in successfully",
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        position: employee.position,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const allEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().select(
      "_id name email position role"
    );

    return res.status(200).json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error.message);

    return res.status(500).json({
      message: "Failed to fetch employees",
    });
  }
};

module.exports = { employeeLogin, allEmployees };
