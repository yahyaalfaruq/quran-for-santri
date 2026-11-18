"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { GiHamburgerMenu, GiCrossMark } from "react-icons/gi";
import { FiMoon, FiSearch, FiSun } from "react-icons/fi";
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

export default function Page() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") || "light";
    setTheme(storedTheme);
    document.documentElement.classList.toggle("dark", storedTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  useEffect(() => {
    fetch("/api/quran?listSurah=true")
      .then((response) => response.json())
      .then((data) => {
        setSurahs(Array.isArray(data?.data) ? data.data : []);
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

  const filteredSurahs = useMemo(() => {
    if (!searchQuery) return surahs;
    const query = searchQuery.toLowerCase();
    if (!isNaN(Number(query))) {
      return surahs.filter((surah) => surah.nomor === Number(query));
    }
    return surahs.filter(
      (surah) =>
        surah.nama_latin.toLowerCase().includes(query) ||
        surah.nama.toLowerCase().includes(query) ||
        surah.arti.toLowerCase().includes(query)
    );
  }, [surahs, searchQuery]);

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
          <button
            onClick={toggleTheme}
            className="text-white font-bold hover:text-blue-800 ml-4"
          >
            {theme === "light" ? <FiMoon size={20} /> : <FiSun size={20} />}
          </button>
          <Link className="text-white font-bold hover:text-blue-800" href="/juz">
            Per Juz
          </Link>
          <Link className="text-white font-bold hover:text-blue-800" href="/shalat">
            Jadwal Shalat
          </Link>
          <Link className="text-white font-bold hover:text-blue-800" href="/onboarding">
            Program Hafalan
          </Link>
          <Link className="text-white font-bold hover:text-blue-800" href="/page">
            Pages
          </Link>
          <Link className="text-white font-bold hover:text-blue-800" href="/about">
            About
          </Link>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-blue-300 shadow-md md:hidden z-10">
            <div className="flex flex-col p-4 space-y-3">
              <Link href="/juz" className="text-white font-bold hover:text-blue-800 p-2" onClick={toggleMenu}>
                Per Juz
              </Link>
              <Link href="/shalat" className="text-white font-bold hover:text-blue-800 p-2" onClick={toggleMenu}>
                Jadwal Shalat
              </Link>
              <Link href="/onboarding" className="text-white font-bold hover:text-blue-800 p-2" onClick={toggleMenu}>
                Program Hafalan
              </Link>
              <Link href="/page" className="text-white font-bold hover:text-blue-800 p-2" onClick={toggleMenu}>
                Pages
              </Link>
              <Link href="/about" className="text-white font-bold hover:text-blue-800 p-2" onClick={toggleMenu}>
                About
              </Link>
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

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Cari surah (nama/nomor/arti)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchQuery("")}
              >
                <GiCrossMark className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <ul className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4">
              {filteredSurahs.length > 0 ? (
                filteredSurahs.map((surah) => (
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
                            <p className="text-sm text-gray-600 mt-1">{surah.arti}</p>
                          </div>
                        </div>
                        <div className="flex flex-col-reverse">
                          <span className="text-sm text-gray-500 mt-1">
                            {surah.jumlah_ayat} ayat
                          </span>
                          <p className={`text-xl font-semibold ${lpmqFont.className}`}>
                            {surah.nama}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500 text-lg">
                    Tidak ada surah yang ditemukan
                  </p>
                </div>
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
