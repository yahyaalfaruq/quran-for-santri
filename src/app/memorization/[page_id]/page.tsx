'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import HighlightText from './components/HighlightText';
import Counter from './components/Counter';

import localFont from 'next/font/local';

const lpmqFont = localFont({
  src: '../../../fonts/LPMQ IsepMisbah.ttf',
  variable: '--font-lpmq',
});
interface Ayah {
  ayat: {
    arab: string;
    latin: string;
    translation: string;
    number: {
      inQuran: number;
      inSurah: number;
    };
  };
  surah: {
    jumlah_ayat: number;
    nama: string;
    nama_latin: string;
    nomor: number;
  };
}



const MemorizationPage = () => {
  const params = useParams();
  const pageId = params?.page_id as string; // pastikan nama folder adalah [page_id]

  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [displayedIndices, setDisplayedIndices] = useState<number[]>([0]); // indeks ayat yg ditampilkan
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://quran.ppqita.my.id/api/quran?mushafPage=${pageId}&token=TADABBUR_EMAILKU`
        );
        const result = await response.json();
        setAyahs(result.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (pageId) fetchData();
  }, [pageId]);

  function numLatinToArabic(n: string | number) {
    if (typeof n === "number") {
      n = n.toString();
    }
    return n.toString().replace(/\d/g, (d: any) => "٠١٢٣٤٥٦٧٨٩"[d]).replace(/\./g, ",");
  }  

  const currentIndex = displayedIndices[displayedIndices.length - 1];

  const handleNextAyah = () => {
    if (count >= 20) {
      setCount(0); // reset hitungan
      const nextIndex = currentIndex + 1;
      if (nextIndex < ayahs.length) {
        setDisplayedIndices([...displayedIndices, nextIndex]); // tambahkan ayat berikutnya
      } else {
        // Kalau sudah selesai pada ayat terakhir, bisa ke halaman progress atau apa pun
        router.push('/progress');
      }
    }
  };

  console.log("Contoh ayat:", ayahs[0]);

  if (loading) return <p className="text-center">Memuat halaman...</p>;
  if (ayahs.length === 0) return <p className="text-center">Tidak ada ayat</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">
        Hafalan Halaman {pageId}
      </h1>

      {displayedIndices.map((index, idx) => (
        <div key={index} className={`bg-white shadow-lg rounded-lg p-6 mb-4 font-arabic ${lpmqFont.className}`}>
          
          {/* Tampilkan Bismillah jika ayat pertama, dan bukan Al-Fatihah */}
          {ayahs[index].ayat.number.inSurah === 1 && ayahs[index].surah.nomor !== 1 && (
            <div className="text-center text-4xl mb-6">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
          )}

          <div className="text-[2rem] text-right leading-loose">
            <span>
              <HighlightText
                text={ayahs[index].ayat.arab}
                highlight={idx === displayedIndices.length - 1 && count >= 20 ? ayahs[index].ayat.arab : ''}
              />
            </span>
            <span className="text-5xl align-center mr-4">
              {numLatinToArabic(ayahs[index].ayat.number.inSurah)}
            </span>
          </div>

          <p className="text-lg text-gray-600 italic mt-2">{ayahs[index].ayat.latin}</p>
          <p className="text-xl">{ayahs[index].ayat.translation}</p>
        </div>
      ))}

      <div className="flex items-center justify-between mt-6">
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
