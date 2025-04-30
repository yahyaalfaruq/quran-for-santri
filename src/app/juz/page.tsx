"use client";

import Link from "next/link";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa";

const JuzListPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 py-8">
      {/* Tombol Kembali */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/surat">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-300 text-white rounded-full shadow-lg hover:bg-blue-500 transition">
            <FaArrowLeft size={18} />
            <span className="hidden sm:inline">Kembali</span>
          </button>
        </Link>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-3">
            Daftar 30 Juz Al-Quran
          </h1>
          <p className="text-lg text-blue-600">
            Pilih juz untuk membaca ayat-ayat suci Al-Quran
          </p>
        </div>

        {/* Juz Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 30 }, (_, i) => i + 1)
            .filter(juz => 
              searchTerm === "" || 
              juz.toString().includes(searchTerm) || 
              `Juz ${juz}`.includes(searchTerm)
            )
            .map((juz) => (
              <Link href={`/juz/${juz}`} key={juz}>
                <div className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-blue-100 hover:border-blue-300 group">
                  <div className="bg-blue-100 text-blue-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <span className="text-xl font-bold">{juz}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-800">Juz {juz}</h3>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default JuzListPage;
