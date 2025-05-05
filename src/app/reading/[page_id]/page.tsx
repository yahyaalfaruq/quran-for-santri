"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import AyahDisplay from "./components/AyahDisplay";
import ConfirmReadButton from "./components/ConfirmReadButton";
import StartMemorizationButton from "./components/StartMemorizationButton";
import InstructionModal from "./components/InstructionModal";
import { FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";
import { MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { FaHome } from "react-icons/fa";

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

const Page = () => {
  const params = useParams(); // Mengambil params dengan useParams
  const page_id = params?.page_id as string;
  const router = useRouter();

  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readCount, setReadCount] = useState<number>(0);
  const [hasShownInstruction, setHasShownInstruction] = useState(false); // 🆕
  const [completedAyahs, setCompletedAyahs] = useState<number[]>([]); // Track completed ayahs
  const [showTranslation, setShowTranslation] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        if (!page_id) {
          setError("Halaman tidak ditemukan.");
          setLoading(false);
          return;
        }

        // Fetch page mapping
        const mappingResponse = await fetch("/page-mapping.json");
        if (!mappingResponse.ok) {
          throw new Error("Failed to load page mapping");
        }

        const mappingData = await mappingResponse.json();
        const pageMapping = mappingData[page_id];

        if (!pageMapping) {
          setError("Halaman tidak ditemukan.");
          setLoading(false);
          return;
        }

        const { start, end } = pageMapping;

        // Fetch Quran ayahs in the range
        const response = await fetch(
          `https://quran.ppqita.my.id/api/quran?mushafPage=${page_id}&token=TADABBUR_EMAILKU`
        );

        if (!response.ok) {
          throw new Error("Failed to load Quran ayahs");
        }

        const result = await response.json();

        // Map and set ayahs

        setAyahs(result.data);
        setLoading(false);
        // console.log(fetchedAyahs);
      } catch (error) {
        console.error("Error:", error);
        setError("Terjadi kesalahan saat memuat halaman.");
        setLoading(false);
      }
    };

    fetchPageData();
  }, [page_id]);

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
      if (contentRef.current) {
        const scrollTop = contentRef.current.getBoundingClientRect().top;
        setIsScrolled(scrollTop < -50); // Mulai sticky setelah scroll 50px
      }
    };

    contentRef.current?.addEventListener('scroll', handleScroll);
    return () => contentRef.current?.removeEventListener('scroll', handleScroll);
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
  if (!ayahs.length) return <p className="text-center">Tidak ada ayat untuk halaman ini.</p>;

  // Menampilkan ayat dan judul surah pertama kali pada halaman
  const displayedIndices = ayahs.map((_, idx) => idx);

  return (

    //sebelum dari deepseek

    // <div className="p-8 relative">
    //   <h1 className="text-5xl font-bold mb-4 text-center">Halaman {page_id}</h1>
    //   <button
    //     onClick={() => setShowTranslation((prev) => !prev)}
    //     className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
    //   >
    //     {showTranslation ? (
    //       <>
    //         <FiEyeOff className="text-xl" />
    //         Sembunyikan Arti & Latin
    //       </>
    //     ) : (
    //       <>
    //         <FiEye className="text-xl" />
    //         Tampilkan Arti & Latin
    //       </>
    //     )}
    //   </button>

    //   <button
    //     onClick={() => {
    //       const elem = document.documentElement;
    //       if (!document.fullscreenElement) {
    //         elem.requestFullscreen();
    //       } else {
    //         document.exitFullscreen();
    //       }
    //     }}
    //     className="fixed bottom-4 right-4 p-3 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 transition"
    //   >
    //     {isFullscreen ? <MdFullscreenExit size={24} /> : <MdFullscreen size={24} />}
    //   </button>

    //   <div className="space-y-6">
    //       {ayahs.map((currentAyah, index) => {
    //         const isCompleted = completedAyahs.includes(index);
    //         const previousAyah = ayahs[index - 1];
          
    //         const isNewSurah =
    //           index === 0 || currentAyah.surah.nomor !== previousAyah?.surah.nomor;
          
    //         const lastAyahInThisSurah = ayahs
    //           .filter((a) => a.surah.nomor === currentAyah.surah.nomor)
    //           .slice(-1)[0]?.ayat.number.inSurah;
          
    //         return (
    //           <div key={index}>
    //             {isNewSurah && (
    //               <h3 className="text-2xl font-bold text-center my-8">
    //                 Surah {currentAyah.surah.nama_latin} ({currentAyah.surah.nama}) — 
    //                 {/* Cek jika hanya ada satu ayat di halaman */}
    //                 {ayahs.length === 1
    //                   ? currentAyah.ayat.number.inSurah
    //                   : `Ayat ${currentAyah.ayat.number.inSurah} - ${lastAyahInThisSurah}`}
    //               </h3>
    //             )}

    //             <AyahDisplay ayah={currentAyah} showTranslation={showTranslation} />

    //           </div>
    //         );
    //       })}
    //   </div>

    //   <div className="flex items-center justify-between mt-6">
    //     <ConfirmReadButton pageId={page_id} readCount={readCount} setReadCount={setReadCount} />
    //     <StartMemorizationButton pageId={page_id} readCount={readCount} />
    //   </div>

    //   {<InstructionModal isOpen={showModal} onClose={() => setShowModal(false)} />}
    // </div>

    
    // dari deepseek
    // <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 p-4 md:p-8 relative">
    //   <div className="max-w-4xl mx-auto">
    //     <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center text-sky-800 drop-shadow-sm">
    //       Halaman {page_id}
    //     </h1>

    //     <button
    //       onClick={() => setShowTranslation((prev) => !prev)}
    //       className="mb-8 px-4 py-2 bg-white text-sky-700 rounded-lg hover:bg-sky-50 transition flex items-center gap-2 shadow-md border border-sky-200"
    //     >
    //       {showTranslation ? (
    //         <>
    //           <FiEyeOff className="text-xl" />
    //         </>
    //       ) : (
    //         <>
    //           <FiEye className="text-xl" />
    //         </>
    //       )}
    //     </button>

    //     <div className="space-y-8">
    //         {ayahs.map((currentAyah, index) => {
    //             const isCompleted = completedAyahs.includes(index);
    //             const previousAyah = ayahs[index - 1];

    //             const isNewSurah =
    //               index === 0 || currentAyah.surah.nomor !== previousAyah?.surah.nomor;

    //             const lastAyahInThisSurah = ayahs
    //               .filter((a) => a.surah.nomor === currentAyah.surah.nomor)
    //               .slice(-1)[0]?.ayat.number.inSurah;

    //             return (
    //               <div key={index}>
    //                 {isNewSurah && (
    //                   <h3 className="text-2xl font-bold text-center my-8">
    //                     Surah {currentAyah.surah.nama_latin} ({currentAyah.surah.nama}) — 
    //                     {/* Cek jika hanya ada satu ayat di halaman */}
    //                     {ayahs.length === 1
    //                       ? currentAyah.ayat.number.inSurah
    //                       : `Ayat ${currentAyah.ayat.number.inSurah} - ${lastAyahInThisSurah}`}
    //                   </h3>
    //                 )}

    //                 <AyahDisplay ayah={currentAyah} showTranslation={showTranslation} />
                  
    //               </div>
    //             );
    //         })}
    //     </div>

    //     <div className="flex items-center justify-between mt-8 p-4 bg-white rounded-xl shadow-md">
    //       <ConfirmReadButton pageId={page_id} readCount={readCount} setReadCount={setReadCount} />
    //       <StartMemorizationButton pageId={page_id} readCount={readCount} />
    //     </div>
    //   </div>

    //   <button
    //     onClick={() => {
    //       const elem = document.documentElement;
    //       if (!document.fullscreenElement) {
    //         elem.requestFullscreen();
    //       } else {
    //         document.exitFullscreen();
    //       }
    //     }}
    //     className="fixed bottom-4 right-4 p-3 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 transition"
    //   >
    //     {isFullscreen ? <MdFullscreenExit size={24} /> : <MdFullscreen size={24} />}
    //   </button>
    //   {<InstructionModal isOpen={showModal} onClose={() => setShowModal(false)} />}
    // </div>

    // dari deepseek yang ditambahin sticky header
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200" ref={contentRef}>
      {/* Sticky Header */}
      <header className={`sticky top-0 z-50 bg-gradient-to-b from-sky-100 to-sky-200 transition-all duration-300 ${isScrolled ? 'py-8 shadow-lg' : 'py-10'}`}>
        <div className="container flex flex-col gap-2 mx-auto px-4">
          {/* Top Row - Page Title */}
          
          
          {/* Bottom Row - Three Button Layout */}
          <div className="flex items-center justify-between mt-2">
            {/* Back Button - Left */}
            <div className="flex gap-1">
              <button
                onClick={() => router.push('/onboarding')}
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
              Halaman {page_id}
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

        
        {/* Content */}
        <div className="container mx-auto px-4 pb-20 pt-4">
          <div className="space-y-6">
            {ayahs.map((currentAyah, index) => {
              const isCompleted = completedAyahs.includes(index);
              const previousAyah = ayahs[index - 1];

              const isNewSurah =
                index === 0 || currentAyah.surah.nomor !== previousAyah?.surah.nomor;

              const lastAyahInThisSurah = ayahs
                .filter((a) => a.surah.nomor === currentAyah.surah.nomor)
                .slice(-1)[0]?.ayat.number.inSurah;

              return (
                <div key={index}>
                  {isNewSurah && (
                    <h3 className="text-2xl font-bold text-center my-8">
                      Surah {currentAyah.surah.nama_latin} ({currentAyah.surah.nama}) — 
                      {/* Cek jika hanya ada satu ayat di halaman */}
                      {ayahs.length === 1
                        ? currentAyah.ayat.number.inSurah
                        : `Ayat ${currentAyah.ayat.number.inSurah} - ${lastAyahInThisSurah}`}
                    </h3>
                  )}

                  <AyahDisplay ayah={currentAyah} showTranslation={showTranslation} />
                
                </div>
              );
            })}
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <ConfirmReadButton pageId={page_id} readCount={readCount} setReadCount={setReadCount} />
            <StartMemorizationButton pageId={page_id} readCount={readCount} />
          </div>
        </div>
        
      {<InstructionModal isOpen={showModal} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Page;
