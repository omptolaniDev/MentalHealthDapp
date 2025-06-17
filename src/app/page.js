"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">Choose Your Role</h1>
      <div className="flex gap-4">
        <button onClick={() => router.push("/patient")} className="px-6 py-3 bg-blue-600 text-white rounded-xl">Patient</button>
        <button onClick={() => router.push("/therapist")} className="px-6 py-3 bg-green-600 text-white rounded-xl">Therapist</button>
        <button onClick={() => router.push("/admin")} className="px-6 py-3 bg-gray-800 text-white rounded-xl">Admin</button>
      </div>
    </main>
  );
}
