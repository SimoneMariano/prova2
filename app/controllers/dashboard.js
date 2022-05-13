const Post = require("../models/Post");

module.exports = {
  renderPage: async (req, res) => {
    await Post.find({})
      .then((result) => {
        res.render("dashboard", {
          title: "Dashboard",
          logged: req.isAuthenticated(),
          post: result,
        });
      })
      .catch((err) => {
        console.error(err.message);
        res.sendStatus(500);
      });
  },
};
