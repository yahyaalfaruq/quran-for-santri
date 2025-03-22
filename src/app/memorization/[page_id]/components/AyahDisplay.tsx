const AyahDisplay = ({ ayahs }: { ayahs: string[] }) => {
    return (
      <div>
        {ayahs.map((ayah, index) => (
          <p key={index} className="text-4xl font-arabic">{ayah}</p>
        ))}
      </div>
    );
  };
  
export default AyahDisplay;
  