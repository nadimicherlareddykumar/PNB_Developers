import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dns.setServers(['8.8.8.8', '1.1.1.1']);
dotenv.config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Don't exit immediately, let the ready promise handle failure if needed
    throw error;
  }
};

const ready = connectDB();

const query = async (sql, params) => {
  console.error("SQL query called on MongoDB system:", sql);
  throw new Error("This application has been migrated to MongoDB. SQL queries are no longer supported.");
};

const pool = {
  on: (event, callback) => {
    if (event === 'connect') {
      ready.then(callback).catch(() => {});
    }
  }
};

export { query, ready };
export default pool;
