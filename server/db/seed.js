import db from './database.js';
import bcrypt from 'bcryptjs';

const seed = async () => {
  const existingAgent = db.prepare('SELECT id FROM agents WHERE email = ?').get('agent@pnddevelopers.com');
  
  if (existingAgent) {
    console.log('Demo agent already exists');
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash('demo1234', 10);
  
  const insertAgent = db.prepare(`
    INSERT INTO agents (name, email, password, phone)
    VALUES (?, ?, ?, ?)
  `);
  
  const result = insertAgent.run('Demo Agent', 'agent@pnddevelopers.com', hashedPassword, '+919999999999');
  const agentId = result.lastInsertRowid;

  const insertLayout = db.prepare(`
    INSERT INTO layouts (agent_id, name, location, description, cover_image, total_plots)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const layout1 = insertLayout.run(
    agentId,
    'Sunrise Valley',
    ' Electronic City, Bangalore',
    'A premium residential layout with world-class amenities and excellent connectivity to IT hubs.',
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    12
  );
  const layout1Id = layout1.lastInsertRowid;

  const insertPlot = db.prepare(`
    INSERT INTO plots (layout_id, plot_number, size_sqft, price, facing, status, grid_x, grid_y, grid_w, grid_h)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const plots = [
    [layout1Id, 'A-101', 2400, 4800000, 'North', 'available', 0, 0, 1, 1],
    [layout1Id, 'A-102', 2400, 4800000, 'North', 'available', 1, 0, 1, 1],
    [layout1Id, 'A-103', 3000, 6000000, 'East', 'available', 2, 0, 1, 1],
    [layout1Id, 'A-104', 3000, 6000000, 'East', 'booked', 3, 0, 1, 1],
    [layout1Id, 'B-101', 2400, 4800000, 'South', 'available', 0, 1, 1, 1],
    [layout1Id, 'B-102', 2400, 4800000, 'South', 'available', 1, 1, 1, 1],
    [layout1Id, 'B-103', 3000, 6000000, 'West', 'available', 2, 1, 1, 1],
    [layout1Id, 'B-104', 3000, 6000000, 'West', 'booked', 3, 1, 1, 1],
    [layout1Id, 'C-101', 3600, 7200000, 'North', 'available', 0, 2, 2, 1],
    [layout1Id, 'C-102', 2400, 4800000, 'South', 'available', 2, 2, 1, 1],
    [layout1Id, 'C-103', 2400, 4800000, 'South', 'available', 3, 2, 1, 1],
    [layout1Id, 'D-101', 4000, 8000000, 'East', 'available', 0, 3, 2, 2],
  ];

  for (const plot of plots) {
    insertPlot.run(...plot);
  }

  const layout2 = insertLayout.run(
    agentId,
    'Green Meadows',
    'Whitefield, Bangalore',
    'Eco-friendly plots surrounded by nature with premium infrastructure.',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
    8
  );
  const layout2Id = layout2.lastInsertRowid;

  const plots2 = [
    [layout2Id, 'P-1', 2000, 3500000, 'North', 'available', 0, 0, 1, 1],
    [layout2Id, 'P-2', 2000, 3500000, 'North', 'available', 1, 0, 1, 1],
    [layout2Id, 'P-3', 2500, 4500000, 'East', 'available', 2, 0, 1, 1],
    [layout2Id, 'P-4', 2500, 4500000, 'East', 'available', 3, 0, 1, 1],
    [layout2Id, 'P-5', 2000, 3500000, 'South', 'available', 0, 1, 1, 1],
    [layout2Id, 'P-6', 2000, 3500000, 'South', 'booked', 1, 1, 1, 1],
    [layout2Id, 'P-7', 3000, 5500000, 'West', 'available', 2, 1, 1, 2],
    [layout2Id, 'P-8', 3500, 6500000, 'East', 'available', 3, 1, 1, 2],
  ];

  for (const plot of plots2) {
    insertPlot.run(...plot);
  }

  console.log('Database seeded successfully!');
  console.log('Demo agent: agent@pnddevelopers.com / demo1234');
};

seed();
