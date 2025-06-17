// routes/therapist.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

// Therapist-only route
router.get("/patients", authMiddleware(["therapist"]), async (req, res) => {
  res.json({ message: `Welcome Therapist ${req.user.wallet}` });
});

// routes/therapist.js (append to existing file)
const PatientRecord = require("../../src/models/PatientRecord");

// Therapist fetches patient records by wallet
router.get("/get-records/:wallet", authMiddleware(["therapist"]), async (req, res) => {
  try {
    const records = await PatientRecord.find({ wallet: req.params.wallet }).sort({ timestamp: -1 });
    if (!records.length) return res.status(404).json({ error: "No records found" });

    res.json({ wallet: req.params.wallet, records });
  } catch (err) {
    res.status(500).json({ error: "Error fetching records", details: err.message });
  }
});

module.exports = router;
