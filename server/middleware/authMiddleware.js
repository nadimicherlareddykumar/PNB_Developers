import jwt from 'jsonwebtoken';
import db from '../db/database.js';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const agent = db.prepare('SELECT id, name, email, phone FROM agents WHERE id = ?').get(decoded.id);
    
    if (!agent) {
      return res.status(401).json({ error: 'Agent not found' });
    }

    req.agent = agent;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
