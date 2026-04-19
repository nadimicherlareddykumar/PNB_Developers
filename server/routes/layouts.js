import express from 'express';
import { body, param, query as queryValidator } from 'express-validator';
import { query } from '../db/database.js';
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

    const result = await query(
      `SELECT
        l.*,
        (SELECT COUNT(*) FROM plots WHERE layout_id = l.id AND status = 'available') as available_count,
        (SELECT COUNT(*) FROM plots WHERE layout_id = l.id AND status = 'booked') as booked_count,
        (SELECT MIN(price) FROM plots WHERE layout_id = l.id AND price IS NOT NULL) as starting_price,
        (SELECT MIN(size_sqft) FROM plots WHERE layout_id = l.id AND size_sqft IS NOT NULL) as min_size,
        (SELECT MAX(size_sqft) FROM plots WHERE layout_id = l.id AND size_sqft IS NOT NULL) as max_size,
        COUNT(*) OVER()::int AS total_count
      FROM layouts l
      ORDER BY l.created_at DESC
      LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const total = result.rows[0]?.total_count || 0;
    const items = result.rows.map(({ total_count, ...rest }) => rest);

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

    const layoutResult = await query('SELECT * FROM layouts WHERE id = $1', [req.params.id]);
    const layout = layoutResult.rows[0];

    if (!layout) {
      return res.status(404).json({ error: 'Layout not found' });
    }

    const plotsResult = await query(
      `SELECT *, COUNT(*) OVER()::int AS total_count
       FROM plots
       WHERE layout_id = $1
       ORDER BY grid_y, grid_x
       LIMIT $2 OFFSET $3`,
      [req.params.id, limit, offset]
    );

    const total = plotsResult.rows[0]?.total_count || 0;
    const plots = plotsResult.rows.map(({ total_count, ...rest }) => rest);

    res.json({
      ...layout,
      plots,
      plotsPagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 }
    });
  })
);

router.post(
  '/',
  authMiddleware,
  [
    body('name').trim().isLength({ min: 2, max: 120 }),
    body('location').trim().isLength({ min: 2, max: 160 }),
    body('description').optional({ values: 'falsy' }).isString().isLength({ max: 2000 }),
    body('cover_image').optional({ values: 'falsy' }).isURL().withMessage('cover_image must be a valid URL')
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { name, location, description, cover_image } = req.body;

    const result = await query(
      'INSERT INTO layouts (agent_id, name, location, description, cover_image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.agent.id, name, location, description || '', cover_image || '']
    );

    res.status(201).json(result.rows[0]);
  })
);

router.put(
  '/:id',
  authMiddleware,
  [
    param('id').isInt({ min: 1 }),
    body('name').optional().trim().isLength({ min: 2, max: 120 }),
    body('location').optional().trim().isLength({ min: 2, max: 160 }),
    body('description').optional({ values: 'falsy' }).isString().isLength({ max: 2000 }),
    body('cover_image').optional({ values: 'falsy' }).isURL().withMessage('cover_image must be a valid URL')
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { name, location, description, cover_image } = req.body;
    const layoutId = req.params.id;

    const existingResult = await query('SELECT * FROM layouts WHERE id = $1 AND agent_id = $2', [layoutId, req.agent.id]);
    const existing = existingResult.rows[0];

    if (!existing) {
      return res.status(404).json({ error: 'Layout not found' });
    }

    await query(
      'UPDATE layouts SET name = $1, location = $2, description = $3, cover_image = $4 WHERE id = $5',
      [name || existing.name, location || existing.location, description ?? existing.description, cover_image ?? existing.cover_image, layoutId]
    );

    const layoutResult = await query('SELECT * FROM layouts WHERE id = $1', [layoutId]);
    res.json(layoutResult.rows[0]);
  })
);

router.delete(
  '/:id',
  authMiddleware,
  [param('id').isInt({ min: 1 })],
  validateRequest,
  asyncHandler(async (req, res) => {
    const layoutId = req.params.id;

    const existingResult = await query('SELECT * FROM layouts WHERE id = $1 AND agent_id = $2', [layoutId, req.agent.id]);
    const existing = existingResult.rows[0];

    if (!existing) {
      return res.status(404).json({ error: 'Layout not found' });
    }

    await query('DELETE FROM layouts WHERE id = $1', [layoutId]);

    res.json({ message: 'Layout deleted successfully' });
  })
);

export default router;
