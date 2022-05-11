const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User");

dotenv.config();

/* google strategy for google user */
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      const loggedUser = {
        userId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        profilePicture: profile.photos[0].value,
      };
      /* check if user is in mongo */
      await User.findOne({ userId: loggedUser.userId })
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

/* local strategy for local user */
passport.use(
  new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    async (req, email, password, done) => {
      await User.findOne({ email })
        .then((result) => {
          if (!result || !bcrypt.compareSync(password, result.password)) {
            return done(null, false, req.flash("error", "credenziali errate"));
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
  await User.findOne({ email: user.email })
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
  loginUser: passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
  }),
};
