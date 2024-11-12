import { DB } from "./db";
import { promises } from "fs";
import { join } from "path";

// SRC: kilde: chatgpt.com  /
export const seed = async (db: DB) => {
  const path = join(".", "src", "features", "data", "data.json");
  const file = await promises.readFile(path, "utf-8");
  const { events, events_active, events_template, registrations, days } = JSON.parse(file);

  // Prepare the insert statements
  const insertEvent = db.prepare(`
    INSERT INTO events (id, title, description, slug, date, location, event_type, total_slots, available_slots, price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertEventActive = db.prepare(`
    INSERT INTO events_active (event_id)
    VALUES (?)
  `);

  const insertEventTemplate = db.prepare(`
    INSERT INTO events_template (event_id)
    VALUES (?)
  `);

  const insertRegistration = db.prepare(`
    INSERT INTO registrations (event_id, email, has_paid, registration_date)
    VALUES (?, ?, ?, ?)
  `);

  const insertDay = db.prepare(`
    INSERT INTO days (day)
    VALUES (?)
  `);

  db.transaction(() => {
    // Insert events
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
      insertEventTemplate.run(template.event_id);
    }

    for (const registration of registrations) {
      insertRegistration.run(
        registration.event_id,
        registration.email,
        registration.has_paid,
        registration.registration_date
      );
    }

    for (const day of days) {
      insertDay.run(day.day);
    }
  })();
};
