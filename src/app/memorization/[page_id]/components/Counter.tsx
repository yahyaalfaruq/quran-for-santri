// app/components/Counter.tsx
'use client';
import { useState } from 'react';

export default function Counter({ onCountComplete }: { onCountComplete: () => void }) {
  const [count, setCount] = useState(0);

  const incrementCount = () => {
    if (count < 20) {
      setCount(count + 1);
    }
    if (count + 1 === 20) {
      onCountComplete();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p className="text-lg font-bold">Hitungan: {count}/20</p>
      <button className="bg-green-600 text-white px-4 py-2 rounded-lg mt-2" onClick={incrementCount}>
        Tambah Hitungan
      </button>
    </div>
  );
}