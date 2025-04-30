"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import localFont from "next/font/local";
import {
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
  FiArrowLeftCircle,
  FiAlertCircle,
  FiBookOpen,
  FiBook,
} from "react-icons/fi";

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

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !juzData) {
    return <ErrorDisplay message={error || "Data tidak tersedia"} />;
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-30 to-blue-50 relative">
      {/* Header */}
      <div className="bg-blue-300 text-white py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          {/* Top Row - Navigation */}
          <div className="flex justify-between items-center mb-2">
            {/* Back Button */}
            <button
              onClick={() => router.push("/juz")}
              className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
            >
              <FiArrowLeftCircle className="text-white text-xl" />
            </button>

            {/* Juz Navigation */}
            <div className="flex items-center gap-2">
              {juzData.juz > 1 && (
                <button
                  onClick={() => router.push(`/juz/${juzData.juz - 1}`)}
                  className="flex items-center bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition-colors"
                >
                  <FiChevronLeft className="mr-1" />
                  <span className="text-sm">Juz {juzData.juz - 1}</span>
                </button>
              )}

              {juzData.juz < 30 && (
                <button
                  onClick={() => router.push(`/juz/${juzData.juz + 1}`)}
                  className="flex items-center bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full transition-colors"
                >
                  <span className="text-sm">Juz {juzData.juz + 1}</span>
                  <FiChevronRight className="ml-1" />
                </button>
              )}
            </div>

            {/* Reading Mode Button */}
            <button
              onClick={() => setIsReadingMode(!isReadingMode)}
              className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
            >
              {isReadingMode ? (
                <FiBookOpen className="text-white text-xl" />
              ) : (
                <FiBook className="text-white text-xl" />
              )}
            </button>
          </div>

          {/* Juz Info */}
          <div className="text-center">
            <h1 className="text-xl md:text-2xl font-bold">Juz {juzData.juz}</h1>
            {juzRange && (
              <p className="text-xs md:text-sm text-white/90">
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
        </div>
      </div>

      {/* Konten Ayat */}
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {surahGroups.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="border-b border-blue-50 last:border-b-0"
            >
              {/* Surah name header */}
              <div className="p-4">
                <h2 className="text-2xl font-semibold text-blue-800 text-center">
                  Surah {group.surah.name}
                </h2>
              </div>

              {/* Show Bismillah for every surah except Surah 9 (At-Taubah) and Surah 1 (Al-Fatihah) */}
              {group.surah.number !== 9 && group.ayahs[0].number === 1 && (
                <div className="p-5 border-b border-blue-50">
                  <div className="flex justify-center">
                    <div
                      className={`text-center text-2xl ${lpmqFont.className}`}
                    >
                      بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
                    </div>
                  </div>
                  <div className="text-center text-gray-600 italic mt-2">
                    Bismillahirrahmanirrahim
                  </div>
                </div>
              )}

              {/* Ayahs */}
              {group.ayahs.map((ayah, ayahIndex) => (
                <div
                  key={ayahIndex}
                  className="p-5 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-start">
                    <div className="bg-blue-100 text-blue-800 rounded-lg w-10 h-10 flex items-center justify-center mr-4 flex-shrink-0">
                      {ayah.number}
                    </div>
                    <div className="flex-1 space-y-3">
                      {/* Teks Arab */}
                      <div
                        className={`text-right text-2xl ${lpmqFont.className} leading-loose`}
                      >
                        {ayah.text}
                      </div>
                      {/* Latin & Terjemahan - Only if not in reading mode */}
                      {!isReadingMode && (
                        <>
                          <div className="text-gray-700 text-base italic">
                            {ayah.latin}
                          </div>
                          <div className="text-gray-600 text-sm">
                            {ayah.translation}
                          </div>
                        </>
                      )}
                      {/* Info Surah */}
                      <div className="text-sm text-gray-400 text-right">
                        {ayah.surah.name}:{ayah.number}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Spacer between surahs */}
              {groupIndex < surahGroups.length - 1 && (
                <div className="h-8 bg-blue-50"></div>
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
  <div className="min-h-screen flex items-center justify-center bg-blue-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-blue-800">Memuat data Al-Quran...</p>
    </div>
  </div>
);

// Komponen Error
interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
}

const ErrorDisplay = ({ message, onRetry }: ErrorDisplayProps) => (
  <div className="min-h-screen flex items-center justify-center bg-blue-50">
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
          <FiArrowLeftCircle className="mr-2" /> Kembali
        </button>
      </div>
    </div>
  </div>
);

export default QuranPage;
