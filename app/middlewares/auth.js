module.exports = {
  checkLogin: (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      req.flash("error", "credenziali mancanti");
      res.redirect("/");
      return;
    }
  },
  checkRegistration: (req, res, next) => {
    const { firstName, lastName, email, password, retypedPassword } = req.body;
    /* form validation */
    if (!firstName || !lastName || !email || !password || !retypedPassword) {
      req.flash("error", "completa il form per effettuare la registrazione");
      res.redirect("/");
      return;
    }

    /* password validation */
    if (password !== retypedPassword) {
      req.flash("error", "le due password non corrispondono");
      res.redirect("/");
      return;
    }
  },
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
