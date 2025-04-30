"use client";
import { useState, useEffect } from "react";

interface ConfirmReadButtonProps {
  pageId: string;
  readCount: number;
  setReadCount: (count: number) => void;
}

const ConfirmReadButton: React.FC<ConfirmReadButtonProps> = ({ pageId, readCount, setReadCount }) => {
  const handleConfirm = () => {
    if (readCount < 3) {
      const newCount = readCount + 1;
      setReadCount(newCount);

      // Scroll ke atas dengan animasi halus
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      alert("Saatnya menghafal!");
    }
  };

  return (
    <button
      onClick={handleConfirm}
      className={`bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded ${readCount >= 3 ? "opacity-50 cursor-not-allowed" : ""}`}
      disabled={readCount >= 3}
    >
      Sudah Dibaca {readCount}/3
    </button>
  );
};

export default ConfirmReadButton;
