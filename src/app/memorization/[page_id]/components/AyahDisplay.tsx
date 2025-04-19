import localFont from 'next/font/local';

const lpmqFont = localFont({
    src: '../../../../fonts/LPMQ IsepMisbah.ttf',
    variable: '--font-lpmq',
  });

const AyahDisplay = ({ ayahs }: { ayahs: any[] }) => {
    return (
      <div>
        {ayahs.map((ayah, index) => (
          <div key={index} className={`font-arabic p-7 ${lpmqFont.className} flex flex-col gap-3`}>
            <div className='flex flex-row justify-end items-end gap-3'>
                <span className='text-5xl'>{numLatinToArabic(ayah.number.inSurah)}</span> 
                <span className='text-4xl'>{ayah.text}</span>
            </div>
            <p className='text-3xl'>{ayah.latin}</p>
            <p className='text-3xl'>{ayah.translation}</p>
          </div>
        ))}
          </div>
    );
};

const numLatinToAr=(n: string)=>n.replace(/\d/g,(d: any)=>"٠١٢٣٤٥٦٧٨٩"[d]).replace(/\./g, ",");

function numLatinToArabic(n: string | number) {
  console.log("ini adalah data: ", n);
  if (typeof n === "number") {
    n.toString();
  }
  return n.toString().replace(/\d/g,(d: any)=>"٠١٢٣٤٥٦٧٨٩"[d]).replace(/\./g, ",");
}
  
export default AyahDisplay;
  