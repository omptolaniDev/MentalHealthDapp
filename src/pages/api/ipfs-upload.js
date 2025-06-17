import formidable from "formidable";
import FormData from "form-data";
import fs from "fs";
import axios from "axios";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Form parse error:", err);
      return res.status(500).json({ error: "File parsing failed" });
    }

    // Handle new formidable file object format
    const uploadedFile = files.file;
    const filePath = Array.isArray(uploadedFile)
      ? uploadedFile[0].filepath
      : uploadedFile?.filepath;

    if (!filePath) {
      return res.status(400).json({ error: "File path not found" });
    }

    try {
      const data = new FormData();
      data.append("file", fs.createReadStream(filePath));

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data,
        {
          maxBodyLength: Infinity,
          headers: {
            Authorization: `Bearer ${process.env.PINATA_JWT}`,
            ...data.getHeaders(),
          },
        }
      );

      return res.status(200).json({ hash: response.data.IpfsHash });
    } catch (uploadErr) {
      console.error("Upload to IPFS failed:", uploadErr);
      return res.status(500).json({ error: "IPFS upload failed" });
    }
  });
}
