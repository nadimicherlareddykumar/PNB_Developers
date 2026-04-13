import express from 'express';
import { query } from '../db/database.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        l.*,
        (SELECT COUNT(*) FROM plots WHERE layout_id = l.id AND status = 'available') as available_count,
        (SELECT COUNT(*) FROM plots WHERE layout_id = l.id AND status = 'booked') as booked_count,
        (SELECT MIN(price) FROM plots WHERE layout_id = l.id AND price IS NOT NULL) as starting_price,
        (SELECT MIN(size_sqft) FROM plots WHERE layout_id = l.id AND size_sqft IS NOT NULL) as min_size,
        (SELECT MAX(size_sqft) FROM plots WHERE layout_id = l.id AND size_sqft IS NOT NULL) as max_size
      FROM layouts l
      ORDER BY l.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching layouts:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const layoutResult = await query('SELECT * FROM layouts WHERE id = $1', [req.params.id]);
    const layout = layoutResult.rows[0];

    if (!layout) {
      return res.status(404).json({ error: 'Layout not found' });
    }

    const plotsResult = await query(
      'SELECT * FROM plots WHERE layout_id = $1 ORDER BY grid_y, grid_x',
      [req.params.id]
    );

    res.json({ ...layout, plots: plotsResult.rows });
  } catch (error) {
    console.error('Error fetching layout:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, location, description, cover_image } = req.body;

    if (!name || !location) {
      return res.status(400).json({ error: 'Name and location are required' });
    }

    const result = await query(
      'INSERT INTO layouts (agent_id, name, location, description, cover_image) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [req.agent.id, name, location, description || '', cover_image || '']
    );

    const newId = result.rows[0].id;
    console.log('Layout created successfully with ID:', newId);

    const layoutResult = await query('SELECT * FROM layouts WHERE id = $1', [newId]);
    res.status(201).json(layoutResult.rows[0]);
  } catch (error) {
    console.error('SERVER: Error creating layout:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
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
  } catch (error) {
    console.error('Error updating layout:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const layoutId = req.params.id;

    const existingResult = await query('SELECT * FROM layouts WHERE id = $1 AND agent_id = $2', [layoutId, req.agent.id]);
    const existing = existingResult.rows[0];

    if (!existing) {
      return res.status(404).json({ error: 'Layout not found' });
    }

    await query('DELETE FROM layouts WHERE id = $1', [layoutId]);

    res.json({ message: 'Layout deleted successfully' });
  } catch (error) {
    console.error('Error deleting layout:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
