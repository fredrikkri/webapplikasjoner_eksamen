import { db, type DB } from "../../features/db";
import {type EventCreate, type Event} from "../../types/event";
import type { Result } from "../../types/index";
import { fromDb, toDb } from "./event.mapper";
import type { Query } from "../../lib/query";

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

    const create = async (data: Event & { rules: any }): Promise<Result<string>> => {
        try {
          const { rules, ...eventData } = data;
          const event = toDb({ ...eventData, rules });

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

    return {list, getById, create};
};

export const eventRepository = createEventRepository(db);

export type EventRepository = ReturnType<typeof createEventRepository>;
