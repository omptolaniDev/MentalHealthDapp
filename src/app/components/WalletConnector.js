"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../utils/contract";
import { uploadTextToIPFS } from "../utils/uploadToIPFS";

export default function WalletConnector() {
  const [walletAddress, setWalletAddress] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [condition, setCondition] = useState("");
  const [severity, setSeverity] = useState("");
  const [solution, setSolution] = useState("");
  const [record, setRecord] = useState(null);
  const [queryName, setQueryName] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) return alert("MetaMask not found");
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setWalletAddress(accounts[0]);
  };

  const saveRecord = async () => {
    try {
      if (!name || !age || !condition || !severity || !solution) {
        return alert("Please fill in all fields.");
      }

      const combinedText = `Name: ${name}\nAge: ${age}\nCondition: ${condition}\nSeverity: ${severity}\nSolution: ${solution}`;
      const cid = await uploadTextToIPFS(combinedText);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const tx = await contract.setRecord(name, parseInt(age), condition, severity, solution, cid);
      await tx.wait();

      alert("Record saved successfully on IPFS and blockchain.");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Something went wrong while saving the record.");
    }
  };

  const getRecord = async () => {
    try {
      if (!queryName) return alert("Enter a patient name to search.");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const data = await contract.getRecordByName(queryName);

      setRecord(data);
    } catch (error) {
      console.error("Fetch failed:", error);
      alert("Failed to fetch record.");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
      });
    }
  }, []);

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold">Mental Health DApp</h1>
      <button onClick={connectWallet} className="bg-purple-600 text-white px-4 py-2 rounded-md">
        {walletAddress ? "Connected" : "Connect Wallet"}
      </button>

      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Patient Name" className="border px-3 py-2 w-full mt-2" />
      <input value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" type="number" className="border px-3 py-2 w-full" />
      <input value={condition} onChange={(e) => setCondition(e.target.value)} placeholder="Mental Condition" className="border px-3 py-2 w-full" />
      <input value={severity} onChange={(e) => setSeverity(e.target.value)} placeholder="Severity (Critical, Moderate, etc.)" className="border px-3 py-2 w-full" />
      <textarea value={solution} onChange={(e) => setSolution(e.target.value)} placeholder="Suggested Solution" className="border px-3 py-2 w-full" />

      <button onClick={saveRecord} className="bg-green-600 text-white px-4 py-2 rounded-md w-full">
        Save Record
      </button>

      {/* <input value={queryName} onChange={(e) => setQueryName(e.target.value)} placeholder="Search by Patient Name" className="border px-3 py-2 w-full mt-4" />
      <button onClick={getRecord} className="bg-blue-600 text-white px-4 py-2 mt-2 rounded-md w-full">
        Fetch Record
      </button> */}

      {record && (
        <div className="mt-4 text-sm bg-gray-100 p-4 rounded-md">
          <p><strong>Name:</strong> {record[0]}</p>
          <p><strong>Age:</strong> {record[1].toString()}</p>
          <p><strong>Condition:</strong> {record[2]}</p>
          <p><strong>Severity:</strong> {record[3]}</p>
          <p><strong>Solution:</strong> {record[4]}</p>
          <p><strong>IPFS Hash:</strong> {record[5]}</p>
          <p><strong>Time:</strong> {new Date(Number(record[6]) * 1000).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}
