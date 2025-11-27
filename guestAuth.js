const { generateGuestId } = require('../utils/helpers');

const guestAuth = (req, res, next) => {
  // Check if user is already authenticated
  if (req.user) {
    return next();
  }

  // Check for guest ID in headers
  let guestId = req.headers['x-guest-id'];
  
  // Validate guest ID format
  if (guestId && !guestId.startsWith('guest_')) {
    return res.status(400).json({ 
      error: 'Invalid guest ID format' 
    });
  }

  // Generate new guest ID if not provided or invalid
  if (!guestId) {
    guestId = generateGuestId();
    req.guestIdGenerated = true;
  }

  req.guestId = guestId;
  next();
};

const getBorrowerId = (req) => {
  if (req.user) return req.user._id.toString();
  if (req.guestId) return req.guestId;
  return null;
};

module.exports = { 
  guestAuth, 
  getBorrowerId 
};