const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ socialId: profile.id });

    if (!user) {
      user = await User.create({
        email: profile.emails[0].value,
        name: profile.displayName,
        provider: 'google',
        socialId: profile.id,
      });
    }

    done(null, user);
  } catch (err) {
    done(err, null);
  }
}));
