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

      return function () {
        
      }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-cyan-100 to-green-100 p-4">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-semibold text-teal-700 text-center mb-4">Daftar Surah</h1>
        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : (
          <ul className="space-y-3">
            {surahs.map((surah) => (
              <li
                key={surah.nomor}
                className="bg-green-100 p-3 rounded-lg flex justify-between items-center transition-transform transform hover:scale-105 hover:bg-green-200"
              >
                <Link href={`/surat/${surah.nomor}`} key={surah.nomor}>
                  <span className="font-semibold text-green-700">
                    {surah.nama_latin}
                  </span>
                  <span className="text-gray-600">
                    {surah.arti} ({surah.jumlah_ayat} ayat)
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}