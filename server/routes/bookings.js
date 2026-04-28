import express from 'express';
import { body, param, query as queryValidator } from 'express-validator';
import { Layout, Plot, Booking } from '../models/index.js';
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

    const plot = await Plot.findOne({ id: plot_id, layout_id });
    if (!plot || plot.status !== 'available') {
      return res.status(400).json({ error: 'Plot not available' });
    }

    const booking = new Booking({
      layout_id,
      plot_id,
      customer_name,
      customer_email,
      customer_phone,
      visit_date
    });

    await booking.save();
    res.status(201).json(booking);
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

    const filter = {};
    if (status) filter.status = status;

    // We need to filter by agent_id. Since we don't have a direct link in Booking, 
    // we first find all layouts belonging to this agent.
    const layouts = await Layout.find({ agent_id: req.agent.id }).select('id');
    const layoutIds = layouts.map(l => l.id);
    filter.layout_id = { $in: layoutIds };

    const total = await Booking.countDocuments(filter);
    const bookings = await Booking.find(filter)
      .sort({ created_at: -1 })
      .skip(offset)
      .limit(limit);

    // Populate extra fields manually to match expected SQL join output
    const items = await Promise.all(bookings.map(async (b) => {
      const plot = await Plot.findOne({ id: b.plot_id });
      const layout = await Layout.findOne({ id: b.layout_id });
      return {
        ...b.toObject(),
        plot_number: plot?.plot_number,
        layout_name: layout?.name,
        layout_location: layout?.location
      };
    }));

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

    const booking = await Booking.findOne({ id: bookingId });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const layout = await Layout.findOne({ id: booking.layout_id, agent_id: req.agent.id });
    if (!layout) {
      return res.status(404).json({ error: 'Unauthorized' });
    }

    booking.status = status;
    await booking.save();

    const plot = await Plot.findOne({ id: booking.plot_id });
    if (status === 'approved' && plot) {
      if (plot.status !== 'available') {
        return res.status(409).json({ error: 'Plot already booked' });
      }
      plot.status = 'booked';
      await plot.save();
      
      // Send email
      await sendApprovalEmail(booking, plot.plot_number, layout.name, layout.location);
    }

    res.json({
      ...booking.toObject(),
      plot_number: plot?.plot_number,
      layout_name: layout.name,
      layout_location: layout.location
    });
  })
);

export default router;
