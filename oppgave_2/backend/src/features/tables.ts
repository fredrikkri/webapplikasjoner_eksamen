import { DB } from "./db";
export const createTables = (db: DB) => {
  db.exec(`

    CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        slug TEXT NOT NULL,
        date TEXT NOT NULL,
        location TEXT NOT NULL,
        event_type TEXT NOT NULL,
        total_slots INTEGER NOT NULL,
        available_slots INTEGER NOT NULL,
        price INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS events_active (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id TEXT NOT NULL,
        FOREIGN KEY (event_id) REFERENCES events(id)
    );

    CREATE TABLE IF NOT EXISTS events_template (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id TEXT NOT NULL,
        FOREIGN KEY (event_id) REFERENCES events(id)
    );

    CREATE TABLE IF NOT EXISTS registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id TEXT NOT NULL,
        email TEXT NOT NULL,
        has_paid TEXT NOT NULL,
        registration_date TEXT NOT NULL,
        FOREIGN KEY (event_id) REFERENCES events(id)
    );

    CREATE TABLE IF NOT EXISTS days (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day TEXT NOT NULL
    );

  `);
};