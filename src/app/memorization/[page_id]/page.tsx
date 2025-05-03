'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import HighlightText from './components/HighlightText';
import Counter from './components/Counter';
import InstructionModal from './components/InstructionModal';


import localFont from 'next/font/local';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { MdFullscreen, MdFullscreenExit, MdNavigateNext } from 'react-icons/md';

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
  const [showTranslation, setShowTranslation] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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
      setShowModal(true);
      setHasShownInstruction(true);
    }
  }, [loading, error, hasShownInstruction]);

  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handleChange);
    return () => document.removeEventListener("fullscreenchange", handleChange);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (ayahs.length === 0) return <p className="text-center">Tidak ada ayat</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">
        Hafalan Halaman {pageId}
      </h1>

      <button
        onClick={() => setShowTranslation((prev) => !prev)}
        className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
      >
        {showTranslation ? (
          <>
            <FiEyeOff className="text-xl" />
            Sembunyikan Arti & Latin
          </>
        ) : (
          <>
            <FiEye className="text-xl" />
            Tampilkan Arti & Latin
          </>
        )}
      </button>


      <button
        onClick={() => {
          const elem = document.documentElement;
          if (!document.fullscreenElement) {
            elem.requestFullscreen();
          } else {
            document.exitFullscreen();
          }
        }}
        className="fixed bottom-4 right-4 p-3 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 transition"
      >
        {isFullscreen ? <MdFullscreenExit size={24} /> : <MdFullscreen size={24} />}
      </button>


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

              {showTranslation && (
              <>
                <p className="text-lg text-gray-600 italic mt-2">{currentAyah.ayat.latin}</p>
                <p className="text-xl">({currentAyah.ayat.number.inSurah}) {currentAyah.ayat.translation}</p>
              </>
              )}
              
            </div>
          </div>
        );
      })}



      <div className="flex items-end justify-between mt-6">
        <Counter count={count} 
                 setCount={setCount} 
                 onCountComplete={() => {setCompletedAyahs([...completedAyahs, currentIndex]);}}
        />


        <button
          onClick={handleNextAyah}
          disabled={count < 20}
          className={`flex items-center px-4 py-3 rounded-lg transition ${
            count >= 20
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-400 text-gray-200 hover:bg-gray-400 cursor-not-allowed'
          }`}
        >
            Lanjut Ayat <MdNavigateNext className="text-2xl" /> 
        </button>
      </div>
      {<InstructionModal isOpen={showModal} onClose={() => setShowModal(false)} />}

    </div>
  );
};

export default MemorizationPage;
