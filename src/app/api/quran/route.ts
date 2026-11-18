import { NextRequest, NextResponse } from "next/server";
import quranData from "@/data/quran.json";

interface VerseItem {
  inQuran: number;
  inSurah: number;
  juz: number;
  page: number;
  arab: string;
  latin: string;
  translation: string;
  audio?: string;
}

interface SurahItem {
  nomor: number;
  nama: string;
  nama_latin: string;
  jumlah_ayat: number;
  arti: string;
  revelation?: string;
  verses: VerseItem[];
}

const surahs = quranData as SurahItem[];

function formatAyahResponse(surah: SurahItem, verse: VerseItem) {
  return {
    ayat: {
      number: {
        inQuran: verse.inQuran,
        inSurah: verse.inSurah,
      },
      arab: verse.arab,
      latin: verse.latin,
      translation: verse.translation,
      audio: verse.audio || "",
      meta: {
        juz: verse.juz,
        page: verse.page,
      },
    },
    surah: {
      nomor: surah.nomor,
      nama: surah.nama,
      nama_latin: surah.nama_latin,
      jumlah_ayat: surah.jumlah_ayat,
      arti: surah.arti,
    },
  };
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const listSurah = searchParams.get("listSurah");
  const surat = searchParams.get("surat");
  const juz = searchParams.get("juz");
  const mushafPage = searchParams.get("mushafPage");
  const search = searchParams.get("search");

  // 1. Daftar seluruh surah (?listSurah=true)
  if (listSurah === "true") {
    const data = surahs.map((s) => ({
      nomor: s.nomor,
      nama: s.nama,
      nama_latin: s.nama_latin,
      jumlah_ayat: s.jumlah_ayat,
      arti: s.arti,
      revelation: s.revelation,
    }));

    return NextResponse.json({
      status: "success",
      data,
    });
  }

  // 2. Berdasarkan nomor surah (?surat=1..114)
  if (surat !== null) {
    const surahNumber = parseInt(surat, 10);
    if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
      return NextResponse.json(
        { status: "error", message: "Nomor surah harus antara 1 sampai 114" },
        { status: 400 }
      );
    }

    const foundSurah = surahs.find((s) => s.nomor === surahNumber);
    if (!foundSurah) {
      return NextResponse.json(
        { status: "error", message: "Surah tidak ditemukan" },
        { status: 404 }
      );
    }

    const data = foundSurah.verses.map((v) => formatAyahResponse(foundSurah, v));

    return NextResponse.json({
      status: "success",
      data,
    });
  }

  // 3. Berdasarkan nomor juz (?juz=1..30)
  if (juz !== null) {
    const juzNumber = parseInt(juz, 10);
    if (isNaN(juzNumber) || juzNumber < 1 || juzNumber > 30) {
      return NextResponse.json(
        { status: "error", message: "Nomor juz harus antara 1 sampai 30" },
        { status: 400 }
      );
    }

    const data: ReturnType<typeof formatAyahResponse>[] = [];
    for (const s of surahs) {
      for (const v of s.verses) {
        if (v.juz === juzNumber) {
          data.push(formatAyahResponse(s, v));
        }
      }
    }

    return NextResponse.json({
      status: "success",
      data,
    });
  }

  // 4. Berdasarkan halaman mushaf (?mushafPage=1..604)
  if (mushafPage !== null) {
    const pageNumber = parseInt(mushafPage, 10);
    if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > 604) {
      return NextResponse.json(
        { status: "error", message: "Nomor halaman harus antara 1 sampai 604" },
        { status: 400 }
      );
    }

    const data: ReturnType<typeof formatAyahResponse>[] = [];
    for (const s of surahs) {
      for (const v of s.verses) {
        if (v.page === pageNumber) {
          data.push(formatAyahResponse(s, v));
        }
      }
    }

    return NextResponse.json({
      status: "success",
      data,
    });
  }

  // 5. Pencarian kata kunci pada terjemahan/latin (?search=...)
  if (search) {
    const q = search.toLowerCase();
    const data: ReturnType<typeof formatAyahResponse>[] = [];
    for (const s of surahs) {
      for (const v of s.verses) {
        if (
          v.translation.toLowerCase().includes(q) ||
          v.latin.toLowerCase().includes(q)
        ) {
          data.push(formatAyahResponse(s, v));
          if (data.length >= 100) break;
        }
      }
      if (data.length >= 100) break;
    }

    return NextResponse.json({
      status: "success",
      data,
    });
  }

  // Default: kembalikan daftar surah
  return NextResponse.json({
    status: "success",
    data: surahs.map((s) => ({
      nomor: s.nomor,
      nama: s.nama,
      nama_latin: s.nama_latin,
      jumlah_ayat: s.jumlah_ayat,
      arti: s.arti,
    })),
  });
}
