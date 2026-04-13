import express from 'express';
import { query } from '../db/database.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { layout_id, plot_number, size_sqft, price, facing, status, grid_x, grid_y, grid_w, grid_h } = req.body;

    if (!layout_id || !plot_number || grid_x === undefined || grid_y === undefined) {
      return res.status(400).json({ error: 'Layout ID, plot number, grid position are required' });
    }

    const layoutResult = await query('SELECT * FROM layouts WHERE id = $1', [layout_id]);
    if (!layoutResult.rows[0]) {
      return res.status(404).json({ error: 'Layout not found' });
    }

    const existingPlotResult = await query(
      'SELECT * FROM plots WHERE layout_id = $1 AND plot_number = $2',
      [layout_id, plot_number]
    );
    if (existingPlotResult.rows[0]) {
      return res.status(400).json({ error: 'Plot number already exists in this layout' });
    }

    const result = await query(
      'INSERT INTO plots (layout_id, plot_number, size_sqft, price, facing, status, grid_x, grid_y, grid_w, grid_h) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id',
      [layout_id, plot_number, size_sqft || null, price || null, facing || 'North', status || 'available', grid_x, grid_y, grid_w || 1, grid_h || 1]
    );

    await query('UPDATE layouts SET total_plots = total_plots + 1 WHERE id = $1', [layout_id]);

    const plotResult = await query('SELECT * FROM plots WHERE id = $1', [result.rows[0].id]);
    res.status(201).json(plotResult.rows[0]);
  } catch (error) {
    console.error('Error creating plot:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { plot_number, size_sqft, price, facing, status, grid_x, grid_y, grid_w, grid_h } = req.body;
    const plotId = req.params.id;

    const existingResult = await query('SELECT * FROM plots WHERE id = $1', [plotId]);
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
  } catch (error) {
    console.error('Error updating plot:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const plotId = req.params.id;

    const existingResult = await query('SELECT * FROM plots WHERE id = $1', [plotId]);
    const existing = existingResult.rows[0];

    if (!existing) {
      return res.status(404).json({ error: 'Plot not found' });
    }

    await query('DELETE FROM plots WHERE id = $1', [plotId]);
    await query('UPDATE layouts SET total_plots = total_plots - 1 WHERE id = $1', [existing.layout_id]);

    res.json({ message: 'Plot deleted successfully' });
  } catch (error) {
    console.error('Error deleting plot:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
