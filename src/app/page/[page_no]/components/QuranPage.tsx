"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import localFont from "next/font/local";
import { motion } from "framer-motion";
import {
  FiEye,
  FiEyeOff,
  FiBookmark,
} from "react-icons/fi";
import { FaArrowLeft, FaArrowRight, FaArrowLeftLong } from "react-icons/fa6";

const lpmqFont = localFont({
  src: "../../../../fonts/LPMQ IsepMisbah.ttf",
  variable: "--font-lpmq",
});

const toArabicNumber = (num: number) => {
  const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return num
    .toString()
    .split("")
    .map((digit) => arabicNumbers[parseInt(digit)])
    .join("");
};

const QuranPage = ({ page_no }: { page_no: string }) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [bookmarkedPages, setBookmarkedPages] = useState<number[]>([]);
  const totalPages = 604;
  const router = useRouter();

  const currentPage = !isNaN(parseInt(page_no, 10)) ? parseInt(page_no, 10) : 1;

  useEffect(() => {
    const savedBookmarks = localStorage.getItem("bookmarkedPages");
    if (savedBookmarks) {
      try {
        setBookmarkedPages(JSON.parse(savedBookmarks));
      } catch {
        // ignore invalid json
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/quran?mushafPage=${page_no}`);
        if (!response.ok) throw new Error("Failed to fetch data");
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page_no]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push(`/page/${page}`);
    }
  };

  const toggleBookmark = () => {
    const updated = bookmarkedPages.includes(currentPage)
      ? bookmarkedPages.filter((p) => p !== currentPage)
      : [...bookmarkedPages, currentPage];
    setBookmarkedPages(updated);
    localStorage.setItem("bookmarkedPages", JSON.stringify(updated));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (!data)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-500 text-lg">Gagal memuat data halaman</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-300 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          {/* Back Button */}
          <Link href="/surat">
            <button className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-full shadow hover:bg-blue-100 transition">
              <FaArrowLeft size={18} />
              <span className="hidden sm:inline">Kembali</span>
            </button>
          </Link>

          {/* Page Info */}
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-blue-800">
              <span className="text-white">Halaman</span> {currentPage}
            </h1>
          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleBookmark}
              className={`p-2 rounded-full ${
                bookmarkedPages.includes(currentPage)
                  ? "text-yellow-500 bg-white"
                  : "text-blue-600 bg-white"
              } shadow hover:bg-blue-100 transition`}
              title="Bookmark Halaman"
            >
              <FiBookmark size={18} />
            </button>

            <button
              onClick={() => setShowTranslation(!showTranslation)}
              className={`p-2 rounded-full ${
                showTranslation
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600"
              } shadow hover:bg-blue-100 transition`}
              title={
                showTranslation
                  ? "Sembunyikan Terjemahan"
                  : "Tampilkan Terjemahan"
              }
            >
              {showTranslation ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="container mx-auto px-4 pb-4 flex justify-center gap-4">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-full shadow hover:bg-blue-100 transition disabled:opacity-50"
            title="Halaman Sebelumnya"
          >
            <FaArrowLeftLong size={18} />
            <span className="hidden sm:inline">Sebelumnya</span>
          </button>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-full shadow hover:bg-blue-100 transition disabled:opacity-50"
            title="Halaman Berikutnya"
          >
            <span className="hidden sm:inline">Berikutnya</span>
            <FaArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-4">
          {data.data.map((item: any, index: number) => {
            const isFirstVerseOfSurah = item.ayat.number.inSurah === 1;
            const isNewSurah =
              index > 0 &&
              data.data[index - 1].surah.nama_latin !== item.surah.nama_latin;
            const isFatihahOrTaubah =
              item.surah.nama_latin === "Al-Fatihah" ||
              item.surah.nama_latin === "At-Taubah";

            return (
              <div
                key={item.ayat.number.inQuran}
                className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow duration-200"
              >
                {(isFirstVerseOfSurah || isNewSurah) && (
                  <div className="text-center my-6">
                    <h2 className="text-xl font-bold text-blue-800 mb-2">
                      {item.surah.nama_latin}
                    </h2>
                    <p className="text-blue-600 mb-4">
                      {item.surah.arti} • {item.surah.jumlah_ayat} ayat
                    </p>
                    {!isFatihahOrTaubah && (
                      <p
                        className={`text-center text-3xl font-arabic ${lpmqFont.className} text-gray-800`}
                      >
                        بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
                      </p>
                    )}
                  </div>
                )}

                {/* Ayat Number */}
                <div className="flex justify-between items-center mb-4">
                  <span className="p-2 text-xl border-image-custom flex items-center justify-center w-15 h-10">
                    {item.ayat.number.inSurah}.
                  </span>
                </div>

                {/* Arabic Text */}
                <p
                  className={`text-right text-3xl font-arabic text-gray-800 ${lpmqFont.className} mb-4`}
                >
                  {item.ayat.arab}
                </p>

                {/* Latin Text */}
                <p className="text-sm italic text-gray-600 mb-2">
                  {item.ayat.latin}
                </p>

                {/* Translation (conditionally shown) */}
                {showTranslation && (
                  <p className="text-base text-gray-700">
                    {item.ayat.translation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuranPage;