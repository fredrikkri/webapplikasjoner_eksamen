import { DB } from "./db";
export const createTables = (db: DB) => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL,
        description TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        totalattenders INTEGER NOT NULL,
        hostuid TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS attenders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        UID TEXT NOT NULL,
        event_id TEXT NOT NULL,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS rules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_id TEXT NOT NULL,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE        
    );

    CREATE TABLE IF NOT EXISTS eventdays (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day TEXT NOT NULL,
        rules_id TEXT NOT NULL,
        FOREIGN KEY (rules_id) REFERENCES rules(id) ON DELETE CASCADE     
    );

    CREATE TABLE IF NOT EXISTS days (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        day TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
    );

  `);
};