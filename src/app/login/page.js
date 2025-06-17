"use client"
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

const RoleLogin = () => {
  const router = useRouter();

  const handleLogin = (role) => {
    Cookies.set('role', role);
    router.push(`/${role}`);
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">Choose Role</h1>
      <button onClick={() => handleLogin('patient')} className="bg-blue-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-lg shadow-md">Login as Patient</button>
      <button onClick={() => handleLogin('therapist')} className="bg-blue-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-lg shadow-md">Login as Therapist</button>
      <button onClick={() => handleLogin('admin')} className="bg-blue-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl text-lg shadow-md">Login as Admin</button>
    </div>
  );
};

export default RoleLogin;
