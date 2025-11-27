const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Book title is required'], 
    trim: true,
    minlength: [1, 'Title cannot be empty'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  author: { 
    type: String, 
    required: [true, 'Author name is required'], 
    trim: true,
    minlength: [1, 'Author name cannot be empty'],
    maxlength: [100, 'Author name cannot exceed 100 characters']
  },
  price: { 
    type: Number, 
    default: 0,
    min: [0, 'Price cannot be negative']
  },
  genre: { 
    type: String, 
    default: "Uncategorized",
    trim: true
  },
  description: { 
    type: String, 
    default: "",
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  cover: { 
    type: String 
  },
  isPublic: { 
    type: Boolean, 
    default: true 
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  borrowedBy: { 
    type: String, 
    default: null 
  },
  borrowedAt: { 
    type: Date, 
    default: null 
  },
  returnBy: { 
    type: Date, 
    default: null 
  }
}, { 
  timestamps: true 
});

// Indexes for better performance
bookSchema.index({ title: 'text', author: 'text', genre: 'text' });
bookSchema.index({ isAvailable: 1 });
bookSchema.index({ isPublic: 1 });
bookSchema.index({ uploadedBy: 1 });
bookSchema.index({ borrowedBy: 1 });

// Virtual for borrow status
bookSchema.virtual('borrowStatus').get(function() {
  if (this.isAvailable) return 'available';
  if (this.returnBy && new Date() > this.returnBy) return 'overdue';
  return 'borrowed';
});

// Method to check if book is overdue
bookSchema.methods.isOverdue = function() {
  return this.returnBy && new Date() > this.returnBy;
};

module.exports = mongoose.model('Book', bookSchema);