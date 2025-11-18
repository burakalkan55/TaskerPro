"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Burada UI animasyonlarını kontrol edebiliriz
    setLoading(false);
  }, []);

  if (loading) return <p className="pt-20 text-center">Loading...</p>;

  return (
    <main className="pt-24 px-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Welcome to your workspace!
      </p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 rounded-lg border shadow">
          <h2 className="text-xl font-semibold">Your Rooms</h2>
          <p className="text-gray-500">Here will be your room list.</p>
        </div>

        <div className="p-4 rounded-lg border shadow">
          <h2 className="text-xl font-semibold">Create New Room</h2>
          <p className="text-gray-500">Button & modal will be here.</p>
        </div>
      </div>
    </main>
  );
}
