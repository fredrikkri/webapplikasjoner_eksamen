'use client';

import React from 'react';
import { useDownloadExcel } from "@/hooks/useDownloadExcel";

const DownloadExcel = () => {
  const { downloadExcel, loading, error } = useDownloadExcel();

  const handleDownload = async () => {
    await downloadExcel();
  };

  return (
    <section className="flex flex-col items-center justify-center py-8 px-4 mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Statistics</h2>
      <p className="text-gray-600 text-center mb-6">
        Click the button below to download the Excel file with registration statistics.
      </p>
      <button
        onClick={handleDownload}
        disabled={loading}
        className="bg-gray-500 text-white font-semibold py-2 px-6 rounded-md shadow-md hover:bg-gray-600 transition duration-200"
      >
        {loading ? 'Downloading...' : 'Download Excel'}
      </button>

      {error && (
        <div className="text-red-600 mt-4">
          <p>Error: {error.message}</p>
        </div>
      )}
    </section>
  );
};

export default DownloadExcel;
