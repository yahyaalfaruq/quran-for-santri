"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GiHamburgerMenu, GiCrossMark } from "react-icons/gi";
import localFont from "next/font/local";

const lpmqFont = localFont({
  src: "../../fonts/LPMQ IsepMisbah.ttf",
  variable: "--font-lpmq",
});

interface Surah {
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
  arti: string;
}

export default function Home() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetch(
      "https://quran.ppqita.my.id/api/quran?listSurah=true&token=TADABBUR_EMAILKU"
    )
      .then((response) => response.json())
      .then((data) => {
        setSurahs(data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="flex justify-between items-center bg-blue-300 shadow-sm p-4 relative">
        <div className="flex justify-center items-center gap-3">
          <button
            onClick={toggleMenu}
            className="md:hidden text-white text-2xl focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <GiCrossMark /> : <GiHamburgerMenu />}
          </button>
          <h1 className="text-2xl font-bold text-center text-gray-100">
            Quran<span className="text-blue-600">App</span>
          </h1>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-3">
          <Link
            className="text-white font-bold hover:text-blue-800"
            href="/juz"
          >
            Per Juz
          </Link>
          <Link
            className="text-white font-bold hover:text-blue-800"
            href="/shalat"
          >
            Jadwal Shalat
          </Link>
          <Link
            className="text-white font-bold hover:text-blue-800"
            href="/program-page"
          >
            Program
          </Link>
          <Link
            className="text-white font-bold hover:text-blue-800"
            href="/page"
          >
            Page
          </Link>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-blue-300 shadow-md md:hidden z-10">
            <div className="flex flex-col p-4 space-y-3">
              <Link
                className="text-white font-bold hover:text-blue-800 p-2"
                href="/juz"
                onClick={toggleMenu}
              >
                Per Juz
              </Link>
              <Link
                className="text-white font-bold hover:text-blue-800 p-2"
                href="/shalat"
                onClick={toggleMenu}
              >
                Jadwal Shalat
              </Link>
              <a
                className="text-white font-bold hover:text-blue-800 p-2"
                href=""
                onClick={toggleMenu}
              >
                Program Kami
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-4 sm:p-6">
        <div className="mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6">
            Daftar Surah Al-Quran
          </h1>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {surahs.map((surah) => (
                <li key={surah.nomor}>
                  <Link
                    href={`/surat/${surah.nomor}`}
                    className="block p-5 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 hover:bg-blue-200"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex gap-3">
                        <span className="text-xl rounded-lg flex items-center justify-center w-16 h-14 border-image-custom">
                          {surah.nomor}.
                        </span>
                        <div>
                          <span className="text-xl font-semibold text-gray-800">
                            {surah.nama_latin}
                          </span>
                          <p className="text-sm text-gray-600 mt-1">
                            {surah.arti}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col-reverse">
                        <span className="text-sm text-gray-500 mt-1">
                          {surah.jumlah_ayat} ayat
                        </span>
                        <p
                          className={`text-xl font-semibold ${lpmqFont.className}`}
                        >
                          {surah.nama}
                        </p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
