import express from 'express';
import { body, param, query as queryValidator } from 'express-validator';
import { Layout, Plot } from '../models/index.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getPagination } from '../utils/pagination.js';

const router = express.Router();

router.get(
  '/',
  [
    queryValidator('page').optional().isInt({ min: 1 }),
    queryValidator('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { page, limit, offset } = getPagination(req.query);

    const total = await Layout.countDocuments();
    const layouts = await Layout.find()
      .sort({ created_at: -1 })
      .skip(offset)
      .limit(limit);

    // Calculate stats for each layout manually to match expected frontend format
    const items = await Promise.all(layouts.map(async (l) => {
      const plots = await Plot.find({ layout_id: l.id });
      
      const available_count = plots.filter(p => p.status === 'available').length;
      const booked_count = plots.filter(p => p.status === 'booked').length;
      
      const prices = plots.map(p => p.price).filter(p => p != null);
      const starting_price = prices.length > 0 ? Math.min(...prices) : null;
      
      const sizes = plots.map(p => p.size_sqft).filter(s => s != null);
      const min_size = sizes.length > 0 ? Math.min(...sizes) : null;
      const max_size = sizes.length > 0 ? Math.max(...sizes) : null;

      return {
        ...l.toObject(),
        available_count,
        booked_count,
        starting_price,
        min_size,
        max_size
      };
    }));

    res.json({ items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } });
  })
);

router.get(
  '/:id',
  [
    param('id').isInt({ min: 1 }),
    queryValidator('page').optional().isInt({ min: 1 }),
    queryValidator('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { page, limit, offset } = getPagination(req.query);
    const layout = await Layout.findOne({ id: req.params.id });
    if (!layout) {
      return res.status(404).json({ error: 'Layout not found' });
    }

    const total = await Plot.countDocuments({ layout_id: layout.id });
    const plots = await Plot.find({ layout_id: layout.id })
      .sort({ plot_number: 1 })
      .skip(offset)
      .limit(limit);

    res.json({ 
      ...layout.toObject(), 
      plots,
      plotsPagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 }
    });
  })
);

router.post(
  '/',
  authMiddleware,
  [
    body('name').trim().isLength({ min: 2, max: 100 }),
    body('location').trim().isLength({ min: 2, max: 200 })
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { name, location } = req.body;
    const layout = new Layout({
      agent_id: req.agent.id,
      name,
      location
    });
    await layout.save();
    res.status(201).json(layout);
  })
);

router.put(
  '/:id',
  authMiddleware,
  [
    param('id').isInt({ min: 1 }),
    body('name').optional().trim().isLength({ min: 2, max: 100 }),
    body('location').optional().trim().isLength({ min: 2, max: 200 })
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { name, location } = req.body;
    const layout = await Layout.findOne({ id: req.params.id, agent_id: req.agent.id });

    if (!layout) {
      return res.status(404).json({ error: 'Layout not found' });
    }

    if (name) layout.name = name;
    if (location) layout.location = location;

    await layout.save();
    res.json(layout);
  })
);

router.delete(
  '/:id',
  authMiddleware,
  [param('id').isInt({ min: 1 })],
  validateRequest,
  asyncHandler(async (req, res) => {
    const layout = await Layout.findOneAndDelete({ id: req.params.id, agent_id: req.agent.id });
    if (!layout) {
      return res.status(404).json({ error: 'Layout not found' });
    }
    // Delete associated plots
    await Plot.deleteMany({ layout_id: layout.id });
    res.json({ message: 'Layout and associated plots deleted' });
  })
);

export default router;
