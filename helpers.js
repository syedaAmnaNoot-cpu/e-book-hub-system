// Generate guest ID if not exists
const generateGuestId = () => {
  return 'guest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
};

// Get borrower ID (user or guest)
const getBorrowerId = (req) => {
  if (req.user) return req.user._id.toString();
  if (req.headers['x-guest-id']) return req.headers['x-guest-id'];
  return null;
};

// Validate ObjectId
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports = {
  generateGuestId,
  getBorrowerId,
  isValidObjectId
};