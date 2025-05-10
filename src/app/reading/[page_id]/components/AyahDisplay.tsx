import localFont from 'next/font/local';

const lpmqFont = localFont({
  src: '../../../../fonts/LPMQ IsepMisbah.ttf',
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

// sebelum deepseek
// const AyahDisplay = ({ ayah, showTranslation }: { ayah: Ayah; showTranslation: boolean }) => {
//   return (
//     <div className={`font-arabic p-7 ${lpmqFont.className} flex flex-col gap-3`}>
//       {/* Tampilkan Bismillah jika ayat pertama, dan bukan Al-Fatihah */}
//       {ayah.ayat.number.inSurah === 1 && ayah.surah.nomor !== 1 && (
//         <div className="text-center text-4xl mb-6">
//           بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
//         </div>
//       )}

//       <div className="text-[2rem] text-right leading-loose">
//         <span className="leading-loose text-right text-2xl md:text-3xl">
//           {ayah.ayat.arab}
//         </span>
//         <span className="text-5xl align-center mr-4">
//           {numLatinToArabic(ayah.ayat.number.inSurah)}
//         </span>
//       </div>
//       {showTranslation && (
//       <>
//         <p className="text-lg text-gray-600 italic mt-2">{ayah.ayat.latin}</p>
//         <p className="text-xl">({ayah.ayat.number.inSurah}) {ayah.ayat.translation}</p>
//       </>
//       )}

//     </div>
//   );
// };

// dari deepseek
const AyahDisplay = ({ ayah, showTranslation }: { ayah: Ayah; showTranslation: boolean }) => {
  return (
    <div className={`bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow ${lpmqFont.className}`}>
      {/* Bismillah */}
      {ayah.ayat.number.inSurah === 1 && ayah.surah.nomor !== 1 && (
        <div className="text-center text-4xl mb-6 text-sky-800">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </div>
      )}

    <div className="text-3xl text-right leading-loose mb-4">
      <span className="leading-loose text-right text-3x4 text-sky-900 md:text-4xl">
        {ayah.ayat.arab}
      </span>
      <span className="text-sky-600 text-5xl align-center mr-2">
        {numLatinToArabic(ayah.ayat.number.inSurah)}
      </span>
    </div>

      
      {showTranslation && (
        <div className="mt-4 space-y-3">
          <p className="text-lg text-gray-700 italic border-l-4 border-sky-300 pl-4 py-1 bg-sky-50 rounded-r">
            {ayah.ayat.latin}
          </p>
          <p className="text-lg text-gray-800">
            ({ayah.ayat.number.inSurah}) {ayah.ayat.translation}
          </p>
        </div>
      )}
    </div>
  );
};

// Fungsi untuk mengubah angka latin menjadi arab
function numLatinToArabic(n: string | number) {
  return n.toString().replace(/\d/g, (d: any) => "٠١٢٣٤٥٦٧٨٩"[d]).replace(/\./g, ",");
}

export default AyahDisplay;
