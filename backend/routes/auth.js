const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const passport = require('passport');
const { check } = require('express-validator');
router.post('/register', [
  check('username', 'Username is required').not().isEmpty(),
  check('password', 'Password must be 6+ characters').isLength({ min: 6 }),
  check('email', 'Valid email is required').isEmail(),
  check('fullName', 'Full name is required').not().isEmpty(),
], authController.register); 
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(`http://localhost:3000/auth/callback?token=${req.user.token}`);
});
router.get('/github', passport.authenticate('github'));
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
  res.redirect(`http://localhost:3000/auth/callback?token=${req.user.token}`);
});
router.put('/profile', authController.updateProfile);
router.post('/login', authController.login);
module.exports = router;