const dotenv = require("dotenv");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/User");

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      const loggedUser = {
        googleId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        profilePicture: profile.photos[0].value,
      };
      /* check if user is in mongo */
      await User.findOne({ googleId: loggedUser.googleId })
        .then(async (result) => {
          /* user not registered */
          if (!result) {
            result = await User(loggedUser).save();
          }
          return done(null, result);
        })
        .catch((err) => {
          console.error(err.message);
        });
    }
  )
);

passport.serializeUser((user, done) => {
  return done(null, user);
});

passport.deserializeUser(async (user, done) => {
  await User.findOne({ googleId: user.googleId })
    .then((result) => {
      return done(null, result);
    })
    .catch((err) => {
      console.error(err.message);
    });
});

module.exports = {
  passport,
  googleOauth: passport.authenticate("google", { scope: ["email", "profile"] }),
  googleCallback: passport.authenticate("google", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
  }),
};
