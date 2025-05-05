'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import HighlightText from './components/HighlightText';
import Counter from './components/Counter';
import InstructionModal from './components/InstructionModal';


import localFont from 'next/font/local';
import { FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';
import { MdFullscreen, MdFullscreenExit, MdNavigateNext } from 'react-icons/md';
import { FaHome } from 'react-icons/fa';

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
  const [isScrolled, setIsScrolled] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <div className='text-xl text-blue-500'>Memuat halaman...</div>
      </div>
    );
  }
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (ayahs.length === 0) return <p className="text-center">Tidak ada ayat</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200">
      {/* Sticky Header */}
      <header className={`sticky top-0 z-50 bg-gradient-to-b from-sky-100 to-sky-200 transition-all duration-300 ${isScrolled ? 'py-8 shadow-lg' : 'py-10'}`}>
              <div className="container flex flex-col gap-2 mx-auto px-4">
                {/* Top Row - Page Title */}
                
                
                {/* Bottom Row - Three Button Layout */}
                <div className="flex items-center justify-between mt-2">
                  {/* Back Button - Left */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => router.push(`/reading/${pageId}`)}
                      className={`flex items-center gap-1 px-3 py-2 bg-white text-sky-700 rounded-lg border border-sky-200 shadow-sm hover:bg-sky-50 transition-all ${isScrolled ? 'text-sm py-1' : ''}`}
                    >
                      <FiArrowLeft className="text-lg" />
                    </button>
                    <button
                      onClick={() => router.push('/')}
                      className={`flex items-center gap-1 px-3 py-2 bg-white text-sky-700 rounded-lg border border-sky-200 shadow-sm hover:bg-sky-50 transition-all ${isScrolled ? 'text-sm py-1' : ''}`}
                    >
                      <FaHome className="text-lg" />
                    </button>
                  </div>
      
                  <h1 className={`font-bold text-center text-sky-800 transition-all ${isScrolled ? 'text-xl' : 'text-3xl'}`}>
                    Halaman {pageId}
                  </h1>
                  
                  <div className="flex gap-1">
                    {/* Translation Toggle - Center */}
                    <button
                      onClick={() => setShowTranslation((prev) => !prev)}
                      className={`flex items-center gap-2 px-4 py-2 bg-white text-sky-700 rounded-lg border border-sky-200 shadow-sm hover:bg-sky-50 transition-all ${isScrolled ? 'text-sm py-1' : ''}`}
                    >
                      {showTranslation ? <FiEyeOff /> : <FiEye />}
                    </button>
      
                    {/* Fullscreen Toggle - Right */}
                    <button
                      onClick={() => {
                        const elem = document.documentElement;
                        if (!document.fullscreenElement) {
                          elem.requestFullscreen();
                        } else {
                          document.exitFullscreen();
                        }
                      }}
                      className={`flex items-center justify-center p-2 bg-white text-sky-700 rounded-lg border border-sky-200 shadow-sm hover:bg-sky-50 transition-all ${isScrolled ? 'text-sm' : ''}`}
                    >
                      {isFullscreen ? <MdFullscreenExit size={20} /> : <MdFullscreen size={20} />}
                    </button>
                  </div>
                </div>
              </div>
            </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20 pt-4">
        {displayedIndices.map((index, idx) => {
          const currentAyah = ayahs[index];
          const isCompleted = completedAyahs.includes(index);
          const isFirstAyahOfSurah = index === 0 || ayahs[index].surah.nomor !== ayahs[displayedIndices[idx - 1]]?.surah.nomor;
          
          return (
            <div key={index}>
              {isFirstAyahOfSurah && (
                <h3 className="text-2xl font-bold text-center my-8 text-sky-800">
                  Surah {currentAyah.surah.nama_latin} ({currentAyah.surah.nama}) — Ayat {currentAyah.ayat.number.inSurah}
                  {(() => {
                    const sameSurahAyahs = ayahs.filter((a) => a.surah.nomor === currentAyah.surah.nomor);
                    const lastAyahNum = sameSurahAyahs[sameSurahAyahs.length - 1].ayat.number.inSurah;
                    if (lastAyahNum !== currentAyah.ayat.number.inSurah) {
                      return ` - ${lastAyahNum}`;
                    }
                    return '';
                  })()}
              </h3>
              )}

              <div className={`rounded-xl p-6 mb-6 shadow-md ${lpmqFont.className} ${
                isCompleted ? 'bg-sky-50 border-2 border-sky-300' : 'bg-white border border-sky-200'
              }`}>
                {currentAyah.ayat.number.inSurah === 1 &&
                  currentAyah.surah.nomor !== 1 &&
                  currentAyah.surah.nomor !== 9 && (
                    <div className="text-center text-4xl mb-6 text-sky-800">
                      بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْم
                    </div>
                  )}

                <div className="text-3xl md:text-4xl text-right leading-loose text-sky-900">
                  <HighlightText text={currentAyah.ayat.arab} highlight={''} />
                  <span className="text-4xl text-sky-600 mr-2">
                    {numLatinToArabic(currentAyah.ayat.number.inSurah)}
                  </span>
                </div>

                {showTranslation && (
                  <>
                    <p className="text-lg text-gray-600 italic mt-2">{currentAyah.ayat.latin}</p>
                    <p className="text-xl">({currentAyah.ayat.number.inSurah}) {currentAyah.ayat.translation}</p>
                  </>
                )}

                {/* Centang animasi */}
                {isCompleted && (
                  <div className="mt-4 flex justify-start">
                    <div className="flex items-center gap-2 text-sky-500 animate-check">
                      <svg xmlns="http://www.w3.org/2000/svg" 
                           fill="none" 
                           viewBox="0 0 24 24" 
                           strokeWidth={3} 
                           stroke="currentColor" 
                           className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-base font-medium">Sudah dibaca 20X</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

     {/* Action Buttons */}
       <div className="container mx-auto">
         <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-lg border border-sky-200">
           <Counter 
             count={count} 
             setCount={setCount} 
             onCountComplete={() => setCompletedAyahs([...completedAyahs, currentIndex])}
           />

           <button
             onClick={handleNextAyah}
             disabled={count < 20}
             className={`flex items-center px-6 py-3 rounded-lg transition-all ${
               count >= 20
                 ? 'bg-sky-600 text-white hover:bg-sky-700 shadow-md'
                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'
             }`}
           >
             Lanjut Ayat <MdNavigateNext className="text-2xl" />
           </button>
         </div>
       </div>
     </div>


      <InstructionModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

export default MemorizationPage;
