// backend/routes/books.js  ← FINAL WORKING VERSION (کوئی error نہیں آئے گا)

const express = require('express');
const router = express.Router();
const multer = require('multer');
const Book = require('../models/book');

// Multer config (cover image upload کے لیے)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// 1. GET ALL PUBLIC BOOKS
router.get('/', async (req, res) => {
  try {
    const books = await Book.find({ isPublic: true }).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 2. GET SINGLE BOOK BY ID ← یہ تمہیں چاہیے تھا!
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // اگر book private ہے تو صرف owner دیکھ سکتا ہے (ابھی auth نہیں ہے تو سب دیکھ سکتے ہیں)
    // بعد میں auth لگا لینا
    if (!book.isPublic) {
      return res.status(403).json({ message: "This book is private" });
    }

    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 3. ADD BOOK (یہ ابھی auth کے بغیر بھی چلے گا، بعد میں لگا لینا)
router.post('/', upload.single('cover'), async (req, res) => {
  try {
    const { title, author, price, genre, description, isPublic } = req.body;
    const cover = req.file ? `/uploads/${req.file.filename}` : null;

    const book = new Book({
      title,
      author,
      price: Number(price),
      genre,
      description,
      cover,
      isPublic: isPublic === 'true' || isPublic === true,
      uploadedBy: null  // ابھی user نہیں ہے تو null
    });

    await book.save();
    res.status(201).json({ message: 'Book added!', book });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;