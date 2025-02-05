'use client';

import React from 'react';
import { useDownloadExcel } from "@/hooks/useDownloadExcel";

const DownloadExcel = () => {
  const { downloadExcel, loading, error } = useDownloadExcel();

  const handleDownload = async () => {
    await downloadExcel();
  };
  
  return (
    <section className="flex flex-col items-center justify-center py-8 px-4 mt-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Statistikk</h2>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        Klikk på knappen under for å laste ned Excel-filen med påmeldingsstatistikk.
      </p>
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`
          flex items-center justify-center
          min-w-[200px]
          bg-blue-600 text-white font-semibold 
          py-3 px-6 rounded-lg shadow-md 
          hover:bg-blue-700 
          active:transform active:scale-95
          disabled:bg-gray-400 disabled:cursor-not-allowed
          transition-all duration-200 ease-in-out
        `}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Laster ned...
          </>
        ) : (
          'Last ned Excel'
        )}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 text-sm">
            Feil: {error.message}
          </p>
        </div>
      )}
    </section>
  );
};

export default DownloadExcel;
