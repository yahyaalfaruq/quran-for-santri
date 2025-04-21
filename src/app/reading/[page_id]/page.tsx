"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AyahDisplay from "../../memorization/[page_id]/components/AyahDisplay";
import { ms } from "date-fns/locale";
import ConfirmReadButton from "./components/ConfirmReadButton";
import StartMemorizationButton from "./components/StartMemorizationButton";

interface Ayah {
  number: {
    inQuran: number;
    inSurah: number;
  };
  text: string;
  translation: string;
}

const Page = () => {
  const params = useParams();  // Mengambil params dengan useParams
  const page_id = params?.page_id as string;

  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [readCount, setReadCount] = useState<number>(0);

  const [instruction, setInstruction] = useState<boolean>(true);

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
        const fetchedAyahs = result.data.map((ayah: any) => ({
          number: {
            inQuran: ayah.ayat?.number?.inQuran || 0,
            inSurah: ayah.ayat?.number?.inSurah || 0,
          },
          text: ayah.ayat?.arab || "",
          translation: ayah.ayat?.translation || ""
        }));

        setAyahs(fetchedAyahs);
        setLoading(false);
        console.log(fetchedAyahs)
      } catch (error) {
        console.error("Error:", error);
        setError("Terjadi kesalahan saat memuat halaman.");
        setLoading(false);
      }
    };

    fetchPageData();
  }, [page_id]);

  useEffect(() => {
    if (instruction) {
      setTimeout(() => {alert("Bacalah halaman ini sebanyak 3x!")}, 2000);
      setInstruction(false);
    }
  }, []);

  if (loading) return <p className="text-center mt-10">Memuat...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!ayahs.length) return <p className="text-center">Tidak ada ayat untuk halaman ini.</p>;

  return (
    <div className="p-8 relative">
      <div className="absolute w-screen h-screen ">

      </div>
      <h1 className="text-5xl font-bold mb-4 text-center">Halaman {page_id}</h1>
      <div className="space-y-6">
          <AyahDisplay
            ayahs={ayahs}
          />
      </div>
      <div>
          <ConfirmReadButton pageId={page_id} readCount={readCount} setReadCount={setReadCount} />
          <StartMemorizationButton pageId={page_id} readCount={readCount} />
      </div>
    </div>
  );
};

export default Page;
