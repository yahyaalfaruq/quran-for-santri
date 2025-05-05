"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import localFont from "next/font/local";
import {
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiAlertCircle,
  FiBookOpen,
  FiBook,
} from "react-icons/fi";
import { FaArrowLeft, FaArrowRight, FaArrowLeftLong } from "react-icons/fa6";

const lpmqFont = localFont({
  src: "../../../../fonts/LPMQ IsepMisbah.ttf",
  variable: "--font-lpmq",
});

interface Ayah {
  number: number;
  text: string;
  latin: string;
  translation: string;
  surah: {
    number: number;
    name: string;
  };
}

interface JuzData {
  juz: number;
  ayahs: Ayah[];
}

const QuranPage = ({ juz_id }: { juz_id: string }) => {
  const router = useRouter();

  const [juzData, setJuzData] = useState<JuzData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReadingMode, setIsReadingMode] = useState(false);

  useEffect(() => {
    if (!juz_id) {
      setError("Parameter juz tidak valid");
      setLoading(false);
      return;
    }

    const juzNumber = parseInt(juz_id);
    if (isNaN(juzNumber)) {
      setError("Nomor juz harus berupa angka");
      setLoading(false);
      return;
    }

    if (juzNumber < 1 || juzNumber > 30) {
      setError("Nomor juz harus antara 1-30");
      setLoading(false);
      return;
    }

    const fetchJuzData = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://quran.ppqita.my.id/api/quran?juz=${juzNumber}&token=TADABBUR_EMAILKU`
        );

        if (!res.ok) throw new Error(`Gagal memuat data juz ${juzNumber}`);

        const result = await res.json();
        console.log("Hasil API:", result);

        if (result.status !== "success" || !Array.isArray(result.data)) {
          throw new Error("Data tidak valid");
        }

        const ayahs = result.data.map((item: any) => ({
          number: item.ayat.number.inSurah,
          text: item.ayat.arab,
          latin: item.ayat.latin,
          translation: item.ayat.translation,
          surah: {
            number: item.surah.nomor,
            name: item.surah.nama_latin,
          },
        }));

        setJuzData({
          juz: juzNumber,
          ayahs: ayahs,
        });

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    fetchJuzData();
  }, [juz_id]);

  const navigateToJuz = (juzId: number) => {
    if (juzId >= 1 && juzId <= 30) {
      router.push(`/juz/${juzId}`);
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

  if (!juzData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-700 text-lg">Tidak ada data yang ditemukan</p>
      </div>
    );
  }

  const groupAyahsBySurah = (ayahs: Ayah[]) => {
    const grouped: {
      surah: { number: number; name: string };
      ayahs: Ayah[];
    }[] = [];
    let currentSurah = null;

    for (const ayah of ayahs) {
      if (!currentSurah || currentSurah.number !== ayah.surah.number) {
        currentSurah = ayah.surah;
        grouped.push({
          surah: currentSurah,
          ayahs: [ayah],
        });
      } else {
        grouped[grouped.length - 1].ayahs.push(ayah);
      }
    }

    return grouped;
  };

  const surahGroups = groupAyahsBySurah(juzData.ayahs);

  const getJuzRangeInfo = (ayahs: Ayah[]) => {
    if (!ayahs || ayahs.length === 0) return null;

    const firstAyah = ayahs[0];
    const lastAyah = ayahs[ayahs.length - 1];

    return {
      startSurah: firstAyah.surah.name,
      startAyah: firstAyah.number,
      endSurah: lastAyah.surah.name,
      endAyah: lastAyah.number,
    };
  };

  const juzRange = juzData ? getJuzRangeInfo(juzData.ayahs) : null;
  const currentJuzNumber = juzData.juz;
  const hasPreviousJuz = currentJuzNumber > 1;
  const hasNextJuz = currentJuzNumber < 30;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-300 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Back Button */}
          <Link href="/juz">
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-full shadow hover:bg-blue-100 transition">
              <FaArrowLeft size={18} />
              <span className="hidden sm:inline">Kembali</span>
            </button>
          </Link>

          {/* Juz Info */}
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-800">
              <span className="text-white">Juz</span> {currentJuzNumber}
            </h1>
            {juzRange && (
              <p className="text-xs sm:text-sm text-gray-600">
                Surah {juzRange.startSurah} ayat {juzRange.startAyah} sampai{" "}
                {juzRange.startSurah === juzRange.endSurah ? (
                  <>ayat {juzRange.endAyah}</>
                ) : (
                  <>
                    Surah {juzRange.endSurah} ayat {juzRange.endAyah}
                  </>
                )}
              </p>
            )}
          </div>

          {/* Reading Mode Button */}
          <button
            onClick={toggleReadingMode}
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-full shadow hover:bg-blue-100 transition"
          >
            {isReadingMode ? <FiBookOpen size={18} /> : <FiBook size={18} />}
          </button>
        </div>

        {/* Navigation Buttons */}
        <div className="container mx-auto px-4 pb-4 flex justify-center gap-4">
          {hasPreviousJuz && (
            <button
              onClick={() => navigateToJuz(currentJuzNumber - 1)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-full shadow hover:bg-blue-100 transition"
              title="Juz sebelumnya"
            >
              <FaArrowLeftLong size={18} />
              <span className="hidden sm:inline">Juz Sebelumnya</span>
            </button>
          )}
          
          {hasNextJuz && (
            <button
              onClick={() => navigateToJuz(currentJuzNumber + 1)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-full shadow hover:bg-blue-100 transition"
              title="Juz berikutnya"
            >
              <span className="hidden sm:inline">Juz Berikutnya</span>
              <FaArrowRight size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-4">
          {surahGroups.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow duration-200"
            >
              {/* Surah Header */}
              <div className="text-center my-6">
                <h2 className="text-xl font-bold text-blue-800 mb-2">
                  {group.surah.name}
                </h2>
                <p className="text-blue-600 mb-4">
                  {group.surah.number !== 1 && group.surah.number !== 9 && (
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
                </p>
              </div>

              {/* Ayahs */}
              {group.ayahs.map((ayah, ayahIndex) => (
                <div
                  key={ayahIndex}
                  className="mb-6 last:mb-0"
                >
                  {/* Ayah Number */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="p-2 text-xl border-image-custom flex items-center justify-center w-15 h-10">
                      {ayah.number}.
                    </span>
                  </div>

                  {/* Arabic Text */}
                  <p
                    className={`text-right text-3xl font-arabic ${lpmqFont.className} text-gray-800 mb-4`}
                  >
                    {ayah.text}
                  </p>

                  {/* Latin and Translation */}
                  {!isReadingMode && (
                    <>
                      <p className="text-sm italic text-gray-600 mb-2">
                        {ayah.latin}
                      </p>
                      <p className="text-base text-gray-700">
                        {ayah.translation}
                      </p>
                    </>
                  )}
                </div>
              ))}

              {/* Spacer between surahs */}
              {groupIndex < surahGroups.length - 1 && (
                <div className="h-6"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Komponen Loading
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

// Komponen Error
interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

const ErrorDisplay = ({ message, onRetry }: ErrorDisplayProps) => (
  <div className="flex justify-center items-center min-h-screen bg-gray-50">
    <div className="bg-white p-8 rounded-xl shadow-md max-w-md text-center">
      <div className="text-red-500 mb-4">
        <FiAlertCircle className="h-12 w-12 mx-auto" />
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">
        Terjadi Kesalahan
      </h2>
      <p className="text-gray-600 mb-4">{message}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center justify-center"
          >
            <FiRefreshCw className="mr-2" /> Coba Lagi
          </button>
        )}
        <button
          onClick={() => (window.location.href = "/juz")}
          className="bg-white text-blue-600 px-6 py-2 rounded-lg shadow-sm border border-blue-200 hover:bg-blue-50 flex items-center justify-center"
        >
          <FaArrowLeft className="mr-2" /> Kembali
        </button>
      </div>
    </div>
  </div>
);

export default QuranPage;