import mongoose from "mongoose";

const RecordSchema = new mongoose.Schema({
  name: String,
  age: String,
  condition: String,
  severity: String,
  solution: String,
  wallet: String,
  ipfsHash: String,
});

export default mongoose.models.Record || mongoose.model("Record", RecordSchema);
