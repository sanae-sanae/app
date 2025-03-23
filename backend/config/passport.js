const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy; 
const User = require('../models/User');
const jwt = require('jsonwebtoken');

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/api/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user =
            (await User.findOne({ email: profile.emails[0].value })) ||
            new User({
              email: profile.emails[0].value,
              name: profile.displayName,
              role: 'member',
            });

          await user.save();
          const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          );

          return done(null, { token });
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/api/auth/github/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user =
            (await User.findOne({ email: profile.emails[0].value })) ||
            new User({
              email: profile.emails[0].value,
              name: profile.displayName,
              role: 'member',
            });

          await user.save();
          const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
          );

          return done(null, { token });
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));
};