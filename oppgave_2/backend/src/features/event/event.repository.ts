import { db, type DB } from "../../features/db";
import {type EventCreate, type Event} from "../../types/event";
import type { Result } from "../../types/index";
import { fromDb, toDb } from "./event.mapper";
import type { Query } from "../../lib/query";
import type { Rules } from "../../types/rules";

export const createEventRepository = (db: DB) => {

    const exist = async (slug: string): Promise<boolean> => {
        const query = db.prepare(
          "SELECT COUNT(*) as count FROM events WHERE slug = ?"
        );
        const data = query.get(slug) as { count: number };
        return data.count > 0;
      };

    // SRC: kilde: chatgpt.com  || med justeringer /
    const getById = async (slug: string): Promise<Result<Event>> => {
        try {
          const eventExists = await exist(slug);
          if (!eventExists) {
            return {
              success: false,
              error: { code: "NOT_FOUND", message: "Event not found" },
            };
          }
      
          const query = db.prepare("SELECT * FROM events WHERE slug = ?");
          const eventData = query.get(slug) as Event;  
      
          return {
            success: true,
            data: {
                ...fromDb(eventData),
                available_slots: 0
            },
          };
        } catch (error) {
          console.error("Error fetching event:", error);
          return {
            success: false,
            error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "Error fetching event",
            },
          };
        }
    };

    // SRC: kilde: chatgpt.com  || med endringer /
    const fetchEvents = async (params?: Query): Promise<Event[]> => {
        const { name, pageSize = 10, page = 0 } = params ?? {};
        const offset = (Number(page) - 1) * Number(pageSize);
      
        let query = "SELECT * FROM events";
        query += name ? ` WHERE title LIKE '%${name}%'` : "";
        query += ` LIMIT ${pageSize}`;
        query += ` OFFSET ${offset}`;
      
        const statement = db.prepare(query);
        return statement.all() as Event[];
    };

    // SRC: kilde: chatgpt.com || med endringer/
    const list = async (params?: Query): Promise<Result<Event[]>> => {
        try {
          const events = await fetchEvents(params);
          const { name, pageSize = 10, page = 0 } = params ?? {};
      
          const offset = (Number(page) - 1) * Number(pageSize);
          const hasPagination = Number(page) > 0;
      
          let query = "SELECT * FROM events";
          const conditions: string[] = [];
      
          if (name) {
              conditions.push(`title LIKE '%${name}%'`);
          }
      
          if (conditions.length > 0) {
              query += ` WHERE ${conditions.join(' AND ')}`;
          }
      
          query += ` LIMIT ${pageSize}`;
          query += ` OFFSET ${offset}`;
      
          const { total } = db.prepare("SELECT COUNT(*) as total FROM events").get() as { total: number };
          const totalPages = Math.ceil(total / Number(pageSize));
          const hasNextPage = Number(page) < totalPages;
          const hasPreviousPage = Number(page ?? 1) > 1;
      
          return {
            success: true,
            data: events,
            ...(hasPagination ? { total: pageSize, page, totalPages, hasNextPage, hasPreviousPage } : {}),
          };
        } catch (error) {
          console.error("Error fetching events:", error);
          return {
            success: false,
            error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "Error fetching events",
            },
          };
        }
    };

    const create = async (data: Event & { rules: Omit<Rules, 'event_id'> }): Promise<Result<string>> => {
        try {
          const { rules, ...eventData } = data;
          const event = toDb({ ...eventData, rules });

          console.log("Creating event with data:", event);

          const insertEvent = db.prepare(`
            INSERT INTO events (id, title, description, slug, date, location, event_type, total_slots, available_slots, price)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);
          
          insertEvent.run(
            event.id,
            event.title,
            event.description,
            event.slug,
            event.date,
            event.location,
            event.event_type,
            event.total_slots,
            event.available_slots,
            event.price
          );

          const getEventId = db.prepare("SELECT id FROM events WHERE slug = ?");
          const { id } = getEventId.get(event.slug) as { id: string };

          console.log("Created event with ID:", id);

          return {
            success: true,
            data: id,
          };
        } catch (error) {
          console.error("Database error:", error);
          return {
            success: false,
            error: {
              code: "INTERNAL_SERVER_ERROR",
              message: "Feil med oppretting av event",
            },
          };
        }
    };

    // SRC: kilde: chatgpt.com  || med endringer /
    const remove = async (id: string): Promise<Result<string>> => {
      const db_transaction = db.transaction(() => {
        console.log("final id oiwfoirfeo: ",id)
        try {
          const deleteCourseQuery = db.prepare("DELETE FROM events_active WHERE event_id = ?");
          deleteCourseQuery.run(id);
  
          return id;
        } catch (error) {
          console.error("Error in delete transaction:", error);
          throw error;
        }
      });
  
      try {
        const result = db_transaction();
        return {
          success: true as const,
          data: result,
        };
      } catch (error) {
        if (error instanceof Error && error.message === "Event not found") {
          return {
            success: false as const,
            error: { code: "NOT_FOUND", message: "Event not found" },
          };
        }
        return {
          success: false as const,
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "Error deleting event",
          },
        };
      }
    };

    const edit = async (data: Event): Promise<Result<string>> => {
      try {
        const templateExists = db.prepare("SELECT id FROM events WHERE id = ? LIMIT 1").get(data.id);
      if (!templateExists) {
        console.log("No template found for given ID:", data.id);
        return {
          success: true as const,
          data: "Could not edit template because it's not a template",
        };
      }

      const updateEventQuery = db.prepare(`
          UPDATE events
          SET
            title = ?,
            description = ?,
            slug = ?,
            date = ?,
            location = ?,
            event_type = ?,
            total_slots = ?,
            price = ?
          WHERE id = ?
        `);
    
      const result = updateEventQuery.run(
        data.title,
        data.description,
        data.slug,
        data.date,
        data.location,
        data.event_type,
        data.total_slots,
        data.price,
        data.id
      );

      if (result.changes === 0) {
        return {
          success: false as const,
          error: {
            code: "NOT_FOUND",
            message: "No matching event found to update",
          },
        };
      }
    
      return {
        success: true as const,
        data: `Event with ID ${data.id} updated successfully`,
      };
    } catch (error) {
      console.error("Error updating event:", error);
    
      return {
        success: false as const,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while updating the event",
        },
      };
    }
    };


    // SRC: kilde: chatgpt.com  || med endringer /
    const updateAvailableSlots = async (eventId: string, newAvailableSlots: number): Promise<Result<string>> => {
      try {
        // Fetch the event based on the eventId to check if it exists
        const event = db.prepare("SELECT * FROM events WHERE id = ? LIMIT 1").get(eventId);
    
        if (!event) {
          return {
            success: false as const,
            error: {
              code: "NOT_FOUND",
              message: "No matching event found to update",
            },
          };
        }
    
        const updateEventQuery = db.prepare(`
          UPDATE events
          SET available_slots = ?
          WHERE id = ?
        `);
    
        const result = updateEventQuery.run(newAvailableSlots, eventId);
    
        if (result.changes === 0) {
          return {
            success: false as const,
            error: {
              code: "NOT_FOUND",
              message: "No matching event found to update",
            },
          };
        }
    
        return {
          success: true as const,
          data: `Event with ID ${eventId} updated successfully. Available slots updated to ${newAvailableSlots}`,
        };
      } catch (error) {
        console.error("Error updating available slots:", error);
    
        return {
          success: false as const,
          error: {
            code: "INTERNAL_SERVER_ERROR",
            message: "An error occurred while updating available slots",
          },
        };
      }
    };
    

    return {list, getById, create, remove, updateAvailableSlots, edit};
};

export const eventRepository = createEventRepository(db);

export type EventRepository = ReturnType<typeof createEventRepository>;
