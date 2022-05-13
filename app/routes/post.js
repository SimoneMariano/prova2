const express = require("express").Router;

const { createPost, getAllPost } = require("../controllers/post");

const router = express();

router.route("/").post(createPost).get(getAllPost);

module.exports = router;
