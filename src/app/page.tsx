'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <h1 className="text-5xl font-bold text-gray-800 mb-6">Aplikasi Hafalan Al-Quran</h1>
      <p className="text-lg text-gray-600 text-center mb-8">
        Bantu diri Anda menghafal Al-Quran dengan metode hafalan per halaman dan pengulangan ayat.
      </p>
      <button
        className="bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition"
        onClick={() => router.push('/surat')}
      >
        Mulai Hafalan
      </button>
    </div>
  );
}
