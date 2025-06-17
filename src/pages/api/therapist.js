import dbConnect from "../../lib/db";
import Therapist from "../../models/therapist";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "POST") {
    const { wallet } = req.body;
    if (!wallet) return res.status(400).json({ error: "Wallet is required" });

    try {
      const newTherapist = await Therapist.create({ wallet });
      res.status(201).json(newTherapist);
    } catch (err) {
      res.status(500).json({ error: "Error saving therapist" });
    }

  } else if (req.method === "GET") {
    try {
      const therapists = await Therapist.find();
      res.status(200).json(therapists);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch therapists" });
    }

  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
