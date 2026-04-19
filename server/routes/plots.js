import express from 'express';
import { body, param } from 'express-validator';
import pool, { query } from '../db/database.js';
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

    const layoutResult = await query('SELECT id FROM layouts WHERE id = $1 AND agent_id = $2', [layout_id, req.agent.id]);
    if (!layoutResult.rows[0]) {
      return res.status(404).json({ error: 'Layout not found' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const existingPlotResult = await client.query(
        'SELECT id FROM plots WHERE layout_id = $1 AND plot_number = $2',
        [layout_id, plot_number]
      );
      if (existingPlotResult.rows[0]) {
        await client.query('ROLLBACK');
        return res.status(400).json({ error: 'Plot number already exists in this layout' });
      }

      const result = await client.query(
        'INSERT INTO plots (layout_id, plot_number, size_sqft, price, facing, status, grid_x, grid_y, grid_w, grid_h) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id',
        [layout_id, plot_number, size_sqft || null, price || null, facing || 'North', status || 'available', grid_x, grid_y, grid_w || 1, grid_h || 1]
      );

      await client.query('UPDATE layouts SET total_plots = total_plots + 1 WHERE id = $1 AND agent_id = $2', [layout_id, req.agent.id]);
      await client.query('COMMIT');

      const plotResult = await query('SELECT * FROM plots WHERE id = $1', [result.rows[0].id]);
      res.status(201).json(plotResult.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
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
    const { plot_number, size_sqft, price, facing, status, grid_x, grid_y, grid_w, grid_h } = req.body;
    const plotId = req.params.id;

    const existingResult = await query(
      `SELECT p.*
       FROM plots p
       JOIN layouts l ON l.id = p.layout_id
       WHERE p.id = $1 AND l.agent_id = $2`,
      [plotId, req.agent.id]
    );
    const existing = existingResult.rows[0];

    if (!existing) {
      return res.status(404).json({ error: 'Plot not found' });
    }

    await query(
      'UPDATE plots SET plot_number=$1, size_sqft=$2, price=$3, facing=$4, status=$5, grid_x=$6, grid_y=$7, grid_w=$8, grid_h=$9 WHERE id=$10',
      [
        plot_number || existing.plot_number,
        size_sqft ?? existing.size_sqft,
        price ?? existing.price,
        facing || existing.facing,
        status || existing.status,
        grid_x ?? existing.grid_x,
        grid_y ?? existing.grid_y,
        grid_w ?? existing.grid_w,
        grid_h ?? existing.grid_h,
        plotId
      ]
    );

    const plotResult = await query('SELECT * FROM plots WHERE id = $1', [plotId]);
    res.json(plotResult.rows[0]);
  })
);

router.delete(
  '/:id',
  authMiddleware,
  [param('id').isInt({ min: 1 })],
  validateRequest,
  asyncHandler(async (req, res) => {
    const plotId = req.params.id;

    const existingResult = await query(
      `SELECT p.id, p.layout_id
       FROM plots p
       JOIN layouts l ON l.id = p.layout_id
       WHERE p.id = $1 AND l.agent_id = $2`,
      [plotId, req.agent.id]
    );
    const existing = existingResult.rows[0];

    if (!existing) {
      return res.status(404).json({ error: 'Plot not found' });
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM plots WHERE id = $1', [plotId]);
      await client.query('UPDATE layouts SET total_plots = GREATEST(total_plots - 1, 0) WHERE id = $1 AND agent_id = $2', [existing.layout_id, req.agent.id]);
      await client.query('COMMIT');
      res.json({ message: 'Plot deleted successfully' });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  })
);

export default router;
