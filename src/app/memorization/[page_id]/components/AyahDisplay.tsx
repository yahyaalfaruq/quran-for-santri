import localFont from 'next/font/local';

const lpmqFont = localFont({
    src: '../../../../fonts/LPMQ IsepMisbah.ttf',
    variable: '--font-lpmq',
  });

const AyahDisplay = ({ ayahs }: { ayahs: any[] }) => {
    return (
      <div>
        {ayahs.map((ayah, index) => (
          <p key={index} className={`text-4xl font-arabic ${lpmqFont.className}`}>{ayah.text} <span>{numLatinToAr(ayah.number.inSurah)}</span></p>
        ))}
      </div>
    );
};

const numLatinToAr=(n: string)=>n.replace(/\d/g,(d: any)=>"٠١٢٣٤٥٦٧٨٩"[d]).replace(/\./g, ",");
  
export default AyahDisplay;
  