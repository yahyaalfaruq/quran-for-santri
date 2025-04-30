import localFont from 'next/font/local';

const lpmqFont = localFont({
  src: '../../../../fonts/LPMQ IsepMisbah.ttf',
  variable: '--font-lpmq',
});

const AyahDisplay = ({ ayahs }: { ayahs: any[] }) => {
  return (
    <div>
      {ayahs.map((ayah, index) => (
        <div
          key={index}
          className={`font-arabic p-7 ${lpmqFont.className} flex flex-col gap-3`}
        >
          {/* Tampilkan Bismillah jika ayat pertama, dan bukan Al-Fatihah */}
          {ayah.number.inSurah === 1 && ayah.surah.nomor !== 1 && (
            <div className="text-center text-4xl mb-6">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
          )}

          <div className="text-[2rem] text-right leading-loose">
            <span className="leading-loose text-right text-2xl md:text-3xl">
              {ayah.text}
            </span>
            <span className="text-5xl align-center mr-4">
              {numLatinToArabic(ayah.number.inSurah)}
            </span>
          </div>
          <p className="text-lg text-gray-600 italic mt-2">{ayah.latin}</p>
          <p className="text-xl">{ayah.translation}</p>
        </div>
      ))}
    </div>
  );
};

// Fungsi untuk mengubah angka latin menjadi arab
function numLatinToArabic(n: string | number) {
  return n.toString().replace(/\d/g, (d: any) => "٠١٢٣٤٥٦٧٨٩"[d]).replace(/\./g, ",");
}

export default AyahDisplay;
