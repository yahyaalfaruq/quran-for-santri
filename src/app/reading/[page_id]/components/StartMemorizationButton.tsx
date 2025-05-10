"use client";

import Link from "next/link";
import { GiBrain } from "react-icons/gi";

interface StartMemorizationButtonProps {
  pageId: string;
  readCount: number;
}

const StartMemorizationButton: React.FC<StartMemorizationButtonProps> = ({ pageId, readCount }) => {
  const isEnabled = readCount === 3;

  return (
    <Link href={isEnabled ? `/memorization/${pageId}` : "#"}>
      {/* sebelum deepseek */}
      {/* <button
        className={`ml-4 flex items-center gap-2 px-4 py-3 rounded ${isEnabled ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-400 text-white cursor-not-allowed"}`}
        disabled={!isEnabled}
      >
       Mulai Menghafal <GiBrain className="text-xl text-red-2 00" /> 
      </button> */}

      {/* dari deepseek */}
      <button
        className={`ml-4 flex items-center gap-3 px-6 py-3 rounded-lg transition-all shadow-md ${
          isEnabled 
            ? "bg-emerald-500 hover:bg-emerald-600 text-white" 
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
        disabled={!isEnabled}
      >
        Mulai Menghafal 
        <GiBrain className={`text-xl ${isEnabled ? "text-white" : "text-gray-400"}`} />
      </button>
    </Link>
  );
};

export default StartMemorizationButton;
