"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminPage() {
  const [records, setRecords] = useState([]);
  const [therapists, setTherapists] = useState([]);
  const [therapistWallet, setTherapistWallet] = useState("");

  useEffect(() => {
    fetchRecords();
    fetchTherapists();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get("/api/record");
      setRecords(res.data);
    } catch (err) {
      console.error("Failed to fetch records", err);
    }
  };

  const deleteRecord = async (id) => {
    try {
      await axios.delete(`/api/record?id=${id}`);
      fetchRecords();
    } catch (err) {
      console.error("Failed to delete record", err);
    }
  };

  const fetchTherapists = async () => {
    try {
      const res = await axios.get("/api/therapist");
      setTherapists(res.data);
    } catch (err) {
      console.error("Failed to fetch therapists", err);
    }
  };

  const handleAddTherapist = async () => {
    if (!therapistWallet) return alert("Enter a wallet address");
    try {
      await axios.post("/api/therapist", { wallet: therapistWallet });
      setTherapistWallet("");
      fetchTherapists();
    } catch (err) {
      console.error("Error adding therapist", err);
      alert("Error adding therapist");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Records Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">All Patient Records</h2>
        <div className="space-y-4">
          {records.map((record) => (
            <div
              key={record._id}
              className="border p-4 rounded shadow-sm bg-gray-50"
            >
              <p><strong>Name:</strong> {record.name}</p>
              <p><strong>Age:</strong> {record.age}</p>
              <p><strong>Condition:</strong> {record.condition}</p>
              <p><strong>Severity:</strong> {record.severity}</p>
              <p><strong>Solution:</strong> {record.solution}</p>
              <p><strong>Wallet:</strong> {record.wallet}</p>
              <p><strong>IPFS:</strong> <a href={`https://gateway.pinata.cloud/ipfs/${record.ipfsHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View</a></p>
              <button
                onClick={() => deleteRecord(record._id)}
                className="mt-2 bg-red-600 text-white px-4 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <hr className="my-10" />

      {/* Therapist Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Authorize Therapist</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={therapistWallet}
            onChange={(e) => setTherapistWallet(e.target.value)}
            placeholder="Therapist wallet address"
            className="flex-1 border p-2 rounded"
          />
          <button
            onClick={handleAddTherapist}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Authorized Therapists</h3>
          <ul className="list-disc list-inside space-y-1">
            {therapists.map((t) => (
              <li key={t._id} className="text-gray-800">{t.wallet}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
