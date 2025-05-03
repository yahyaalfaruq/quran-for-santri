"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AyahDisplay from "./components/AyahDisplay";
import ConfirmReadButton from "./components/ConfirmReadButton";
import StartMemorizationButton from "./components/StartMemorizationButton";
import InstructionModal from "./components/InstructionModal";

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

  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readCount, setReadCount] = useState<number>(0);
  const [hasShownInstruction, setHasShownInstruction] = useState(false); // 🆕
  const [completedAyahs, setCompletedAyahs] = useState<number[]>([]); // Track completed ayahs
  const [showTranslation, setShowTranslation] = useState(true);
  const [showModal, setShowModal] = useState(false);

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
      // toast("⭐ Bacalah halaman ini sebanyak 3x!", {
      //   description: "",
      //   style: {
      //     background: '#f0f9ff',
      //     color: '#0369a1',
      //     fontWeight: 'bold',
      //     border: '1px solid #bae6fd',
      //     padding: '1rem',
      //     fontSize: '1rem',
      //   },
      //   duration: Infinity,
      //   action: (
      //     <button
      //       onClick={() => {
      //         toast.dismiss();
      //       }}
      //       className="bg-blue-600 text-white font-bold text-[0.7rem] rounded-lg px-1 py-1 hover:bg-blue-700 transition-colors"
      //     >
      //       Oke
      //     </button>
      //   ),
      // });
      setShowModal(true);
      setHasShownInstruction(true);
    }
  }, [loading, error, hasShownInstruction]);

  if (loading) return <p className="text-center mt-10">Memuat...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!ayahs.length) return <p className="text-center">Tidak ada ayat untuk halaman ini.</p>;

  // Menampilkan ayat dan judul surah pertama kali pada halaman
  const displayedIndices = ayahs.map((_, idx) => idx);

  return (
    <div className="p-8 relative">
      <h1 className="text-5xl font-bold mb-4 text-center">Halaman {page_id}</h1>
      <button
          onClick={() => setShowTranslation((prev) => !prev)}
          className="mb-6 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
        >
          {showTranslation ? "Sembunyikan Arti & Latin" : "Tampilkan Arti & Latin"}
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
          className="fixed bottom-4 right-4 px-4 py-2 bg-yellow-500 text-white font-bold rounded-lg shadow-lg hover:bg-yellow-600 transition"
      >
        Toggle Fullscreen
      </button>

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

      <div>
        <ConfirmReadButton pageId={page_id} readCount={readCount} setReadCount={setReadCount} />
        <StartMemorizationButton pageId={page_id} readCount={readCount} />
      </div>

      {<InstructionModal isOpen={showModal} onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Page;
