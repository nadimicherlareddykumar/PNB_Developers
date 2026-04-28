import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { Agent } from '../models/index.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000
});

router.post(
  '/signup',
  [
    body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('phone').optional({ values: 'falsy' }).trim().isLength({ max: 20 }).withMessage('Phone is too long')
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;

    const existing = await Agent.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const agent = new Agent({
      name,
      email,
      password_hash: hashedPassword,
      phone: phone || null
    });
    
    await agent.save();

    const token = jwt.sign({ id: agent.id, email: agent.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('auth_token', token, getCookieOptions());
    res.status(201).json({ 
      agent: {
        id: agent.id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone
      } 
    });
  })
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isString().notEmpty().withMessage('Password is required')
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const agent = await Agent.findOne({ email });
    if (!agent) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, agent.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: agent.id, email: agent.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.cookie('auth_token', token, getCookieOptions());
    res.json({ 
      agent: {
        id: agent.id,
        name: agent.name,
        email: agent.email,
        phone: agent.phone
      } 
    });
  })
);

router.post('/logout', (req, res) => {
  res.clearCookie('auth_token', getCookieOptions());
  res.json({ message: 'Logged out' });
});

router.get('/me', authMiddleware, (req, res) => {
  res.json({ agent: req.agent });
});

export default router;
