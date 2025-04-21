'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import HighlightText from './components/HighlightText';
import Counter from './components/Counter';
import { log } from 'console';

interface Ayah {
  ayat: {
    arab: string;
    latin: string;
    translation: string;
  };
}

const MemorizationPage = () => {
  const params = useParams();
  const pageId = params?.page_id as string; // Pastikan nama dinamisnya 'page_id'

  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [count, setCount] = useState(0);
  const router = useRouter();
  const [showAllAyahs, setShowAllAyahs] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://quran.ppqita.my.id/api/quran?page=${pageId}&token=TADABBUR_EMAILKU`
        );
        const result = await response.json();
        setAyahs(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (pageId) {
      fetchData();
    }

    console.log("Isi data fetch adalah", fetchData);
  }, [pageId]);

  // 🔁 Reset count setiap ganti ayat
  useEffect(() => {
    setCount(0);
  }, [currentIndex]);

  if (loading) return <p className="text-center">Memuat halaman...</p>;
  if (ayahs.length === 0) return <p className="text-center">Tidak ada ayat</p>;

  const handleNextAyah = () => {
    if (count >= 20) {
      setCount(0);  // Reset hitungan
      if (currentIndex < ayahs.length - 1) {
        setCurrentIndex(currentIndex + 1);  // Pindah ke ayat selanjutnya
      } else {
        // Kalau sudah di ayat terakhir, tidak pindah, tombol tampilkan semua ayat muncul
        setShowAllAyahs(true);  // Munculkan seluruh ayat setelah membaca 20x
      }
    }
  };

  console.log("Fungsi ini isinya adalah:", handleNextAyah);
  

  console.log("currentIndex:", currentIndex);
  console.log("ayahs.length:", ayahs.length);
  console.log("count:", count);


  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">
        Hafalan Halaman {pageId}
      </h1>
  
      <div className="bg-white shadow-lg rounded-lg p-8 mb-6">
        <HighlightText
          text={ayahs[currentIndex].ayat.arab}
          highlight={count >= 20 ? ayahs[currentIndex].ayat.arab : ''}
        />
  
        <p className="text-lg text-gray-600 italic mt-4">
          {ayahs[currentIndex].ayat.latin}
        </p>
        <p className="text-base">{ayahs[currentIndex].ayat.translation}</p>
      </div>
  
      <div className="flex flex-col items-center gap-4">
        <Counter count={count} setCount={setCount} />
  
        {currentIndex === ayahs.length - 1 && count >= 20 ? (
          <button
            onClick={() => setShowAllAyahs(true)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Tampilkan Semua Ayat
          </button>
        ) : (
          <button
            onClick={handleNextAyah}
            disabled={count < 20}
            className={`px-6 py-3 rounded-lg transition ${
              count >= 20
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
            }`}
          >
            Lanjut Ayat
          </button>
        )}
      </div>
  
      {showAllAyahs && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Semua Ayat di Halaman {pageId}</h2>
          {ayahs.map((ayah, index) => (
            <div key={index} className="mb-4 border-b pb-2">
              <p className="text-xl">{ayah.ayat.arab}</p>
              <p className="text-gray-600 italic">{ayah.ayat.latin}</p>
              <p className="text-sm">{ayah.ayat.translation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );  
      
};

export default MemorizationPage;
