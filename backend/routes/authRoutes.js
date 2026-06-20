const express = require('express');
const router = express.Router();
const Student = require('../model/Student'); 
const bcrypt = require('bcryptjs');

// 1. SIGNUP ROUTE
router.post('/signup', async (req, res) => {
  try {
    console.log("\n=== Signup Request Received ===");
    console.log("Request Body:", req.body);

    const { firstName, lastName, email, password } = req.body;

    console.log("🔍 Checking if student exists in DB...");
    const existingStudent = await Student.findOne({ email });
    console.log("Existing student check completed:", existingStudent ? "Found" : "Null");

    if (existingStudent) {
      console.log("⚠️ Signup failed: Email already registered.");
      return res.status(400).json({ message: 'Email already registered.' });
    }

    console.log("🔑 Hashing password with bcryptjs...");
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("Password successfully hashed.");

    console.log("💾 Attempting to save to MongoDB...");
    const newStudent = new Student({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    const savedStudent = await newStudent.save();
    console.log(`✅ Student successfully saved to DB: ${savedStudent._id}`);
    
    return res.status(201).json({ message: 'User registered successfully!' });

  } catch (err) {
    console.error("❌ Signup error:", err);
    return res.status(500).json({ message: err.message });
  }
});

// 2. LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    console.log("\n=== Login Request Received ===");
    console.log("Attempting Login For:", req.body.email);

    const { email, password } = req.body;

    console.log("🔍 Fetching student account info...");
    const student = await Student.findOne({ email });

    if (!student) {
      console.log("⚠️ Login failed: Email target not found.");
      return res.status(400).json({ message: 'Invalid Email or Password.' });
    }

    console.log("🔑 Verifying credentials match...");
    const isMatch = await bcrypt.compare(password, student.password);
    
    if (!isMatch) {
      console.log("⚠️ Login failed: Incorrect password match.");
      return res.status(400).json({ message: 'Invalid Email or Password.' });
    }

    console.log(`✅ Login Success! Verified student ID: ${student._id}`);
    return res.status(200).json({ message: 'Login successful!', studentId: student._id });
    
  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;