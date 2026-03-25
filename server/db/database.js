import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', 'pnd.db');

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

const createTables = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS agents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS layouts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      agent_id INTEGER REFERENCES agents(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT,
      cover_image TEXT,
      total_plots INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS plots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      layout_id INTEGER REFERENCES layouts(id) ON DELETE CASCADE,
      plot_number TEXT NOT NULL,
      size_sqft REAL,
      price REAL,
      facing TEXT CHECK(facing IN ('North','South','East','West')),
      status TEXT DEFAULT 'available' CHECK(status IN ('available','booked')),
      grid_x INTEGER NOT NULL,
      grid_y INTEGER NOT NULL,
      grid_w INTEGER DEFAULT 1,
      grid_h INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      layout_id INTEGER REFERENCES layouts(id),
      plot_id INTEGER REFERENCES plots(id),
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      visit_date TEXT NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
};

createTables();

export default db;
