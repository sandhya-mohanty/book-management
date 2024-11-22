const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.signup = async (req, res) => {
  try {
    console.log('Request body:', req.body); // Log request body
    const { username, email, password } = req.body;

    // Create user
    const user = await User.create({ username, email, password });
    console.log('User created:', user);

    // Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (err) {
    console.error('Signup error:', err);

    // Handle Sequelize validation errors
    if (err.name === 'SequelizeValidationError') {
      const messages = err.errors.map(e => `${e.path}: ${e.message}`);
      return res.status(400).json({ error: messages.join(', ') });
    }

    // Handle unique constraint errors
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Username or email already exists.' });
    }

    res.status(500).json({ error: 'Internal server error.' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
