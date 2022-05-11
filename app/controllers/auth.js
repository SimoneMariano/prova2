const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const User = require("../models/User");

module.exports = {
  signupUser: async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    /* check if user does not exists in mongo */
    await User.findOne({ email })
      .then(async (result) => {
        if (result) {
          req.flash("error", "utente già registrato");
          res.redirect("/");
          return;
        }
        /* hash password */
        const hashedPassword = bcrypt.hashSync(password, 15);
        const signupUser = {
          userId: uuidv4(),
          firstName,
          lastName,
          email,
          password: hashedPassword,
        };
        await User(signupUser).save();
        req.flash("success", "utente registrato correttamente");
        res.redirect("/dashboard");
      })
      .catch((err) => {
        console.error(err.message);
        res.sendStatus(500);
      });
  },
};
