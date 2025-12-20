const Employee = require("../models/employee.model");
const bcrypt = require("bcryptjs");

// POST /api/employees/login
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

module.exports = { employeeLogin };
