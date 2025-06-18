// /pages/api/admin/records/index.js (GET all records)
import dbConnect from "../../../../lib/db";
import Record from "../../../../models/record";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const records = await Record.find({}).sort({ createdAt: -1 });
      res.status(200).json(records);
    } catch (error) {
      console.error("Error fetching records:", error);
      res.status(500).json({ message: "Failed to fetch records" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
