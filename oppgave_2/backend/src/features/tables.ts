import { DB } from "./db";
export const createTables = (db: DB) => {

    db.exec(`PRAGMA foreign_keys = ON;`);
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

    CREATE TABLE IF NOT EXISTS wait_list (
        id TEXT PRIMARY KEY,
        event_id TEXT NOT NULL,
        email TEXT NOT NULL,
        has_paid TEXT NOT NULL,
        registration_date TEXT NOT NULL,
        order_id TEXT,
        FOREIGN KEY (event_id) REFERENCES events(id)
    );

    CREATE TABLE IF NOT EXISTS events_template (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id TEXT NOT NULL,
        private TEXT,
        FOREIGN KEY (event_id) REFERENCES events(id)
    );

    CREATE TABLE IF NOT EXISTS registrations (
        id TEXT PRIMARY KEY,
        event_id TEXT NOT NULL,
        email TEXT NOT NULL,
        has_paid TEXT NOT NULL,
        registration_date TEXT NOT NULL,
        order_id TEXT,
        FOREIGN KEY (event_id) REFERENCES events(id)
    );

    CREATE TABLE IF NOT EXISTS days (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS event_rules (
        event_id INTEGER NOT NULL PRIMARY KEY,
        is_private TEXT,
        restricted_days TEXT,
        allow_multiple_events_same_day TEXT,
        waitlist TEXT,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );


  `);
};
