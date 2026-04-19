import express from 'express';
import { body, param, query as queryValidator } from 'express-validator';
import pool, { query } from '../db/database.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { sendApprovalEmail } from '../utils/email.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getPagination } from '../utils/pagination.js';

const router = express.Router();

router.post(
  '/',
  [
    body('layout_id').isInt({ min: 1 }),
    body('plot_id').isInt({ min: 1 }),
    body('customer_name').trim().isLength({ min: 2, max: 120 }),
    body('customer_email').isEmail().normalizeEmail(),
    body('customer_phone').trim().isLength({ min: 7, max: 20 }),
    body('visit_date').isISO8601().toDate()
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { layout_id, plot_id, customer_name, customer_email, customer_phone, visit_date } = req.body;

    const plotResult = await query('SELECT id, status, layout_id FROM plots WHERE id = $1', [plot_id]);
    const plot = plotResult.rows[0];
    if (!plot || plot.status !== 'available' || Number(plot.layout_id) !== Number(layout_id)) {
      return res.status(400).json({ error: 'Plot not available' });
    }

    const result = await query(
      'INSERT INTO bookings (layout_id, plot_id, customer_name, customer_email, customer_phone, visit_date) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [layout_id, plot_id, customer_name, customer_email, customer_phone, visit_date]
    );

    res.status(201).json(result.rows[0]);
  })
);

router.get(
  '/',
  authMiddleware,
  [
    queryValidator('status').optional().isIn(['pending', 'approved', 'rejected']),
    queryValidator('page').optional().isInt({ min: 1 }),
    queryValidator('limit').optional().isInt({ min: 1, max: 100 })
  ],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { status } = req.query;
    const { page, limit, offset } = getPagination(req.query);

    let sql = `
      SELECT
        b.*,
        p.plot_number,
        l.name as layout_name,
        l.location as layout_location,
        COUNT(*) OVER()::int AS total_count
      FROM bookings b
      JOIN plots p ON b.plot_id = p.id
      JOIN layouts l ON b.layout_id = l.id
      WHERE l.agent_id = $1
    `;

    const params = [req.agent.id];
    if (status) {
      params.push(status);
      sql += ` AND b.status = $${params.length}`;
    }

    params.push(limit, offset);
    sql += ` ORDER BY b.created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

    const result = await query(sql, params);
    const total = result.rows[0]?.total_count || 0;
    const items = result.rows.map(({ total_count, ...rest }) => rest);

    res.json({ items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } });
  })
);

router.put(
  '/:id',
  authMiddleware,
  [param('id').isInt({ min: 1 }), body('status').isIn(['approved', 'rejected'])],
  validateRequest,
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    const bookingId = req.params.id;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const bookingResult = await client.query(
        `SELECT b.*, p.plot_number, l.name as layout_name, l.location, l.agent_id
         FROM bookings b
         JOIN plots p ON b.plot_id = p.id
         JOIN layouts l ON b.layout_id = l.id
         WHERE b.id = $1
         FOR UPDATE`,
        [bookingId]
      );

      const booking = bookingResult.rows[0];
      if (!booking || Number(booking.agent_id) !== Number(req.agent.id)) {
        await client.query('ROLLBACK');
        return res.status(404).json({ error: 'Booking not found' });
      }

      await client.query('UPDATE bookings SET status = $1 WHERE id = $2', [status, bookingId]);

      if (status === 'approved') {
        const plotLock = await client.query('SELECT status FROM plots WHERE id = $1 FOR UPDATE', [booking.plot_id]);
        if (!plotLock.rows[0] || plotLock.rows[0].status !== 'available') {
          await client.query('ROLLBACK');
          return res.status(409).json({ error: 'Plot already booked' });
        }
        await client.query('UPDATE plots SET status = $1 WHERE id = $2', ['booked', booking.plot_id]);
      }

      const updatedResult = await client.query(
        `SELECT b.*, p.plot_number, l.name as layout_name, l.location
         FROM bookings b
         JOIN plots p ON b.plot_id = p.id
         JOIN layouts l ON b.layout_id = l.id
         WHERE b.id = $1`,
        [bookingId]
      );

      await client.query('COMMIT');

      if (status === 'approved') {
        await sendApprovalEmail(booking, booking.plot_number, booking.layout_name, booking.location);
      }

      res.json(updatedResult.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  })
);

export default router;
