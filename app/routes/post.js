const express = require("express").Router;

const { createPost } = require("../controllers/post");
const { ensureAuth } = require("../middlewares/auth");

const router = express();

router.route("/").post(createPost);

module.exports = router;
