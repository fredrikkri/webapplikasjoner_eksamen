import { db, type DB } from "../../features/db";
import { type Rules, type RulesCreate } from "../../types/rules";
import type { Result } from "../../types/index";
import { fromDb } from "./rules.mapper";

export const createRulesRepository = (db: DB) => {
    const create = async (eventId: string, rulesData: Omit<Rules, 'event_id'>): Promise<Result<string>> => {
        try {
            const rules = {
                event_id: eventId,
                is_private: rulesData.is_private,
                restricted_days: rulesData.restricted_days,
                allow_multiple_events_same_day: rulesData.allow_multiple_events_same_day,
                waitlist: rulesData.waitlist,
                fixed_price: rulesData.fixed_price,
                fixed_size: rulesData.fixed_size,
                is_free: rulesData.is_free
            };

            const query = db.prepare(`
                INSERT INTO event_rules (
                    event_id, 
                    is_private, 
                    restricted_days, 
                    allow_multiple_events_same_day, 
                    waitlist,
                    fixed_price,
                    fixed_size,
                    is_free
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);

            query.run(
                rules.event_id,
                rules.is_private,
                rules.restricted_days,
                rules.allow_multiple_events_same_day,
                rules.waitlist,
                rules.fixed_price,
                rules.fixed_size,
                rules.is_free
            );

            return {
                success: true,
                data: eventId,
            };
        } catch (error) {
            console.error("Database error:", error);
            return {
                success: false,
                error: {
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Error creating rules",
                },
            };
        }
    };

    const getByEventId = async (eventId: string): Promise<Result<Rules>> => {
        try {
            const query = db.prepare("SELECT * FROM event_rules WHERE event_id = ?");
            const rulesData = query.get(eventId) as Rules;

            if (!rulesData) {
                return {
                    success: false,
                    error: { code: "NOT_FOUND", message: "Rules not found" },
                };
            }

            return {
                success: true,
                data: fromDb(rulesData),
            };
        } catch (error) {
            console.error("Error fetching rules:", error);
            return {
                success: false,
                error: {
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Error fetching rules",
                },
            };
        }
    };

    return { create, getByEventId };
};

export const rulesRepository = createRulesRepository(db);

export type RulesRepository = ReturnType<typeof createRulesRepository>;
