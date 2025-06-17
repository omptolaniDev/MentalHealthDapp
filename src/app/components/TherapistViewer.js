"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/contract";

export default function TherapistViewer() {
  const [patientName, setPatientName] = useState("");
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRecord = async () => {
    if (!patientName) return alert("Please enter a patient name.");
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const data = await contract.getRecordByName(patientName);
      setRecord(data);
    } catch (err) {
      console.error("Fetch error:", err);
      alert("Record not found or an error occurred.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-2xl shadow-md mt-10">
      <h2 className="text-2xl font-semibold text-center mb-4">Therapist View</h2>

      <input
        value={patientName}
        onChange={(e) => setPatientName(e.target.value)}
        placeholder="Enter Patient Name"
        className="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />

      <button
        onClick={fetchRecord}
        disabled={loading}
        className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
      >
        {loading ? "Fetching..." : "Fetch Record"}
      </button>

      {record && (
        <div className="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2 text-sm">
          <p><strong>Name:</strong> {record[0]}</p>
          <p><strong>Age:</strong> {record[1].toString()}</p>
          <p><strong>Condition:</strong> {record[2]}</p>
          <p><strong>Severity:</strong> {record[3]}</p>
          <p><strong>Solution:</strong> {record[4]}</p>
          <p>
            <strong>IPFS:</strong>{" "}
            <a
              href={`https://ipfs.io/ipfs/${record[5]}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View File
            </a>
          </p>
          <p>
            <strong>Timestamp:</strong>{" "}
            {new Date(Number(record[6]) * 1000).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
