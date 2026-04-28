import { query, ready } from './database.js';
import bcrypt from 'bcryptjs';

const seed = async () => {
  await ready;
  const existingResult = await query('SELECT id FROM agents WHERE email = $1', ['agent@pnddevelopers.com']);
  
  if (existingResult.rows.length > 0) {
    console.log('Demo agent already exists');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash('demo1234', 10);
  
  const agentResult = await query(
    'INSERT INTO agents (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING id',
    ['Demo Agent', 'agent@pnddevelopers.com', hashedPassword, '+919999999999']
  );
  const agentId = agentResult.rows[0].id;

  const layout1Result = await query(
    'INSERT INTO layouts (agent_id, name, location, description, cover_image, total_plots) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
    [agentId, 'Sunrise Valley', 'Electronic City, Bangalore',
     'A premium residential layout with world-class amenities and excellent connectivity to IT hubs.',
     'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 12]
  );
  const layout1Id = layout1Result.rows[0].id;

  const plots1 = [
    ['A-101', 2400, 4800000, 'North', 'available', 0, 0, 1, 1],
    ['A-102', 2400, 4800000, 'North', 'available', 1, 0, 1, 1],
    ['A-103', 3000, 6000000, 'East',  'available', 2, 0, 1, 1],
    ['A-104', 3000, 6000000, 'East',  'booked',    3, 0, 1, 1],
    ['B-101', 2400, 4800000, 'South', 'available', 0, 1, 1, 1],
    ['B-102', 2400, 4800000, 'South', 'available', 1, 1, 1, 1],
    ['B-103', 3000, 6000000, 'West',  'available', 2, 1, 1, 1],
    ['B-104', 3000, 6000000, 'West',  'booked',    3, 1, 1, 1],
    ['C-101', 3600, 7200000, 'North', 'available', 0, 2, 2, 1],
    ['C-102', 2400, 4800000, 'South', 'available', 2, 2, 1, 1],
    ['C-103', 2400, 4800000, 'South', 'available', 3, 2, 1, 1],
    ['D-101', 4000, 8000000, 'East',  'available', 0, 3, 2, 2],
  ];

  for (const p of plots1) {
    await query(
      'INSERT INTO plots (layout_id, plot_number, size_sqft, price, facing, status, grid_x, grid_y, grid_w, grid_h) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
      [layout1Id, ...p]
    );
  }

  const layout2Result = await query(
    'INSERT INTO layouts (agent_id, name, location, description, cover_image, total_plots) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
    [agentId, 'Green Meadows', 'Whitefield, Bangalore',
     'Eco-friendly plots surrounded by nature with premium infrastructure.',
     'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 8]
  );
  const layout2Id = layout2Result.rows[0].id;

  const plots2 = [
    ['P-1', 2000, 3500000, 'North', 'available', 0, 0, 1, 1],
    ['P-2', 2000, 3500000, 'North', 'available', 1, 0, 1, 1],
    ['P-3', 2500, 4500000, 'East',  'available', 2, 0, 1, 1],
    ['P-4', 2500, 4500000, 'East',  'available', 3, 0, 1, 1],
    ['P-5', 2000, 3500000, 'South', 'available', 0, 1, 1, 1],
    ['P-6', 2000, 3500000, 'South', 'booked',    1, 1, 1, 1],
    ['P-7', 3000, 5500000, 'West',  'available', 2, 1, 1, 2],
    ['P-8', 3500, 6500000, 'East',  'available', 3, 1, 1, 2],
  ];

  for (const p of plots2) {
    await query(
      'INSERT INTO plots (layout_id, plot_number, size_sqft, price, facing, status, grid_x, grid_y, grid_w, grid_h) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',
      [layout2Id, ...p]
    );
  }

  console.log('Database seeded successfully!');
  console.log('Demo agent: agent@pnddevelopers.com / demo1234');
  process.exit(0);
};

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
