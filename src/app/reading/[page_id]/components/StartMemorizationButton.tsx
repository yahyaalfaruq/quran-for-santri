"use client";

import Link from "next/link";

interface StartMemorizationButtonProps {
  pageId: string;
  readCount: number;
}

const StartMemorizationButton: React.FC<StartMemorizationButtonProps> = ({ pageId, readCount }) => {
  const isEnabled = readCount === 3;

  return (
    <Link href={isEnabled ? `/memorization/${pageId}` : "#"}>
      <button
        className={`ml-4 px-4 py-2 rounded ${isEnabled ? "bg-green-600 hover:bg-green-700 text-white" : "bg-gray-400 text-white cursor-not-allowed"}`}
        disabled={!isEnabled}
      >
        Mulai Menghafal
      </button>
    </Link>
  );
};

export default StartMemorizationButton;
