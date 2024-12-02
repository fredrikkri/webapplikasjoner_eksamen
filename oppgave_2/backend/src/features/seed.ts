import { DB } from "./db";
import { promises } from "fs";
import { join } from "path";

// SRC: kilde: chatgpt.com || med justeringer /
export const seed = async (db: DB) => {
  const path = join(".", "src", "features", "data", "data.json");
  const file = await promises.readFile(path, "utf-8");
  const { events, events_active, events_template, registrations, days, event_rules } = JSON.parse(file);

  const insertEvent = db.prepare(`
    INSERT INTO events (id, title, description, slug, date, location, event_type, total_slots, available_slots, price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertEventActive = db.prepare(`
    INSERT INTO events_active (event_id)
    VALUES (?)
  `);

  const insertEventTemplate = db.prepare(`
    INSERT INTO events_template (event_id, private)
    VALUES (?, ?)
  `);

  const insertRegistration = db.prepare(`
    INSERT INTO registrations (id, event_id, email, has_paid, registration_date)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertDay = db.prepare(`
    INSERT INTO days (day)
    VALUES (?)
  `);

  const insertEventRule = db.prepare(`
    INSERT INTO event_rules (event_id, is_private, restricted_days, allow_multiple_events_same_day, waitlist)
    VALUES (?, ?, ?, ?, ?)
  `);

  db.transaction(() => {
    for (const event of events) {
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
    }

    for (const activeEvent of events_active) {
      insertEventActive.run(activeEvent.event_id);
    }

    for (const template of events_template) {
      insertEventTemplate.run(
        template.event_id,
        template.private
      );
    }

    for (const registration of registrations) {
      insertRegistration.run(
        registration.id,
        registration.event_id,
        registration.email,
        registration.has_paid,
        registration.registration_date
      );
    }

    for (const rule of event_rules) {
      insertEventRule.run(
        rule.event_id,
        rule.is_private,
        rule.restricted_days,
        rule.allow_multiple_events_same_day,
        rule.waitlist
      );
    }

    for (const day of days) {
      insertDay.run(day.day);
    }
  })();
};
