const express = require("express").Router;

const { signupUser } = require("../controllers/auth");
const { ensureAuth, ensureUser, logoutUser } = require("../middlewares/auth");
const {
  googleCallback,
  googleOAuth,
  localAuth,
} = require("../middlewares/passport");

const router = express();

router.route("/google/signin").get(ensureUser, googleOAuth("signin"));
router.route("/google/signup").get(ensureUser, googleOAuth("signup"));

router
  .route("/google/callback/signin")
  .get(ensureUser, googleCallback("signin"));
router
  .route("/google/callback/signup")
  .get(ensureUser, googleCallback("signup"));

router.route("/signin").post(ensureUser, localAuth);
router.route("/signup").post(ensureUser, signupUser);

router.route("/logout").get(ensureAuth, logoutUser);

module.exports = router;
