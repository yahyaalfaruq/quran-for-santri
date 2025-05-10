"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaQuran, FaBookOpen, FaVolumeUp } from "react-icons/fa";
import { IoMdArrowRoundForward } from "react-icons/io";
import { useState } from "react";

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedPage, setSelectedPage] = useState("1");

  const features = [
    {
      icon: <FaQuran className="text-4xl" />,
      title: "Baca Al-Qur'an",
      description: "Baca Al-Qur'an per halaman dengan tampilan yang nyaman"
    },
    {
      icon: <FaBookOpen className="text-4xl" />,
      title: "Terjemahan",
      description: "Aktifkan/nonaktifkan terjemahan sesuai kebutuhan"
    },
    {
      icon: <FaVolumeUp className="text-4xl" />,
      title: "Mode Audio",
      description: "Dengarkan bacaan (coming soon)"
    }
  ];

  const pageNumbers = Array.from({ length: 604 }, (_, i) => i + 1);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 text-sky-900" // Changed to light blue
    >
      <div className="container mx-auto px-4 py-12">
        {/* Header dengan animasi */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-sky-800">Selamat Datang</h1> {/* Darker blue text */}
          <p className="text-xl text-sky-700 max-w-2xl mx-auto"> {/* Medium blue text */}
            Aplikasi Pembaca Al-Qur&apos;an dengan tampilan modern dan fitur lengkap
          </p>
        </motion.div>

        {/* Fitur-fitur */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/80 p-6 rounded-xl border border-sky-300 shadow-md hover:shadow-lg transition-all" // White cards with blue border
            >
              <div className="text-center mb-4 text-sky-600"> {/* Blue icon */}
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-center text-sky-800">{feature.title}</h3> {/* Dark blue text */}
              <p className="text-sky-700 text-center">{feature.description}</p> {/* Medium blue text */}
            </motion.div>
          ))}
        </div>

        {/* Page Selection */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-md mx-auto mb-8"
        >
          <label htmlFor="page-select" className="block text-lg font-medium text-sky-700 mb-2"> {/* Medium blue text */}
            Pilih Halaman (1-604)
          </label>
          <div className="relative">
            <select
              id="page-select"
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="w-full p-3 pr-8 rounded-lg bg-white border border-sky-400 text-sky-800 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-500 appearance-none" // White select
            >
              {pageNumbers.map((page) => (
                <option key={page} value={page} className="bg-white text-sky-800"> {/* White dropdown */}
                  Halaman {page}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-sky-600"> {/* Blue arrow */}
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(`/reading/${selectedPage}`)}
            className="bg-sky-600 text-white px-8 py-4 rounded-full text-lg font-bold flex items-center gap-2 mx-auto shadow-lg hover:bg-sky-700 transition-all" // Blue button
          >
            Mulai Membaca di Halaman {selectedPage}
            <IoMdArrowRoundForward className="text-xl" />
          </motion.button>

          <p className="mt-4 text-sky-600"> {/* Medium blue text */}
            Klik untuk beralih ke halaman yang dipilih
          </p>
        </motion.div>

        {/* Decorations */}
        <motion.div 
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-20 left-10 w-8 h-8 rounded-full bg-sky-300/30" // Light blue decoration
        />
        <motion.div 
          animate={{
            y: [0, 15, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute bottom-40 right-16 w-12 h-12 rounded-full bg-sky-300/20" // Light blue decoration
        />
      </div>
    </motion.div>
  );
}