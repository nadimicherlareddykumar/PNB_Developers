import express from 'express';
import db from '../db/database.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

const sendSMS = async (to, message) => {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const twilio = await import('twilio');
      const client = twilio.default(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
      await client.messages.create({
        body: message,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to
      });
      console.log('SMS sent to:', to);
    } catch (error) {
      console.error('Twilio SMS error:', error.message);
    }
  } else {
    console.log('SMS (mock):', message);
  }
};

router.post('/', (req, res) => {
  try {
    const { layout_id, plot_id, customer_name, customer_phone, visit_date } = req.body;

    if (!layout_id || !plot_id || !customer_name || !customer_phone || !visit_date) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const plot = db.prepare('SELECT * FROM plots WHERE id = ?').get(plot_id);
    if (!plot || plot.status !== 'available') {
      return res.status(400).json({ error: 'Plot not available' });
    }

    const result = db.prepare(`
      INSERT INTO bookings (layout_id, plot_id, customer_name, customer_phone, visit_date)
      VALUES (?, ?, ?, ?, ?)
    `).run(layout_id, plot_id, customer_name, customer_phone, visit_date);

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

      const message = `Hi ${booking.customer_name}, your site visit for Plot ${booking.plot_number} at ${booking.layout_name}, ${booking.location} on ${booking.visit_date} is confirmed. – PND Developers. Call us: +91XXXXXXXXXX`;
      await sendSMS(booking.customer_phone, message);
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
