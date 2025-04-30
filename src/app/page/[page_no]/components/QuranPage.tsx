"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiRefreshCw,
} from "react-icons/fi";
import localFont from "next/font/local";

const arabicFont = localFont({
  src: "../../../../fonts/LPMQ IsepMisbah.ttf",
  variable: "--font-arabic",
});

interface AyahData {
  arab: string;
  latin: string;
  translation: string;
  number: {
    inQuran: number;
    inSurah: number;
  };
  tafsir?: string;
}

interface SurahData {
  nama_latin: string;
  arti: string;
  jumlah_ayat: number;
  nomor: number;
}

interface QuranPageData {
  ayat: AyahData;
  surah: SurahData;
  mushafPage?: number;
}

const QuranPage = ({ page_id }: { page_id: string }) => {
  const router = useRouter();
  const [data, setData] = useState<QuranPageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [showTafsir, setShowTafsir] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://quran.ppqita.my.id/api/quran?mushafPage=${page_id}&token=TADABBUR_EMAILKU`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch Quran page data");
        }

        const result = await response.json();

        if (!result.data || !Array.isArray(result.data)) {
          throw new Error("Invalid data format");
        }

        setData(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page_id]);

  const navigateToPage = (pageNumber: number) => {
    router.push(`/quran/page/${pageNumber}`);
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
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg max-w-md text-center mb-4">
          {error}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FiRefreshCw /> Try Again
        </button>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-700">No Quran data found for this page</p>
      </div>
    );
  }

  // Get unique surahs in this page
  const surahsInPage = [...new Set(data.map((item) => item.surah.nomor))];
  const currentPage = parseInt(page_id);
  const hasPreviousPage = currentPage > 1;
  const hasNextPage = currentPage < 604; // There are 604 pages in the Quran mushaf

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-500 text-white p-4 sticky top-0 z-10 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 hover:bg-blue-600 p-2 rounded-lg transition-colors"
          >
            <FiArrowLeft /> Back
          </button>

          <div className="text-center">
            <h1 className="text-xl font-bold">Mushaf Page {page_id}</h1>
            <p className="text-sm opacity-90">
              {surahsInPage.length > 1
                ? `Contains ${surahsInPage.length} Surahs`
                : `Surah ${data[0].surah.nama_latin}`}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsReadingMode(!isReadingMode)}
              className="p-2 hover:bg-blue-600 rounded-lg transition-colors"
            >
              {isReadingMode ? "Reading Mode" : "Normal Mode"}
            </button>
            {data.some((item) => item.ayat.tafsir) && (
              <button
                onClick={() => setShowTafsir(!showTafsir)}
                className="p-2 hover:bg-blue-600 rounded-lg transition-colors"
              >
                {showTafsir ? "Hide Tafsir" : "Show Tafsir"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-blue-400 text-white">
        <div className="container mx-auto flex justify-between p-2">
          <button
            onClick={() => navigateToPage(currentPage - 1)}
            disabled={!hasPreviousPage}
            className={`flex items-center gap-1 px-3 py-1 rounded ${
              !hasPreviousPage ? "opacity-50" : "hover:bg-blue-500"
            }`}
          >
            <FiChevronLeft /> Previous Page
          </button>

          <span className="px-3 py-1">Page {page_id}</span>

          <button
            onClick={() => navigateToPage(currentPage + 1)}
            disabled={!hasNextPage}
            className={`flex items-center gap-1 px-3 py-1 rounded ${
              !hasNextPage ? "opacity-50" : "hover:bg-blue-500"
            }`}
          >
            Next Page <FiChevronRight />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto p-4 max-w-3xl">
        {data.map((item, index) => {
          const isFirstAyahOfSurah =
            index === 0 || item.surah.nomor !== data[index - 1].surah.nomor;
          const shouldShowBasmalah =
            isFirstAyahOfSurah && item.surah.nomor !== 1;

          return (
            <div key={`${item.surah.nomor}-${item.ayat.number.inSurah}`}>
              {/* Show surah header if it's the first verse or if surah changes */}
              {isFirstAyahOfSurah && (
                <div className="bg-green-50 p-4 rounded-lg mb-4 border-l-4 border-green-500">
                  <h2 className="text-xl font-bold text-green-800">
                    Surah {item.surah.nama_latin} ({item.surah.nomor})
                  </h2>
                  <p className="text-green-600">
                    {item.surah.arti} • {item.surah.jumlah_ayat} verses
                  </p>
                </div>
              )}

              {/* Show Basmalah only for first ayah of each surah (except Al-Fatihah) */}
              {shouldShowBasmalah && (
                <div className="mb-4 text-center">
                  <p
                    className={`text-3xl ${arabicFont.className} text-gray-800`}
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

              {/* Rest of the ayah content */}
              <div className="bg-white rounded-lg shadow-sm p-5 mb-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center text-sm">
                    {item.ayat.number.inSurah}
                  </span>
                  <span className="text-sm text-gray-500">
                    Quran {item.ayat.number.inQuran}
                  </span>
                </div>

                <p
                  className={`text-right text-2xl leading-loose mb-4 ${arabicFont.className}`}
                >
                  {item.ayat.arab}
                </p>

                {!isReadingMode && (
                  <>
                    <p className="text-sm italic text-gray-600 mb-2">
                      {item.ayat.latin}
                    </p>
                    <p className="text-gray-700 mb-3">
                      {item.ayat.translation}
                    </p>

                    {showTafsir && item.ayat.tafsir && (
                      <div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
                        <h3 className="font-semibold text-yellow-800 mb-1">
                          Tafsir:
                        </h3>
                        <p className="text-gray-700">{item.ayat.tafsir}</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuranPage;
