import { registrationService } from "./excel.service";
import ExcelJS from "exceljs";
import { Hono } from "hono";

// SRC: kilde: chatgpt.com /
const formatHeader = (worksheet: ExcelJS.Worksheet) => {
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true };
    cell.alignment = { vertical: "middle", horizontal: "center" };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFFE0B2" },
    };
  });
};

// SRC: kilde: chatgpt.com / med endringer
export const createExcelController = () => {
  const app = new Hono();

  app.get("/download-excel", async (c) => {
    const result = await registrationService.getRegistrationsByYear();

    if (result.success) {
      const groupedByYear = result.data;

      const workbook = new ExcelJS.Workbook();
      const registrationsWorksheet = workbook.addWorksheet("Registrations");

      registrationsWorksheet.columns = [
        { header: "Year", key: "year", width: 10 },
        { header: "Registration Date", key: "registration_date", width: 20 },
        { header: "Booking Id", key: "id", width: 40 },
        { header: "Event Id", key: "event_id", width: 40 },
        { header: "Event Title", key: "event_title", width: 40 },
        { header: "Event Location", key: "location", width: 25 },
        { header: "Email", key: "email", width: 30 },
        { header: "Has Paid", key: "has_paid", width: 10 },
      ];

      Object.entries(groupedByYear).forEach(([year, registrations]) => {
        (registrations as any[]).forEach((reg) => {
          registrationsWorksheet.addRow({
            year: year,
            registration_date: reg.registration_date,
            id: reg.id,
            event_id: reg.event_id,
            event_title: reg.event_title,
            location: reg.event_location,
            email: reg.email,
            has_paid: reg.has_paid,
          });
        });
      });

      formatHeader(registrationsWorksheet);

      registrationsWorksheet.autoFilter = {
        from: "A1",
        to: `A1`,
      };

      const eventsWorksheet = workbook.addWorksheet("Events");

      eventsWorksheet.columns = [
        { header: "Event Title", key: "event_title", width: 40 },
        { header: "Event Location", key: "location", width: 25 },
        { header: "Total Registrations", key: "total_registrations", width: 20 },
        { header: "New Registrations (Last Month)", key: "new_registrations", width: 30 },
      ];

      const eventSummary: { [key: string]: { event_title: string; location: string; total_registrations: number; new_registrations: number } } = {};

      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      Object.values(groupedByYear).forEach((registrations: any[]) => {
        registrations.forEach((reg) => {
          const key = `${reg.event_title} - ${reg.event_location}`;
          if (!eventSummary[key]) {
            eventSummary[key] = {
              event_title: reg.event_title,
              location: reg.event_location,
              total_registrations: 0,
              new_registrations: 0,
            };
          }
          eventSummary[key].total_registrations += 1;

          const registrationDate = new Date(reg.registration_date);
          if (registrationDate > lastMonth) {
            eventSummary[key].new_registrations += 1;
          }
        });
      });

      Object.values(eventSummary).forEach((summary: any) => {
        eventsWorksheet.addRow({
          event_title: summary.event_title,
          location: summary.location,
          total_registrations: summary.total_registrations,
          new_registrations: summary.new_registrations,
        });
      });

      formatHeader(eventsWorksheet);

      const buffer = await workbook.xlsx.writeBuffer();
      c.header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      c.header("Content-Disposition", `attachment; filename="registrations_with_summary.xlsx"`);

      return c.body(buffer);
    } else {
      return c.json({ message: result.error?.message }, 500);
    }
  });

  return app;
};

export const excelController = createExcelController();
