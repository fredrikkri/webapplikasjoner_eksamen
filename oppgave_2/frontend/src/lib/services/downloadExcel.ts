import { ENDPOINTS } from "../../config/config";

export const downloadExcelFile = async (): Promise<void> => {
  const response = await fetch(ENDPOINTS.downloadExcel);

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
};
