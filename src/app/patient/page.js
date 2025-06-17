"use client";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

export default function PatientPage() {
  const [wallet, setWallet] = useState("");
  const [form, setForm] = useState({
    name: "",
    age: "",
    condition: "",
    severity: "",
    solution: "",
  });

  useEffect(() => {
    const connect = async () => {
      if (!window.ethereum) return alert("Install MetaMask");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setWallet(address);
    };
    connect();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const file = new Blob([
      JSON.stringify({ ...form, wallet })
    ], { type: "application/json" });
    const formData = new FormData();
    formData.append("file", file);

    const pinataRes = await axios.post("/api/ipfs-upload", formData);
    const ipfsHash = pinataRes.data.hash;

    await axios.post("/api/record", { ...form, wallet, ipfsHash });
    alert("Record submitted!");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h2 className="text-2xl font-bold mb-4">Submit Mental Health Record</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {["name", "age", "condition", "severity", "solution"].map((field) => (
          <input
            key={field}
            placeholder={field}
            required
            className="w-full border p-2 rounded"
            onChange={(e) => setForm({ ...form, [field]: e.target.value })}
          />
        ))}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Submit
        </button>
      </form>
    </div>
  );
}
