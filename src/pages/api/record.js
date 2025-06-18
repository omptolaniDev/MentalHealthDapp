import dbConnect from "../../lib/db";
import Record from "../../models/Record"

export default async function handler(req, res) {
  await dbConnect();

  const { method } = req;

  switch (method) {
    case "POST": {
      try {
        const record = await Record.create(req.body);
        return res.status(201).json(record);
      } catch (error) {
        return res.status(500).json({ message: "Failed to create record", error });
      }
    }

    case "GET": {
      const { wallet } = req.query;

      try {
        if (wallet) {
          const record = await Record.findOne({ wallet });
          if (!record) return res.status(404).json({ message: "Record not found" });
          return res.status(200).json(record);
        } else {
          const records = await Record.find();
          return res.status(200).json(records);
        }
      } catch (error) {
        return res.status(500).json({ message: "Failed to fetch records", error });
      }
    }

    case "DELETE": {
      const { id } = req.query;
      try {
        await Record.findByIdAndDelete(id);
        return res.status(200).json({ message: "Record deleted" });
      } catch (error) {
        return res.status(500).json({ message: "Failed to delete record", error });
      }
    }

    default:
      return res.status(405).end();
  }
}
