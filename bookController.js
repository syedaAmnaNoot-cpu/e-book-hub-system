// controllers/bookController.js
const Book = require('../models/book');
const path = require('path');

// GET → http://localhost:5000/api/books
const getAllBooks = async (req, res) => {
  try {
    const query = req.user 
      ? { $or: [{ isPublic: true }, { user: req.user.id }] }
      : { isPublic: true };

    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// POST → Add new book
const addBook = async (req, res) => {
  try {
    const { title, author, price, genre, description, isPublic } = req.body;

    if (!req.file) return res.status(400).json({ error: "Cover image is required" });

    const coverPath = `/uploads/${req.file.filename}`;

    const book = await Book.create({
      title,
      author,
      price: Number(price),
      genre,
      description: description || "",
      cover: coverPath,
      isPublic: isPublic === "true" || isPublic === true,
      user: req.user.id
    });

    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to add book" });
  }
};

module.exports = { getAllBooks, addBook };