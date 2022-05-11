module.exports = {
  renderPage: (req, res) => {
    res.render("dashboard", {
      title: "Dashboard",
      logged: req.isAuthenticated(),
    });
  },
};
