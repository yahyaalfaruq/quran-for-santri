'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaQuran, FaMosque, FaStar, FaBookOpen, FaArrowRight } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200"
    >
      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-block mb-8 p-4 bg-white rounded-full shadow-lg">
            <FaMosque className="text-5xl text-sky-600" />
          </div>
          <h1 className="text-4xl font-bold text-sky-800 mb-4">
            <span className="text-sky-600">Hafiz</span> Quran
          </h1>
          <p className="text-xl text-sky-700 max-w-2xl mx-auto">
            Sistem menghafal Al-Qur&apos;an per halaman dengan metode pengulangan efektif
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[
            { 
              icon: <FaQuran className="text-4xl" />,
              title: "Baca Per Halaman",
              desc: "Tampilan mushaf per halaman lengkap"
            },
            { 
              icon: <FaBookOpen className="text-4xl" />,
              title: "Mode Hafalan", 
              desc: "Pengulangan ayat efektif"
            },
            { 
              icon: <FaStar className="text-4xl" />,
              title: "Penanda Progres",
              desc: "Tandai ayat yang sudah dihafal"
            },
            { 
              icon: <FaMosque className="text-4xl" />,
              title: "Target Harian",
              desc: "Pantau perkembangan hafalan"
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-md border border-sky-100"
            >
              <div className="text-sky-600 mb-4">{item.icon}</div>
              <h3 className="text-xl font-bold text-sky-800 mb-2">{item.title}</h3>
              <p className="text-sky-700">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
          <button
            onClick={() => router.push('/surat')}
            className="bg-sky-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:bg-sky-700 transition"
          >
            <FaQuran /> Mulai Membaca
          </button>
          <button
            onClick={() => router.push('/onboarding')}
            className="bg-white text-sky-600 px-6 py-3 rounded-lg font-medium flex items-center gap-2 border border-sky-300 hover:bg-sky-50 transition"
          >
            <FaStar /> Mulai Hafalan
          </button>
        </div>

        <div className="text-center text-sky-600">
          <p>Dikembangkan dengan ❤️ oleh</p>
          <p className="font-bold">Akram & Yahya & Regita</p>
        </div>
      </div>
    </motion.div>
  );
}