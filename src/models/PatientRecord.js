// models/PatientRecord.js
const mongoose = require("mongoose");

const PatientRecordSchema = new mongoose.Schema({
  wallet: { type: String, required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  condition: { type: String, required: true },
  severity: { type: String, required: true },
  solution: { type: String, required: true },
  ipfsHash: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PatientRecord", PatientRecordSchema);
