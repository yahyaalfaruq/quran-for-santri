"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import localFont from "next/font/local";
import { motion } from "framer-motion";
import {
  FiEye,
  FiEyeOff,
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiBookmark,
} from "react-icons/fi";
import { FaArrowLeft } from "react-icons/fa";

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
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://quran.ppqita.my.id/api/quran?mushafPage=${page_no}&token=TADABBUR_gazfath12@gmail.com`
        );
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
    if (bookmarkedPages.includes(currentPage)) {
      setBookmarkedPages(bookmarkedPages.filter((p) => p !== currentPage));
    } else {
      setBookmarkedPages([...bookmarkedPages, currentPage]);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-blue-700 font-medium"
          >
            Memuat Halaman...
          </motion.p>
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center p-6 bg-white rounded-xl shadow-lg max-w-md mx-4"
        >
          <p className="text-red-500 font-medium mb-4">
            Gagal memuat data halaman
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Floating Header */}
      <motion.header
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md shadow-sm z-50 border-b border-blue-100"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-full bg-blue-100 text-blue-600 disabled:opacity-40"
                title="Halaman Sebelumnya"
              >
                <FiChevronLeft size={20} />
              </motion.button>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium"
              >
                Halaman {currentPage}
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full bg-blue-100 text-blue-600 disabled:opacity-40"
                title="Halaman Berikutnya"
              >
                <FiChevronRight size={20} />
              </motion.button>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleBookmark}
                className={`p-2 rounded-full ${
                  bookmarkedPages.includes(currentPage)
                    ? "text-yellow-500"
                    : "text-blue-600"
                } bg-blue-100`}
                title="Bookmark Halaman"
              >
                <FiBookmark size={18} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowTranslation(!showTranslation)}
                className={`p-2 rounded-full ${
                  showTranslation
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-600"
                }`}
                title={
                  showTranslation
                    ? "Sembunyikan Terjemahan"
                    : "Tampilkan Terjemahan"
                }
              >
                {showTranslation ? <FiEyeOff size={18} /> : <FiEye size={18} />}
              </motion.button>

              <Link href="/surat">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-full bg-blue-100 text-blue-600"
                  title="Kembali"
                >
                  <FaArrowLeft size={18} />
                </motion.button>
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-20 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          {data.data.map((item: any, index: number) => {
            const isFirstVerseOfSurah = item.ayat.number.inSurah === 1;
            const isNewSurah =
              index > 0 &&
              data.data[index - 1].surah.nama_latin !== item.surah.nama_latin;
            const isFatihahOrTaubah =
              item.surah.nama_latin === "Al-Fatihah" ||
              item.surah.nama_latin === "At-Taubah";

            return (
              <motion.div
                key={item.ayat.number.inQuran}
                whileHover={{ scale: 1.005 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                {(isFirstVerseOfSurah || isNewSurah) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center my-8 bg-white p-6 rounded-xl shadow-sm"
                  >
                    <h2 className="text-2xl font-bold text-blue-800 mb-2">
                      {item.surah.nama_latin}
                    </h2>
                    <p className="text-blue-600 mb-4">
                      {item.surah.arti} • {item.surah.jumlah_ayat} ayat
                    </p>
                    {!isFatihahOrTaubah && (
                      <motion.p
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className={`text-3xl font-arabic text-blue-900 ${lpmqFont.className}`}
                      >
                        بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
                      </motion.p>
                    )}
                  </motion.div>
                )}

                <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">
                      Ayat {item.ayat.number.inSurah}
                    </span>
                    <span className="text-sm text-blue-600">
                      {item.surah.nama_latin}
                    </span>
                  </div>

                  <p
                    className={`text-right text-3xl font-arabic text-gray-800 ${lpmqFont.className} leading-loose mb-4`}
                  >
                    {item.ayat.arab}
                    <span className="text-blue-500 text-4xl mx-2">
                      ۝{toArabicNumber(item.ayat.number.inSurah)}
                    </span>
                  </p>

                  <p className="text-sm italic text-gray-600 mb-2">
                    {item.ayat.latin}
                  </p>

                  {showTranslation && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-base text-gray-700 mt-4 p-3 bg-blue-50 rounded-lg"
                    >
                      {item.ayat.translation}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </main>
    </div>
  );
};

export default QuranPage;
