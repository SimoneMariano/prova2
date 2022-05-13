const express = require("express").Router;

const { createPost, getAllPost } = require("../controllers/post");
const { ensureAuth } = require("../middlewares/auth");

const router = express();

router.route("/").post(ensureAuth, createPost).get(ensureAuth, getAllPost);

module.exports = router;
