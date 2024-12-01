import { useState } from 'react';
import { downloadExcelFile } from '@/lib/services/downloadExcel';

export const useDownloadExcel = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const downloadExcel = async () => {
    try {
      setLoading(true);
      await downloadExcelFile();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while downloading the file'));
      console.error('Error downloading the Excel file:', err);
    } finally {
      setLoading(false);
    }
  };

  return { downloadExcel, loading, error };
};
