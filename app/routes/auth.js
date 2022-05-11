const express = require("express").Router;

const { signupUser } = require("../controllers/auth");
const { ensureAuth, ensureUser, logoutUser } = require("../middlewares/auth");
const {
  googleCallbackSignin,
  googleCallbackSignup,
  googleOauthSignin,
  googleOauthSignup,
  signinUser,
} = require("../middlewares/passport");

const router = express();

router.route("/google/signin").get(ensureUser, googleOauthSignin);
router.route("/google/signup").get(ensureUser, googleOauthSignup);

router.route("/google/callback/signin").get(ensureUser, googleCallbackSignin);
router.route("/google/callback/signup").get(ensureUser, googleCallbackSignup);

router.route("/signin").post(ensureUser, signinUser);
router.route("/signup").post(ensureUser, signupUser);

router.route("/logout").get(ensureAuth, logoutUser);

module.exports = router;
