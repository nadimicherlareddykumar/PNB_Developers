import express from 'express';
import db from '../db/database.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, (req, res) => {
  try {
    const { layout_id, plot_number, size_sqft, price, facing, status, grid_x, grid_y, grid_w, grid_h } = req.body;

    if (!layout_id || !plot_number || grid_x === undefined || grid_y === undefined) {
      return res.status(400).json({ error: 'Layout ID, plot number, grid position are required' });
    }

    const layout = db.prepare('SELECT * FROM layouts WHERE id = ?').get(layout_id);
    if (!layout) {
      return res.status(404).json({ error: 'Layout not found' });
    }

    const existingPlot = db.prepare('SELECT * FROM plots WHERE layout_id = ? AND plot_number = ?').get(layout_id, plot_number);
    if (existingPlot) {
      return res.status(400).json({ error: 'Plot number already exists in this layout' });
    }

    const result = db.prepare(`
      INSERT INTO plots (layout_id, plot_number, size_sqft, price, facing, status, grid_x, grid_y, grid_w, grid_h)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      layout_id,
      plot_number,
      size_sqft || null,
      price || null,
      facing || 'North',
      status || 'available',
      grid_x,
      grid_y,
      grid_w || 1,
      grid_h || 1
    );

    db.prepare('UPDATE layouts SET total_plots = total_plots + 1 WHERE id = ?').run(layout_id);

    const plot = db.prepare('SELECT * FROM plots WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(plot);
  } catch (error) {
    console.error('Error creating plot:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { plot_number, size_sqft, price, facing, status, grid_x, grid_y, grid_w, grid_h } = req.body;
    const plotId = req.params.id;

    const existing = db.prepare('SELECT * FROM plots WHERE id = ?').get(plotId);

    if (!existing) {
      return res.status(404).json({ error: 'Plot not found' });
    }

    db.prepare(`
      UPDATE plots 
      SET plot_number = ?, size_sqft = ?, price = ?, facing = ?, status = ?, grid_x = ?, grid_y = ?, grid_w = ?, grid_h = ?
      WHERE id = ?
    `).run(
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
    );

    const plot = db.prepare('SELECT * FROM plots WHERE id = ?').get(plotId);

    res.json(plot);
  } catch (error) {
    console.error('Error updating plot:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const plotId = req.params.id;

    const existing = db.prepare('SELECT * FROM plots WHERE id = ?').get(plotId);

    if (!existing) {
      return res.status(404).json({ error: 'Plot not found' });
    }

    db.prepare('DELETE FROM plots WHERE id = ?').run(plotId);
    db.prepare('UPDATE layouts SET total_plots = total_plots - 1 WHERE id = ?').run(existing.layout_id);

    res.json({ message: 'Plot deleted successfully' });
  } catch (error) {
    console.error('Error deleting plot:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
