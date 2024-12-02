import { db, type DB } from "../../features/db";
import type { Result } from "../../types/index";
import { type RegistrationWithEventByYear } from "../../types/excel";

// SRC: kilde: chatgpt.com / med endringer
export const createRegistrationRepository = (db: DB) => {
  const formatDate = (date: string): string => {
    return new Date(date).toISOString().split('T')[0];
  };

  // SRC: kilde: chatgpt.com / med endringer
  const getAllRegistrationsWithEvents = async (): Promise<Result<RegistrationWithEventByYear[]>> => {
    try {
      const query = `
        SELECT
          r.id AS registration_id,
          r.event_id,
          e.id AS event_primary_id, -- Alias for e.id for klarhet
          e.title AS event_title,
          e.location AS event_location,
          r.email,
          r.has_paid,
          r.registration_date,
          r.order_id
        FROM registrations r
        JOIN events e ON r.event_id = e.id
        ORDER BY r.registration_date;
      `;
      
      const statement = db.prepare(query);
      const rows = statement.all();
  
      return {
        success: true,
        data: rows.map((row: any) => ({
          id: row.registration_id,
          event_id: row.event_id,
          event_title: row.event_title,
          event_location: row.event_location,
          email: row.email,
          has_paid: row.has_paid,
          registration_date: formatDate(row.registration_date),
          order_id: row.order_id,
          event_primary_id: row.event_primary_id,
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
