// routes/patient.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Patient-only route
router.get("/records", authMiddleware(["patient"]), async (req, res) => {
  // You can use req.user.wallet or req.user.role here
  res.json({ message: `Hello Patient ${req.user.wallet}` });
});

// routes/patient.js (append to existing file)
const PatientRecord = require("../../src/models/PatientRecord");

// Save new record
router.post("/create-record", authMiddleware(["patient"]), async (req, res) => {
  try {
    const { name, age, condition, severity, solution, ipfsHash } = req.body;
    const wallet = req.user.wallet;

    const record = new PatientRecord({
      wallet,
      name,
      age,
      condition,
      severity,
      solution,
      ipfsHash
    });

    await record.save();
    res.status(201).json({ message: "Record saved", record });
  } catch (err) {
    res.status(500).json({ error: "Error saving record", details: err.message });
  }
});


module.exports = router;
