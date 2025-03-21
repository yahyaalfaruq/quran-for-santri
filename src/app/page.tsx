'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Surah {
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
  tempat_turun: string;
  arti: string;
  deskripsi: string;
  audio: string;
}

export default function Home() {
  console.log('run home');

  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      'https://quran.ppqita.my.id/api/quran?listSurah=true&token=TADABBUR_EMAILKU'
    )
      .then((response) => response.json())
      .then((result) => {
        console.log('isi result adalah: ', result);
        setSurahs(result.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-sage-100 to-blue-100 p-4">
      <div className="w-full max-w-6xl p-6">
        <h1 className="text-3xl font-bold text-sage-900 text-center mb-8">Daftar Surah</h1>
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {surahs.map((surah) => (
              <Link href={`/surat/${surah.nomor}`} key={surah.nomor}>
                <div
                  className="bg-gradient-to-r from-sage-200 to-blue-200 p-6 rounded-xl shadow-sm flex flex-col justify-between items-center text-center transition-all transform hover:scale-105 hover:shadow-md"
                >
                  <span className="text-2xl font-bold text-sage-900">
                    {surah.nama_latin}
                  </span>
                  <span className="text-gray-700 mt-2">
                    {surah.arti} ({surah.jumlah_ayat} ayat)
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}