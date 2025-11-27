const express = require('express');
const router = express.Router();

// Temporary routes - server start karne ke liye
router.get('/', (req, res) => {
  res.json({ message: 'Get all books route' });
});

router.get('/:id', (req, res) => {
  res.json({ message: 'Get single book route', id: req.params.id });
});

router.post('/', (req, res) => {
  res.json({ message: 'Add book route' });
});

router.post('/borrow/:id', (req, res) => {
  res.json({ message: 'Borrow book route', id: req.params.id });
});

router.post('/return/:id', (req, res) => {
  res.json({ message: 'Return book route', id: req.params.id });
});

module.exports = router;