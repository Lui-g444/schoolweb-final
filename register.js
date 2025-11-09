const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

router.post('/', async (req, res) => {
  const { fullName, email, program, message } = req.body;

  if (!fullName || !email || !program) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const newStudent = new Student({ fullName, email, program, message });
    await newStudent.save();
    res.status(200).json({ message: "Registration successful!" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;