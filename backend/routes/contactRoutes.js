const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/authMiddleware');

// Public: Submit a message
router.post('/submit', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ message: 'Missing fields' });

  try {
    await db.query(
      'INSERT INTO contact_messages (name, email, subject, message, status) VALUES ($1, $2, $3, $4, $5)',
      [name, email, subject, message, 'Pending']
    );
    res.status(201).json({ message: 'Success! Your message is saved.' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Admin Only: Get all messages
router.get('/all', auth, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Unauthorized' });
  
  try {
    const messages = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(messages.rows);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// Admin Only: Mark as resolved
router.put('/resolve/:id', auth, async (req, res) => {
  if (req.user.role !== 'Admin') return res.status(403).json({ message: 'Unauthorized' });
  
  try {
    await db.query('UPDATE contact_messages SET status = $1 WHERE id = $2', ['Resolved', req.params.id]);
    res.json({ message: 'Inquiry marked as resolved.' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
