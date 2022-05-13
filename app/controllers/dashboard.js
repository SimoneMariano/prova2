const axios = require("axios").default;

module.exports = {
  renderPage: async (req, res) => {
    await axios
      .get("http://localhost:3000/api/v1/post")
      .then((result) => {
        const { data } = result;
        res.render("dashboard", {
          title: "Dashboard",
          logged: req.isAuthenticated(),
          post: data,
        });
      })
      .catch((err) => res.send(err.message));
  },
};
