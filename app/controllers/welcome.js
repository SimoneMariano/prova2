module.exports = {
  renderPage: (req, res) => {
    res.render("welcome", {
      title: "Socialify",
      success: req.flash("success"),
      error: req.flash("error"),
    });
  },
};
