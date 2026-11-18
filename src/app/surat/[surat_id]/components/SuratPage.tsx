'use client';

import { useEffect, useState } from "react";
import localFont from "next/font/local";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  FaArrowLeft,
  FaArrowRight,
  FaArrowLeftLong,
  FaBookOpen,
  FaBook,
} from "react-icons/fa6";
import { FiEye, FiEyeOff } from "react-icons/fi";

const lpmqFont = localFont({
  src: "../../../../fonts/LPMQ IsepMisbah.ttf",
  variable: "--font-lpmq",
});

interface SuratPageProps {
  surat_id: string;
}

const SuratPage: React.FC<SuratPageProps> = ({ surat_id }) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/quran?surat=${surat_id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        setError(null);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Gagal memuat data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [surat_id]);

  const navigateToSurah = (surahId: number) => {
    if (surahId >= 1 && surahId <= 114) {
      router.push(`/surat/${surahId}`);
    }
  };

  const toggleReadingMode = () => {
    setIsReadingMode(!isReadingMode);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!data || !data.data) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-700 text-lg">Tidak ada data yang ditemukan</p>
      </div>
    );
  }

  const currentSurahNumber = parseInt(surat_id);
  const isNotAlFatihah = currentSurahNumber !== 1 && currentSurahNumber !== 9;
  const hasPreviousSurah = currentSurahNumber > 1;
  const hasNextSurah = currentSurahNumber < 114;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-300 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Tombol Kembali */}
          <Link href="/surat">
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-full shadow hover:bg-blue-100 transition">
              <FaArrowLeft size={18} />
              <span className="hidden sm:inline">Kembali</span>
            </button>
          </Link>

          {/* Judul Surah (centered) */}
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-800">
              <span className="text-white">Surah</span> {data.data[0]?.surah.nama_latin}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              {data.data[0]?.surah.arti} • {data.data[0]?.surah.jumlah_ayat} Ayat
            </p>
          </div>

          {/* Reading Mode Button */}
          <button
            onClick={toggleReadingMode}
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-full shadow hover:bg-blue-100 transition"
          >
            {isReadingMode ? <FiEyeOff size={18} /> : <FiEye size={18} />}
          </button>
        </div>

        {/* Navigation Buttons - Horizontal */}
        <div className="container mx-auto px-4 pb-4 flex justify-center gap-4">
          {hasPreviousSurah && (
            <button
              onClick={() => navigateToSurah(currentSurahNumber - 1)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-full shadow hover:bg-blue-100 transition"
              title="Surat sebelumnya"
            >
              <FaArrowLeftLong size={18} />
              <span className="hidden sm:inline">Surat Sebelumnya</span>
            </button>
          )}
          
          {hasNextSurah && (
            <button
              onClick={() => navigateToSurah(currentSurahNumber + 1)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-full shadow hover:bg-blue-100 transition"
              title="Surat berikutnya"
            >
              <span className="hidden sm:inline"> Surat Berikutnya</span>
              <FaArrowRight size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Konten Utama */}
      <div className="container mx-auto px-4 py-6">
        {/* Daftar Ayat */}
        <div className="space-y-4">
          {data.data.map((item: any, index: number) => (
            <div
              key={item.ayat.number.inQuran}
              className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow duration-200"
            >
              {/* Tampilkan "Bismillah" di atas ayat pertama jika bukan Al-Fatihah */}
              {isNotAlFatihah && index === 0 && (
                <div className="mb-4">
                  <p
                    className={`text-center text-3xl font-arabic ${lpmqFont.className} text-gray-800`}
                  >
                    بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
                  </p>
                  {!isReadingMode && (
                    <p className="text-sm italic text-gray-600 mt-2">
                      Bismillahirrahmanirrahim
                    </p>
                  )}
                </div>
              )}

              {/* Nomor Ayat */}
              <div className="flex justify-between items-center mb-4">
                <span className="p-2 text-xl border-image-custom flex items-center justify-center w-15 h-10">
                  {item.ayat.number.inSurah}.
                </span>
              </div>

              {/* Teks Arab */}
              <p
                className={`text-right text-3xl font-arabic ${lpmqFont.className} text-gray-800 mb-4`}
              >
                {item.ayat.arab}
              </p>

              {/* Teks Latin dan Terjemahan hanya muncul jika Mode Biasa */}
              {!isReadingMode && (
                <>
                  <p className="text-sm italic text-gray-600 mb-2">
                    {item.ayat.latin}
                  </p>

                  <p className="text-base text-gray-700">
                    {item.ayat.translation}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuratPage;