"use client";
import { useState } from "react";
import axios from "axios";

export default function TherapistPage() {
  const [wallet, setWallet] = useState("");
  const [record, setRecord] = useState(null);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      const res = await axios.get(`/api/record?wallet=${wallet}`);
      if (res.data) {
        setRecord(res.data);
        setError("");
      } else {
        setRecord(null);
        setError("No record found.");
      }
    } catch (err) {
      console.error("Error fetching record:", err);
      setRecord(null);
      setError("No record found or server error.");
    }
  };

  const handleDownload = () => {
    if (!record) return;
    const blob = new Blob([JSON.stringify(record, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${record.name || "patient"}_record.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Therapist Portal</h2>

      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          placeholder="Enter patient's wallet address"
          className="flex-1 border rounded p-2"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
        />
        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>

      {error && <p className="text-red-600">{error}</p>}

      {record && (
        <div className="border-t pt-4">
          <h3 className="text-xl font-semibold mb-2">Patient Record:</h3>
          <ul className="space-y-2 mb-4">
            <li><strong>Name:</strong> {record.name}</li>
            <li><strong>Age:</strong> {record.age}</li>
            <li><strong>Condition:</strong> {record.condition}</li>
            <li><strong>Severity:</strong> {record.severity}</li>
            <li><strong>Solution:</strong> {record.solution}</li>
            <li><strong>Wallet:</strong> {record.wallet}</li>
            <li><strong>IPFS Hash:</strong> <a href={`https://gateway.pinata.cloud/ipfs/${record.ipfsHash}`} target="_blank" className="text-blue-500 underline">{record.ipfsHash}</a></li>
          </ul>

          <button
            onClick={handleDownload}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Download JSON
          </button>
        </div>
      )}
    </div>
  );
}
