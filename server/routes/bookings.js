import express from 'express';
import db from '../db/database.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { sendApprovalEmail } from '../utils/email.js';

const router = express.Router();

router.post('/', (req, res) => {
  try {
    const { layout_id, plot_id, customer_name, customer_email, customer_phone, visit_date } = req.body;

    if (!layout_id || !plot_id || !customer_name || !customer_email || !customer_phone || !visit_date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const plot = db.prepare('SELECT * FROM plots WHERE id = ?').get(plot_id);
    if (!plot || plot.status !== 'available') {
      return res.status(400).json({ error: 'Plot not available' });
    }

    const result = db.prepare(`
      INSERT INTO bookings (layout_id, plot_id, customer_name, customer_email, customer_phone, visit_date)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(layout_id, plot_id, customer_name, customer_email, customer_phone, visit_date);

    const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(booking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', authMiddleware, (req, res) => {
  try {
    const { status } = req.query;
    
    let query = `
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
      query += ' WHERE b.status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY b.created_at DESC';
    
    const bookings = db.prepare(query).all(...params);
    
    res.json(bookings);
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

    const booking = db.prepare(`
      SELECT b.*, p.plot_number, l.name as layout_name, l.location
      FROM bookings b
      JOIN plots p ON b.plot_id = p.id
      JOIN layouts l ON b.layout_id = l.id
      WHERE b.id = ?
    `).get(bookingId);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    db.prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, bookingId);

    if (status === 'approved') {
      // Mark the plot as booked once the visit request is approved.
      db.prepare('UPDATE plots SET status = ? WHERE id = ?').run('booked', booking.plot_id);

      await sendApprovalEmail(booking, booking.plot_number, booking.layout_name, booking.location);
    }

    const updatedBooking = db.prepare(`
      SELECT b.*, p.plot_number, l.name as layout_name, l.location
      FROM bookings b
      JOIN plots p ON b.plot_id = p.id
      JOIN layouts l ON b.layout_id = l.id
      WHERE b.id = ?
    `).get(bookingId);

    res.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
