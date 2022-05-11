const express = require("express").Router;

const { renderPage } = require("../controllers/welcome");
const { ensureUser } = require("../middlewares/auth");

const router = express();

router.route("/").get(ensureUser, renderPage);

module.exports = router;
