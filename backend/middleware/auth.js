// middleware/auth.js
const jwt = require('jsonwebtoken');

module.exports = function (roles = []) {
  return function (req, res, next) {
    const authHeader = req.header('Authorization');
    console.log('Auth header received:', authHeader); 
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const token = authHeader.replace('Bearer ', '');
    console.log('Extracted token:', token); 

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Decoded token:', decoded); 
      req.user = decoded;

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Unauthorized: Insufficient role' });
      }
      next();
    } catch (error) {
      console.log('Token verification error:', error.message); 
      return res.status(401).json({ message: 'Invalid token' });
    }
  };
};