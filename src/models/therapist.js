import mongoose from "mongoose";

const TherapistSchema = new mongoose.Schema({
  wallet: { type: String, required: true, unique: true },
  addedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Therapist || mongoose.model("Therapist", TherapistSchema);
