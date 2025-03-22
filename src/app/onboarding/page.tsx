'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const OnboardingPage = () => {
  const [pageId, setPageId] = useState('1'); // Halaman awal default
  const router = useRouter();

  const handleStart = () => {
    if (pageId) {
      router.push(`/reading/${pageId}`); // Navigasi ke halaman hafalan awal
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Pilih Halaman Awal Hafalan</h1>

      <div className="flex items-center gap-4">
        <label htmlFor="pageSelect" className="text-lg text-gray-700">
          Halaman:
        </label>
        
        <select
          id="pageSelect"
          value={pageId}
          onChange={(e) => setPageId(e.target.value)}
          className="border rounded-lg px-4 py-2 focus:ring focus:ring-blue-300"
        >
          {/* Contoh dropdown 1-30 */}
          {[...Array(30).keys()].map((num) => (
            <option key={num + 1} value={num + 1}>
              Halaman {num + 1}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleStart}
        className="mt-8 bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition"
      >
        Mulai
      </button>
    </div>
  );
};

export default OnboardingPage;
