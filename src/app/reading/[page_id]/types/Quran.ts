export interface Ayah {
    number: {
      inQuran: number;
      inSurah: number;
    };
    arab: string;
    latin: string;
    translation: string;
  }
  
  export interface Surah {
    nama_latin: string;
    jumlah_ayat: number;
  }
  
  export interface AyahData {
    surah: Surah;
    ayat: Ayah;
  }
  