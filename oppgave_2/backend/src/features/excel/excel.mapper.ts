import ExcelJS from "exceljs";
import { ExcelRegistrationEvent } from "../../types/excel";

export const generateExcelFile = async (
  registrations: ExcelRegistrationEvent[],
  totalRegistrationsPerYear: { year: number, count: number }[],
  newRegistrationsLastMonth: number
): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Statistics");

  worksheet.columns = [
    { header: "ID", key: "id", width: 15 },
    { header: "Event ID", key: "event_id", width: 25 },
    { header: "Email", key: "email", width: 30 },
    { header: "Has Paid", key: "has_paid", width: 10 },
    { header: "Registration Date", key: "registration_date", width: 20 },
    { header: "Order ID", key: "order_id", width: 20 },
  ];

  registrations.forEach((reg) => {
    worksheet.addRow({
      id: reg.id,
      event_id: reg.event_id,
      email: reg.email,
      has_paid: reg.has_paid,
      registration_date: reg.registration_date,
      order_id: reg.order_id,
    });
  });

  // Add statistics for total registrations per year
  const summaryWorksheet = workbook.addWorksheet("Summary");
  summaryWorksheet.addRow(["Year", "Total Registrations"]);
  totalRegistrationsPerYear.forEach(({ year, count }) => {
    summaryWorksheet.addRow([year, count]);
  });

  // Add summary for new registrations in the last month
  summaryWorksheet.addRow(["New Registrations Last Month", newRegistrationsLastMonth]);

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};
