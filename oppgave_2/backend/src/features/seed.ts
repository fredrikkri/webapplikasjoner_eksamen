import { DB } from "./db";
import { promises } from "fs";
import { join } from "path";

// SRC: kilde: chatgpt.com  /
export const seed = async (db: DB) => {
  const path = join(".", "src", "features", "data", "data.json");
  const file = await promises.readFile(path, "utf-8");
  const { events, days, users } = JSON.parse(file);

  const insertEvent = db.prepare(`
    INSERT INTO events (id, title, description, slug, date, location, type, total_slots, price, available_slots, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertDay = db.prepare(`
    INSERT INTO days (day)
    VALUES (?)
  `);

  const insertUser = db.prepare(`
    INSERT INTO users (name, email)
    VALUES (?, ?)
  `);

  db.transaction(() => {
    for (const user of users) {
      insertUser.run(user.name, user.email);
    }

    for (const event of events) {
      insertEvent.run(
        event.id,
        event.title,
        event.description,
        event.slug,
        event.date,
        event.location,
        event.type,
        event.total_slots,
        event.price,
        event.available_slots,
        event.created_by
      );
    }

    for (const day of days) {
      insertDay.run(day.day);
    }
  })();
};
