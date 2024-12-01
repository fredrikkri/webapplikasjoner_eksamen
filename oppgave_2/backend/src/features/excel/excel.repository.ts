import { db, type DB } from "../../features/db";
import type { Result } from "../../types/index";
import { type RegistrationWithEventByYear } from "../../types/excel";

// SRC: kilde: chatgpt.com / med endringer
export const createRegistrationRepository = (db: DB) => {
  const formatDate = (date: string): string => {
    return new Date(date).toISOString().split('T')[0];
  };

  const getAllRegistrationsWithEvents = async (): Promise<Result<RegistrationWithEventByYear[]>> => {
    try {
      const query = `
        SELECT
          r.id,
          r.event_id,
          e.title AS event_title,
          e.location AS event_location,
          r.email,
          r.has_paid,
          r.registration_date
        FROM registrations r
        JOIN events e ON r.event_id = e.id
        ORDER BY r.registration_date;
      `;
      
      const statement = db.prepare(query);
      const rows = statement.all();

      
      return {
        success: true,
        data: rows.map((row: any) => ({
          event_title: row.event_title,
          event_location: row.event_location,
          email: row.email,
          has_paid: row.has_paid,
          registration_date: formatDate(row.registration_date),
        })),
      };
    } catch (error) {
      console.error("Error fetching registrations with events:", error);
      return {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Error fetching registrations with events",
        },
      };
    }
  };

  return { getAllRegistrationsWithEvents };
};

export const registrationRepository = createRegistrationRepository(db);
