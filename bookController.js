// controllers/bookController.js - WITH ACTIVITY LOGGING

const Book = require('../models/Book');
const mongoose = require('mongoose');

// Get borrower ID (user or guest)
const getBorrowerId = (req) => {
  if (req.user) return req.user._id.toString();
  if (req.headers['x-guest-id']) return req.headers['x-guest-id'];
  return null;
};

// Get all books
exports.getAllBooks = async (req, res) => {
  try {
    console.log('📚 BOOKS ACCESSED by:', {
      user: req.user ? req.user.email : 'Guest',
      guestId: req.headers['x-guest-id'] || 'No guest ID',
      timestamp: new Date().toLocaleString()
    });

    const books = await Book.find({}).sort({ createdAt: -1 });
    
    res.json({
      books: books.map(book => ({
        ...book._doc,
        isAvailable: book.isAvailable ?? true
      }))
    });
  } catch (err) {
    console.error('🚨 GET BOOKS ERROR:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Borrow book - WITH logging
exports.borrowBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      console.log('❌ BORROW FAILED: Book not found -', req.params.id);
      return res.status(404).json({ msg: "Book not found" });
    }

    const borrowerId = getBorrowerId(req);
    
    console.log('🔄 BORROW ATTEMPT:', {
      bookId: req.params.id,
      bookTitle: book.title,
      borrower: req.user ? req.user.email : `Guest (${borrowerId})`,
      timestamp: new Date().toLocaleString()
    });

    if (!book.isAvailable) {
      console.log('❌ BORROW FAILED: Book already borrowed -', book.title);
      return res.status(400).json({ msg: "Book already borrowed!" });
    }

    if (!borrowerId) {
      console.log('❌ BORROW FAILED: No borrower ID');
      return res.status(400).json({ msg: "Unable to identify you" });
    }

    // Borrow the book
    book.isAvailable = false;
    book.borrowedBy = borrowerId;
    book.borrowedAt = new Date();
    book.returnBy = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    await book.save();

    console.log('✅ BOOK BORROWED SUCCESS:', {
      book: book.title,
      borrower: req.user ? req.user.email : `Guest (${borrowerId})`,
      returnBy: book.returnBy,
      timestamp: new Date().toLocaleString()
    });

    res.json({ 
      msg: "Book borrowed successfully!", 
      returnBy: book.returnBy 
    });

  } catch (err) {
    console.error('🚨 BORROW ERROR:', err.message);
    res.status(500).json({ msg: "Server error" });
  }
};

// Return book - WITH logging
exports.returnBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      console.log('❌ RETURN FAILED: Book not found -', req.params.id);
      return res.status(404).json({ msg: "Book not found" });
    }

    const borrowerId = getBorrowerId(req);
    
    console.log('🔄 RETURN ATTEMPT:', {
      bookId: req.params.id,
      bookTitle: book.title,
      borrower: req.user ? req.user.email : `Guest (${borrowerId})`,
      timestamp: new Date().toLocaleString()
    });

    if (book.isAvailable) {
      console.log('❌ RETURN FAILED: Book not borrowed -', book.title);
      return res.status(400).json({ msg: "Book was not borrowed" });
    }

    // Return the book
    book.isAvailable = true;
    book.borrowedBy = null;
    book.borrowedAt = null;
    book.returnBy = null;

    await book.save();

    console.log('✅ BOOK RETURNED SUCCESS:', {
      book: book.title,
      returnedBy: req.user ? req.user.email : `Guest (${borrowerId})`,
      timestamp: new Date().toLocaleString()
    });

    res.json({ msg: "Book returned successfully! Thank you!" });

  } catch (err) {
    console.error('🚨 RETURN ERROR:', err.message);
    res.status(500).json({ msg: "Server error" });
  }
};