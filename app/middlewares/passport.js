const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const LocalStrategy = require("passport-local").Strategy;

const User = require("../models/User");

dotenv.config();

/* google strategy for google user */
passport.use(
  "signup",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI_SIGNUP,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      req.session.googleAccessToken = accessToken;
      req.session.googleRefreshToken = refreshToken;
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
          /* user registered */
          if (result) {
            return done(
              null,
              false,
              req.flash("error", "utente già registrato")
            );
          }
          result = await User(loggedUser).save();
          return done(null, result);
        })
        .catch((err) => {
          console.error(err.message);
        });
    }
  )
);

passport.use(
  "signin",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URI_SIGNIN,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      /* save access token */
      req.session.accessToken = accessToken;
      /* check if user is in mongo */
      await User.findOne({ userId: profile.id })
        .then(async (result) => {
          /* user not registered */
          if (!result) {
            return done(
              null,
              false,
              req.flash("error", "utente non registrato")
            );
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
  googleOauthSignin: passport.authenticate("signin", {
    scope: ["email", "profile"],
  }),
  googleOauthSignup: passport.authenticate("signup", {
    scope: ["email", "profile"],
  }),
  googleCallbackSignin: passport.authenticate("signin", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
  }),
  googleCallbackSignup: passport.authenticate("signup", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
  }),
  signinUser: passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/",
  }),
};
