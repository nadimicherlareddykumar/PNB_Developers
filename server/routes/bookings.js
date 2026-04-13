import express from 'express';
import { query } from '../db/database.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { sendApprovalEmail } from '../utils/email.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { layout_id, plot_id, customer_name, customer_email, customer_phone, visit_date } = req.body;

    if (!layout_id || !plot_id || !customer_name || !customer_email || !customer_phone || !visit_date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const plotResult = await query('SELECT * FROM plots WHERE id = $1', [plot_id]);
    const plot = plotResult.rows[0];
    if (!plot || plot.status !== 'available') {
      return res.status(400).json({ error: 'Plot not available' });
    }

    const result = await query(
      'INSERT INTO bookings (layout_id, plot_id, customer_name, customer_email, customer_phone, visit_date) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id',
      [layout_id, plot_id, customer_name, customer_email, customer_phone, visit_date]
    );

    const bookingResult = await query('SELECT * FROM bookings WHERE id = $1', [result.rows[0].id]);
    res.status(201).json(bookingResult.rows[0]);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { status } = req.query;

    let sql = `
      SELECT 
        b.*,
        p.plot_number,
        l.name as layout_name,
        l.location as layout_location
      FROM bookings b
      JOIN plots p ON b.plot_id = p.id
      JOIN layouts l ON b.layout_id = l.id
    `;

    const params = [];
    if (status) {
      params.push(status);
      sql += ` WHERE b.status = $1`;
    }

    sql += ' ORDER BY b.created_at DESC';

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const bookingId = req.params.id;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const bookingResult = await query(`
      SELECT b.*, p.plot_number, l.name as layout_name, l.location
      FROM bookings b
      JOIN plots p ON b.plot_id = p.id
      JOIN layouts l ON b.layout_id = l.id
      WHERE b.id = $1
    `, [bookingId]);

    const booking = bookingResult.rows[0];

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await query('UPDATE bookings SET status = $1 WHERE id = $2', [status, bookingId]);

    if (status === 'approved') {
      // Mark the plot as booked once the visit request is approved.
      await query('UPDATE plots SET status = $1 WHERE id = $2', ['booked', booking.plot_id]);

      await sendApprovalEmail(booking, booking.plot_number, booking.layout_name, booking.location);
    }

    const updatedResult = await query(`
      SELECT b.*, p.plot_number, l.name as layout_name, l.location
      FROM bookings b
      JOIN plots p ON b.plot_id = p.id
      JOIN layouts l ON b.layout_id = l.id
      WHERE b.id = $1
    `, [bookingId]);

    res.json(updatedResult.rows[0]);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
