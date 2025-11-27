const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// User registration
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    console.log('📝 SIGNUP ATTEMPT:', { 
      firstName, 
      lastName, 
      email, 
      passwordLength: password ? password.length : 0 
    });

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ 
        error: 'All fields are required: firstName, lastName, email, password' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        error: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('❌ SIGNUP FAILED: User already exists -', email);
      return res.status(400).json({ 
        error: 'User already exists with this email address' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    await user.save();

    console.log('✅ USER CREATED:', {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      timestamp: new Date().toLocaleString()
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully!',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('🚨 SIGNUP ERROR:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: errors.join(', ') });
    }
    
    res.status(500).json({ 
      error: 'Internal server error during registration' 
    });
  }
};

// User login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 LOGIN ATTEMPT:', { 
      email, 
      passwordLength: password ? password.length : 0 
    });

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email and password are required' 
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('❌ LOGIN FAILED: User not found -', email);
      return res.status(400).json({ 
        error: 'Invalid email or password' 
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({ 
        error: 'Account is deactivated. Please contact support.' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('❌ LOGIN FAILED: Wrong password for -', email);
      return res.status(400).json({ 
        error: 'Invalid email or password' 
      });
    }

    console.log('✅ LOGIN SUCCESS:', {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      timestamp: new Date().toLocaleString()
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('🚨 LOGIN ERROR:', error);
    res.status(500).json({ 
      error: 'Internal server error during login' 
    });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    console.log('👤 PROFILE ACCESSED:', {
      id: req.user._id,
      email: req.user.email,
      timestamp: new Date().toLocaleString()
    });

    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('🚨 PROFILE ERROR:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

// Make admin (for development)
exports.makeAdmin = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: 'admin' },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User role updated to admin successfully!',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('🚨 MAKE ADMIN ERROR:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
};