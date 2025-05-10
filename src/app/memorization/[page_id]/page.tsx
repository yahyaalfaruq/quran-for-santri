'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import HighlightText from './components/HighlightText';
import Counter from './components/Counter';
import InstructionModal from './components/InstructionModal';

import toast from 'react-hot-toast'; // tambahkan di atas

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
  const pageId = params?.page_id as string; 

  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [displayedIndices, setDisplayedIndices] = useState<number[]>([0]);
  const [completedAyahs, setCompletedAyahs] = useState<number[]>([]); 
  const [hasShownInstruction, setHasShownInstruction] = useState(false); // 🆕
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

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
        setError('Terjadi kesalahan saat memuat data');
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
      setCompletedAyahs([...completedAyahs, currentIndex]); // tandai ayat sebagai selesai
      setCount(0);
      const nextIndex = currentIndex + 1;
      if (nextIndex < ayahs.length) {
        setDisplayedIndices([...displayedIndices, nextIndex]);
      } else {
        router.push('/progress');
      }
    }
  };
  
  // 🆕 Alert langsung muncul setelah loading selesai
  useEffect(() => {
    if (!loading && !error && !hasShownInstruction) {
      // toast("Bacalah halaman ini sebanyak 3x!", {
      //   style: {
      //     background: '#f0f9ff',
      //     color: '#0369a1',
      //     fontWeight: 'bold',
      //   },
      //   icon: '⭐',
      // });
      setShowModal(true);
      setHasShownInstruction(true);
    }
  }, [loading, error, hasShownInstruction]);

  if (loading) return <p className="text-center">Memuat halaman...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (ayahs.length === 0) return <p className="text-center">Tidak ada ayat</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">
        Hafalan Halaman {pageId}
      </h1>


      {displayedIndices.map((index, idx) => {
        const currentAyah = ayahs[index];
        const isCompleted = completedAyahs.includes(index);
        
        // Cek apakah ini ayat pertama dari surah baru
        const isFirstAyahOfSurah =
          index === 0 ||
          ayahs[index].surah.nomor !== ayahs[displayedIndices[idx - 1]]?.surah.nomor;
        
        return (
          <div key={index}>
            {isFirstAyahOfSurah && (
              <h3 className="text-2xl font-bold text-center my-8">
                Surah {currentAyah.surah.nama_latin} ({currentAyah.surah.nama}) — Ayat {currentAyah.ayat.number.inSurah} -{' '}
                {
                  // Cari ayat terakhir dari surah ini di halaman
                  ayahs
                    .filter((a) => a.surah.nomor === currentAyah.surah.nomor)
                    .slice(-1)[0]?.ayat.number.inSurah
                }
              </h3>
            )}

            <div
              className={`shadow-lg rounded-lg p-6 mb-4 font-arabic ${lpmqFont.className} ${
                isCompleted ? 'bg-sky-100 animate-check' : 'bg-white'
              }`}
            >
              {currentAyah.ayat.number.inSurah === 1 &&
                currentAyah.surah.nomor !== 1 &&
                currentAyah.surah.nomor !== 9 && (
                  <div className="text-center text-4xl mb-6">
                    بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْم
                  </div>
                )}

              <div className="text-[2rem] text-right leading-loose">
                <span>
                  <HighlightText text={currentAyah.ayat.arab} highlight={''} />
                </span>
                <span className="text-5xl align-center mr-4">
                  {numLatinToArabic(currentAyah.ayat.number.inSurah)}
                </span>
              </div>
              
              <p className="text-lg text-gray-600 italic mt-2">{currentAyah.ayat.latin}</p>
              <p className="text-xl">{currentAyah.ayat.translation}</p>
            </div>
          </div>
        );
      })}



      <div className="flex items-center justify-between mt-6">
        <Counter count={count} 
                 setCount={setCount} 
                 onCountComplete={() => {setCompletedAyahs([...completedAyahs, currentIndex]);}}
        />


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
      <InstructionModal isOpen={showModal} onClose={() => setShowModal(false)} />

    </div>
  );
};

export default MemorizationPage;
