import { DB } from "./db";
import { promises } from "fs";
import { join } from "path";

export const seed = async (db: DB) => {
  const path = join(".", "src", "features", "data", "data.json");
  const file = await promises.readFile(path, "utf-8");
  const { events, attenders, rules, eventdays, days, users } = JSON.parse(file);

  // SRC: kilde: chatgpt.com /
  const insertEvent = db.prepare(`
    INSERT INTO events (id, title, slug, description, date, time, totalattenders, hostuid)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertAttender = db.prepare(`
    INSERT INTO attenders (UID, event_id)
    VALUES (?, ?)
  `);

  const insertRule = db.prepare(`
    INSERT INTO rules (event_id)
    VALUES (?)
  `);

  const insertEventDay = db.prepare(`
    INSERT INTO eventdays (day, rules_id)
    VALUES (?, ?)
  `);

  const insertDay = db.prepare(`
    INSERT INTO days (day)
    VALUES (?)
  `);

  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email)
    VALUES (?, ?, ?)
  `);

  db.transaction(() => {
    for (const user of users) {
      insertUser.run(user.id, user.name, user.email);
    }

    for (const event of events) {
      insertEvent.run(
        event.id,
        event.title,
        event.slug,
        event.description,
        event.date,
        event.time,
        event.totalattenders,
        event.hostuid
      );
    }

    for (const rule of rules) {
      insertRule.run(rule.event_id);
    }

    for (const eventday of eventdays) {
      insertEventDay.run(eventday.day, eventday.rules_id);
    }

    for (const day of days) {
      insertDay.run(day);
    }

    for (const attender of attenders) {
      insertAttender.run(attender.UID, attender.event_id);
    }
  })();
};
