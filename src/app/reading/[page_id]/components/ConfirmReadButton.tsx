"use client";
import { useState, useEffect } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { BsPatchCheckFill } from "react-icons/bs";
import { MdDone } from "react-icons/md";

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
    // sebelum deepseek
    // <button
    //   onClick={handleConfirm}
    //   className={`flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded ${readCount >= 3 ? "bg-gray-400 text-gray-200 hover:bg-gray-400  cursor-not-allowed" : ""}`}
    //   disabled={readCount >= 3}
    // >
    //   <BsPatchCheckFill className="text-xl" /> Sudah Dibaca {readCount}/3
    // </button>

    // dari deepseek
    <button
      onClick={handleConfirm}
      className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all shadow-md ${
        readCount >= 3 
          ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
          : "bg-sky-600 hover:bg-sky-700 text-white"
      }`}
      disabled={readCount >= 3}
      >
      {readCount >= 3 ? (
        <MdDone className="text-xl" />
      ) : (
        <BsPatchCheckFill className="text-xl" />
      )}
      Sudah Dibaca {readCount}/3
    </button>
  );
};

export default ConfirmReadButton;
