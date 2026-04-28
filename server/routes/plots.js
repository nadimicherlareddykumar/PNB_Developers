import express from 'express';
import { body, param } from 'express-validator';
import { Layout, Plot } from '../models/index.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  [
    body('layout_id').isInt({ min: 1 }),
    body('plot_number').trim().isLength({ min: 1, max: 50 }),
    body('size_sqft').optional().isFloat({ min: 0 }),
    body('price').optional().isFloat({ min: 0 }),
    body('facing').optional().isIn(['North', 'South', 'East', 'West']),
    body('status').optional().isIn(['available', 'booked']),
    body('grid_x').isInt({ min: 0 }),
    body('grid_y').isInt({ min: 0 }),
    body('grid_w').optional().isInt({ min: 1 }),
    body('grid_h').optional().isInt({ min: 1 })
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { layout_id, plot_number, size_sqft, price, facing, status, grid_x, grid_y, grid_w, grid_h } = req.body;

    const layout = await Layout.findOne({ id: layout_id, agent_id: req.agent.id });
    if (!layout) {
      return res.status(404).json({ error: 'Layout not found' });
    }

    const existingPlot = await Plot.findOne({ layout_id, plot_number });
    if (existingPlot) {
      return res.status(400).json({ error: 'Plot number already exists in this layout' });
    }

    const plot = new Plot({
      layout_id,
      plot_number,
      size_sqft: size_sqft || null,
      price: price || null,
      facing: facing || 'North',
      status: status || 'available',
      grid_x,
      grid_y,
      grid_w: grid_w || 1,
      grid_h: grid_h || 1
    });

    await plot.save();

    layout.total_plots += 1;
    await layout.save();

    res.status(201).json(plot);
  })
);

router.put(
  '/:id',
  authMiddleware,
  [
    param('id').isInt({ min: 1 }),
    body('plot_number').optional().trim().isLength({ min: 1, max: 50 }),
    body('size_sqft').optional().isFloat({ min: 0 }),
    body('price').optional().isFloat({ min: 0 }),
    body('facing').optional().isIn(['North', 'South', 'East', 'West']),
    body('status').optional().isIn(['available', 'booked']),
    body('grid_x').optional().isInt({ min: 0 }),
    body('grid_y').optional().isInt({ min: 0 }),
    body('grid_w').optional().isInt({ min: 1 }),
    body('grid_h').optional().isInt({ min: 1 })
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const plotId = req.params.id;
    const updateData = req.body;

    const plot = await Plot.findOne({ id: plotId });
    if (!plot) {
      return res.status(404).json({ error: 'Plot not found' });
    }

    const layout = await Layout.findOne({ id: plot.layout_id, agent_id: req.agent.id });
    if (!layout) {
      return res.status(404).json({ error: 'Unauthorized' });
    }

    Object.assign(plot, updateData);
    await plot.save();

    res.json(plot);
  })
);

router.delete(
  '/:id',
  authMiddleware,
  [param('id').isInt({ min: 1 })],
  validateRequest,
  asyncHandler(async (req, res) => {
    const plotId = req.params.id;

    const plot = await Plot.findOne({ id: plotId });
    if (!plot) {
      return res.status(404).json({ error: 'Plot not found' });
    }

    const layout = await Layout.findOne({ id: plot.layout_id, agent_id: req.agent.id });
    if (!layout) {
      return res.status(404).json({ error: 'Unauthorized' });
    }

    await Plot.deleteOne({ id: plotId });

    layout.total_plots = Math.max(0, layout.total_plots - 1);
    await layout.save();

    res.json({ message: 'Plot deleted successfully' });
  })
);

export default router;
