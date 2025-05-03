'use client';
import React from 'react';

const InstructionModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white/30 bg-opacity-80 backdrop-blur-sm flex items-center justify-center px-4">
      <div className=" bg-sky-50 rounded-lg p-6 max-w-md w-full shadow-lg">
        <h2 className="text-xl text-sky-700 font-bold mb-4 text-center">⭐ Instruksi</h2>
        <p className="text-sky-700 text-center mb-6">
          Bacalah halaman ini sebanyak <span className="font-semibold">20x</span> sebelum melanjutkan ke hafalan!
        </p>
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Siap, mulai!
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionModal;
