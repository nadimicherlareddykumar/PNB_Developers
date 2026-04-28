import jwt from 'jsonwebtoken';
import { Agent } from '../models/index.js';

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const token = bearerToken || req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const agent = await Agent.findOne({ id: decoded.id }).select('id name email phone');

    if (!agent) {
      return res.status(401).json({ error: 'Agent not found' });
    }

    req.agent = agent;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
