
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validationResult } = require('express-validator');
exports.register = async (req, res) => {
  console.log('Register request:', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, email, fullName, role } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) return res.status(400).json({ message: 'Username already exists' });
    user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already exists' });
    user = new User({
      username,
      password: await bcrypt.hash(password, 10),
      email,
      fullName,
      role: role || 'worker', 
    });
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, 'sanae123', { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user._id, username, role } });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.login = async (req, res) => {
  console.log('Login request:', req.body);
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, 'sanae123', { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, username, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
exports.updateProfile = async (req, res) => {
  const { email, fullName } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.email = email || user.email;
    user.fullName = fullName || user.fullName;
    await user.save();
    res.json({ user: { id: user._id, username: user.username, email: user.email, fullName: user.fullName, role: user.role } });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
