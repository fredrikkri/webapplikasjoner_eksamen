"use client";

import React from "react";

  // SRC: kilde: chatgpt.com  || med endringer /
const DownloadExcel = () => {
    const handleDownload = async () => {
        try {
            const response = await fetch('/api/v1/download-excel');
            if (!response.ok) {
                throw new Error('Failed to download file');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'registrations.xlsx';
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading the Excel file:", error);
        }
    };

    return (
        <section className="flex flex-col items-center justify-center py-8 px-4 mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Statistics</h2>
            <p className="text-gray-600 text-center mb-6">
                Click the button below to download the Excel file with registration statistics.
            </p>
            <button
                onClick={handleDownload}
                className="bg-gray-500 text-white font-semibold py-2 px-6 rounded-md shadow-md hover:bg-gray-600 transition duration-200"
            >
                Download Excel
            </button>
        </section>
    );
};

export default DownloadExcel;
