const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'auth/google/callback', 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { email, given_name, family_name, picture } = profile._json;
        
        return done(null, { email, firstName: given_name, lastName: family_name, profilePic: picture });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport; 
