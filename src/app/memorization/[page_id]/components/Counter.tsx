interface CounterProps {
  count: number;
  setCount: (newCount: number) => void;
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
        className="bg-green-600 text-white px-4 py-2 rounded-lg mt-2"
        onClick={incrementCount}
        disabled={count >= 20}
      >
        Tambah Hitungan
      </button>
    </div>
  );
}
