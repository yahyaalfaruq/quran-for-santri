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
    <div className="fixed inset-0 z-50 bg-sky-100/80 backdrop-blur-sm flex items-center justify-center px-4">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl border-2 border-sky-200">
        <div className="text-center">
          <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl text-sky-600">⭐</span>
          </div>
          <h2 className="text-2xl font-bold text-sky-800 mb-3">Instruksi Membaca</h2>
          <p className="text-gray-700 mb-6">
            Bacalah halaman ini sebanyak <span className="font-bold text-sky-600">20x</span> pada setiap ayat yang dihafal!
          </p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition shadow-md font-medium"
          >
            Siap, Mulai!
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstructionModal;
