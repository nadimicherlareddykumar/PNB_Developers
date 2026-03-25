import express from 'express';
import db from '../db/database.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const layouts = db.prepare(`
      SELECT 
        l.*,
        (SELECT COUNT(*) FROM plots WHERE layout_id = l.id AND status = 'available') as available_count,
        (SELECT COUNT(*) FROM plots WHERE layout_id = l.id AND status = 'booked') as booked_count
      FROM layouts l
      ORDER BY l.created_at DESC
    `).all();

    res.json(layouts);
  } catch (error) {
    console.error('Error fetching layouts:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', (req, res) => {
  try {
    const layout = db.prepare('SELECT * FROM layouts WHERE id = ?').get(req.params.id);

    if (!layout) {
      return res.status(404).json({ error: 'Layout not found' });
    }

    const plots = db.prepare('SELECT * FROM plots WHERE layout_id = ? ORDER BY grid_y, grid_x').all(req.params.id);

    res.json({ ...layout, plots });
  } catch (error) {
    console.error('Error fetching layout:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authMiddleware, (req, res) => {
  try {
    const { name, location, description, cover_image } = req.body;

    if (!name || !location) {
      return res.status(400).json({ error: 'Name and location are required' });
    }

    const result = db.prepare(`
      INSERT INTO layouts (agent_id, name, location, description, cover_image)
      VALUES (?, ?, ?, ?, ?)
    `).run(req.agent.id, name, location, description || '', cover_image || '');

    console.log('Layout created successfully with ID:', result.lastInsertRowid);
    const layout = db.prepare('SELECT * FROM layouts WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(layout);
  } catch (error) {
    console.error('SERVER: Error creating layout:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

router.put('/:id', authMiddleware, (req, res) => {
  try {
    const { name, location, description, cover_image } = req.body;
    const layoutId = req.params.id;

    const existing = db.prepare('SELECT * FROM layouts WHERE id = ? AND agent_id = ?').get(layoutId, req.agent.id);

    if (!existing) {
      return res.status(404).json({ error: 'Layout not found' });
    }

    db.prepare(`
      UPDATE layouts 
      SET name = ?, location = ?, description = ?, cover_image = ?
      WHERE id = ?
    `).run(name || existing.name, location || existing.location, description ?? existing.description, cover_image ?? existing.cover_image, layoutId);

    const layout = db.prepare('SELECT * FROM layouts WHERE id = ?').get(layoutId);

    res.json(layout);
  } catch (error) {
    console.error('Error updating layout:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, (req, res) => {
  try {
    const layoutId = req.params.id;

    const existing = db.prepare('SELECT * FROM layouts WHERE id = ? AND agent_id = ?').get(layoutId, req.agent.id);

    if (!existing) {
      return res.status(404).json({ error: 'Layout not found' });
    }

    db.prepare('DELETE FROM layouts WHERE id = ?').run(layoutId);

    res.json({ message: 'Layout deleted successfully' });
  } catch (error) {
    console.error('Error deleting layout:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
