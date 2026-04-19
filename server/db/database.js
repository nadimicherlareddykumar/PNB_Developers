import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: parseInt(process.env.DB_POOL_MAX || '10', 10),
  idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT_MS || '30000', 10),
  connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT_MS || '10000', 10),
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const query = (sql, params) => pool.query(sql, params);

const initTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS agents (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      phone TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS layouts (
      id SERIAL PRIMARY KEY,
      agent_id INTEGER REFERENCES agents(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      description TEXT,
      cover_image TEXT,
      total_plots INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS plots (
      id SERIAL PRIMARY KEY,
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
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      layout_id INTEGER REFERENCES layouts(id),
      plot_id INTEGER REFERENCES plots(id),
      customer_name TEXT NOT NULL,
      customer_email TEXT DEFAULT '',
      customer_phone TEXT NOT NULL,
      visit_date TEXT NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected')),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_layouts_agent_id ON layouts(agent_id);
    CREATE INDEX IF NOT EXISTS idx_plots_layout_id ON plots(layout_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_layout_id ON bookings(layout_id);
    CREATE INDEX IF NOT EXISTS idx_bookings_plot_id ON bookings(plot_id);
  `);
};

const ready = pool.connect()
  .then(async (client) => {
    client.release();
    await initTables();
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Database initialization failed:', error.message);
    process.exit(1);
  });

export { query };
export { ready };
export default pool;
