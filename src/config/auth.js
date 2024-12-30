const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('../models/userModel'); // Import User model

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/auth/google/callback',
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        // Check if user already exists
        let user = await User.findOne({ displayName: profile.displayName });

        if (!user) {
          // Create new user
          user = new User({
            username: profile.given_name,
            email: profile.email,
            displayName: profile.displayName,
          });
          await user.save();
        }

        // Pass user to next middleware
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.displayName); // Serialize user by unique displayName
});

passport.deserializeUser(async function (displayName, done) {
  try {
    const user = await User.findOne({ displayName });
    done(null, user); // Pass user object to session
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
