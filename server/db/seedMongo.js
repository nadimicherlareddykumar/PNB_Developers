import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import dns from 'dns';
import { Agent, Layout, Plot } from '../models/index.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await Agent.deleteMany({});
    await Layout.deleteMany({});
    await Plot.deleteMany({});

    // Create Agent
    const hashedPassword = await bcrypt.hash('demo1234', 12);
    const agent = new Agent({
      name: 'PND Admin',
      email: 'agent@pnddevelopers.com',
      password_hash: hashedPassword,
      phone: '9876543210'
    });
    await agent.save();
    console.log('Agent created');

    // Create Layouts
    const layoutNames = [
      { name: 'Sai Sumana Layout', location: 'Electronic City, Bangalore' },
      { name: 'Silver Oaks Residency', location: 'Sarjapur Road, Bangalore' },
      { name: 'Lakeview Enclave', location: 'Hoskote, Bangalore' },
      { name: 'Pinecrest Estates', location: 'Devenahalli, Bangalore' }
    ];

    for (const l of layoutNames) {
      const layout = new Layout({
        agent_id: agent.id,
        name: l.name,
        location: l.location
      });
      await layout.save();

      // Create some plots for each layout
      for (let i = 1; i <= 20; i++) {
        const plot = new Plot({
          layout_id: layout.id,
          plot_number: `A-${100 + i}`,
          size_sqft: 1200 + (Math.floor(Math.random() * 10) * 100),
          price: 2500000 + (Math.floor(Math.random() * 10) * 100000),
          facing: ['North', 'South', 'East', 'West'][Math.floor(Math.random() * 4)],
          grid_x: (i - 1) % 5,
          grid_y: Math.floor((i - 1) / 5)
        });
        await plot.save();
      }
      
      layout.total_plots = 20;
      await layout.save();
      console.log(`Layout ${l.name} created with 20 plots`);
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
