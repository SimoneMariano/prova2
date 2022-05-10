const express = require("express").Router;

const { ensureAuth, ensureUser, logoutUser } = require("../middlewares/auth");
const { googleOauth, googleCallback } = require("../middlewares/passport");

const router = express();

router.route("/google").get(ensureUser, googleOauth);
router.route("/google/callback").get(ensureUser, googleCallback);
router.route("/logout").get(ensureAuth, logoutUser);

module.exports = router;
