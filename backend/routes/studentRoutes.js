const express = require("express");
const Student = require("../model/Student");
const router = express.Router();

// 1. MOVE THIS TO THE TOP
router.get("/count", async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments();
        res.json({ count: totalStudents });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. PLACE THIS SECOND
router.get("/", async (req, res) => {
    try {
        const students = await Student.find().select({ password: 0 });
        res.json({ data: students });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;