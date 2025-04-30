interface CounterProps {
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  onCountComplete?: () => void;
}

export default function Counter({ count, setCount, onCountComplete }: CounterProps) {
  const incrementCount = () => {
    if (count < 20) {
      const newCount = count + 1;
      setCount(newCount);

      if (newCount === 20 && onCountComplete) {
        onCountComplete();
      }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-lg font-bold">Hitungan: {count}/20</p>
      <button
        className={`px-4 py-2 rounded-lg mt-2 transition font-semibold ${
          count >= 20
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        onClick={incrementCount}
        disabled={count >= 20}
      >
        Tambah Hitungan
      </button>
    </div>
  );
}
