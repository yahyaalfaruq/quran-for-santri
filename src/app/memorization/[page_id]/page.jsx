'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HighlightText from './components/HighlightText';
import Counter from './components/Counter';

const MemorizationPage = ({ params }) => {
  const [ayahs, setAyahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);  // Index ayat saat ini
  const [count, setCount] = useState(0);                // Hitungan pengulangan
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://quran.ppqita.my.id/api/quran?page=${params.pageId}&token=TADABBUR_EMAILKU`
        );
        const result = await response.json();
        setAyahs(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.pageId]);

  if (loading) return <p className="text-center">Memuat halaman...</p>;
  if (ayahs.length === 0) return <p className="text-center">Tidak ada ayat</p>;

  const handleNextAyah = () => {
    if (count >= 20) {
      setCount(0);
      if (currentIndex < ayahs.length - 1) {
        setCurrentIndex(currentIndex + 1);  // Pindah ke ayat berikutnya
      } else {
        router.push('/progress');  // Selesai, pindah ke halaman progres
      }
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">
        Hafalan Halaman {params.pageId}
      </h1>

      <div className="bg-white shadow-lg rounded-lg p-8 mb-6">
        <HighlightText text={ayahs[currentIndex].ayat.arab} highlighted={count >= 20} />

        <p className="text-lg text-gray-600 italic mt-4">
          {ayahs[currentIndex].ayat.latin}
        </p>
        <p className="text-base">{ayahs[currentIndex].ayat.translation}</p>
      </div>

      <div className="flex items-center justify-between">
        <Counter count={count} setCount={setCount} />

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
      </div>
    </div>
  );
};

export default MemorizationPage;
