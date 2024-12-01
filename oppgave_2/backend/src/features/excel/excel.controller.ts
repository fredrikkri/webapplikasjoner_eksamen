import { registrationService } from "./excel.service";
import ExcelJS from "exceljs";
import { Hono } from "hono";

// SRC: kilde: chatgpt.com /
export const createExcelController = () => {
  const app = new Hono();

  app.get("/download-excel", async (c) => {
    const result = await registrationService.getRegistrationsByYear();

    if (result.success) {
      const groupedByYear = result.data;

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Registrations");

      worksheet.columns = [
        { header: "Year", key: "year", width: 10 },
        { header: "Event Title", key: "event_title", width: 25 },
        { header: "Location", key: "location", width: 20 },
        { header: "Email", key: "email", width: 30 },
        { header: "Has Paid", key: "has_paid", width: 10 },
        { header: "Registration Date", key: "registration_date", width: 20 },
      ];

      Object.entries(groupedByYear).forEach(([year, registrations]) => {
        (registrations as any[]).forEach((reg) => {
          worksheet.addRow({
            year: parseInt(year, 10),
            event_title: reg.event_title,
            location: reg.event_location,
            email: reg.email,
            has_paid: reg.has_paid,
            registration_date: reg.registration_date,
          });
        });
      });

      const buffer = await workbook.xlsx.writeBuffer();
      c.header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      c.header("Content-Disposition", `attachment; filename="registrations_by_year.xlsx"`);
      
      return c.body(buffer);
    } else {
      return c.json({ message: result.error?.message }, 500);
    }
  });

  return app;
};

export const excelController = createExcelController();
