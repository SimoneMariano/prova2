const express = require("express").Router;

const { signupUser } = require("../controllers/auth");
const { ensureAuth, ensureUser, logoutUser } = require("../middlewares/auth");
const {
  googleOauth,
  googleCallback,
  loginUser,
} = require("../middlewares/passport");

const router = express();

router.route("/google").get(ensureUser, googleOauth);
router.route("/google/callback").get(ensureUser, googleCallback);

router.route("/login").post(ensureUser, loginUser);
router.route("/registration").post(ensureUser, signupUser);

router.route("/logout").get(ensureAuth, logoutUser);

module.exports = router;
