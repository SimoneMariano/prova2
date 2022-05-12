module.exports = {
  ensureAuth: (req, res, next) => {
    req.isAuthenticated() ? next() : res.redirect("/");
  },
  ensureUser: (req, res, next) => {
    !req.isAuthenticated() ? next() : res.redirect("/dashboard");
  },
  logoutUser: (req, res) => {
    req.logout();
    res.redirect("/");
  },
};
