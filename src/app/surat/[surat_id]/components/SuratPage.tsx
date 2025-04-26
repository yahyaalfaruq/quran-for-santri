'use client';

import { useEffect, useState } from 'react';
import localFont from 'next/font/local';

const lpmqFont = localFont({
  src: '../../../../fonts/LPMQ IsepMisbah.ttf',
  variable: '--font-lpmq',
});

interface SuratPageProps {
  surat_id: string;
}

const SuratPage: React.FC<SuratPageProps> = ({ surat_id }) => {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://quran.ppqita.my.id/api/quran?surat=${surat_id}&token=TADABBUR_EMAILKU`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Gagal memuat data. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [surat_id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  if (!data || !data.data) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-700 text-lg">Tidak ada data yang ditemukan</p>
      </div>
    );
  }

  // Cek apakah surat bukan Al-Fatihah (nomor surat 1)
  const isNotAlFatihah = surat_id !== '1';

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      {/* Container Utama */}
      <div className="mx-auto max-w-4xl">
        {/* Header Surah */}
        <div className="bg-blue-300 rounded-lg shadow-sm p-6 mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-2">
            <span className='text-white'>Surah</span> {data.data[0]?.surah.nama_latin}
          </h1>
          <p className="text-sm text-gray-600">
            {data.data[0]?.surah.arti} • {data.data[0]?.surah.jumlah_ayat} Ayat
          </p>
        </div>

        {/* Daftar Ayat */}
        <div className="space-y-4">
          {data.data.map((item: any, index: number) => (
            <div
              key={item.ayat.number.inQuran}
              className="bg-white rounded-lg shadow-sm p-5 hover:shadow-md transition-shadow duration-200"
            >
              {/* Tampilkan "Bismillah" di atas ayat pertama jika bukan Al-Fatihah */}
              {isNotAlFatihah && index === 0 && (
                <div className="mb-4">
                  <p className={`text-right text-3xl font-arabic ${lpmqFont.className} text-gray-800`}>
                  بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
                  </p>
                  <p className="text-sm italic text-gray-600 mt-2">
                    Bismillahirrahmanirrahim
                  </p>
                </div>
              )}

              {/* Nomor Ayat */}
              <div className="flex justify-between items-center mb-4">
                <span className="p-2 text-xl border-image-custom flex items-center justify-center w-15 h-10">
                  {item.ayat.number.inSurah}.
                </span>
              </div>

              {/* Teks Arab */}
              <p className={`text-right text-3xl font-arabic ${lpmqFont.className} text-gray-800 mb-4`}>
                {item.ayat.arab}
              </p>

              {/* Teks Latin */}
              <p className="text-sm italic text-gray-600 mb-2">
                {item.ayat.latin}
              </p>

              {/* Terjemahan */}
              <p className="text-base text-gray-700">
                {item.ayat.translation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuratPage;