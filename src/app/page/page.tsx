"use client";
import { FaHome, FaSearch } from "react-icons/fa";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiBook, FiBookmark, FiSettings } from "react-icons/fi";
import { motion } from "framer-motion";

export default function PerHalamanPage() {
  const [inputPage, setInputPage] = useState("");
  const [searchResult, setSearchResult] = useState<number | null>(null);
  const totalPages = 604;
  const router = useRouter();

  const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const page = parseInt(inputPage, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      router.push(`/page/${page}`);
    } else {
      alert(`Please enter a valid page number between 1 and ${totalPages}`);
    }
  };

  const popularPages = [1, 2, 3, 10, 50, 100, 200, 300, 604];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Floating Header */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white/90 backdrop-blur-md rounded-full shadow-xl px-6 py-3 flex justify-between items-center border border-blue-200/50"
          >
            <Link
              href="/surat"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-all group"
            >
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className="p-2 bg-blue-100 rounded-full"
              >
                <FaHome className="text-lg" />
              </motion.div>
              <span className="font-semibold hidden sm:inline-block">Home</span>
            </Link>

            <div className="flex items-center gap-3">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all"
              >
                <FiBookmark className="text-lg" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all"
              >
                <FiBook className="text-lg" />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all"
              >
                <FiSettings className="text-lg" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-blue-300 to-blue-400 text-white p-8 text-center">
            <h2 className="text-3xl font-bold mb-2">Start Memorizing Quran</h2>
            <p className="opacity-90">Enter a mushaf page number to begin</p>
          </div>

          {/* Search Form */}
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="mb-8">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                <div className="relative flex-grow max-w-md">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaSearch className="text-blue-300 text-lg" />
                  </div>
                  <input
                    type="number"
                    value={inputPage}
                    onChange={handlePageChange}
                    placeholder={`Enter page (1-${totalPages})`}
                    className="pl-12 w-full p-4 rounded-xl border border-blue-200 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-blue-800 placeholder-blue-300"
                    min={1}
                    max={totalPages}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="bg-gradient-to-r from-blue-200 to-blue-300 hover:from-blue-400 hover:to-blue-500 text-white px-8 py-4 rounded-xl shadow-md transition-all font-medium"
                >
                  Go to Page
                </motion.button>
              </div>
            </form>

            {/* Search Result */}
            {searchResult && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200"
              >
                <p className="text-blue-800 mb-4 text-lg">
                  Page <span className="font-bold">{searchResult}</span> found!
                </p>
                <Link href={`/page/${searchResult}`}>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl transition-all"
                  >
                    Open Page {searchResult}
                  </motion.button>
                </Link>
              </motion.div>
            )}

            {/* Popular Pages */}
            <div className="text-center">
              <h3 className="text-xl font-semibold text-blue-800 mb-6">
                Popular Pages
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {popularPages.map((page) => (
                  <Link key={page} href={`/page/${page}`}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="w-full bg-blue-100 hover:bg-gradient-to-r hover:from-blue-100 hover:to-blue-200 text-blue-800 border border-blue-200 px-4 py-3 rounded-xl transition-all"
                    >
                      {page}
                    </motion.button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}