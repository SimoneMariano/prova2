const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const nodemailer = require('nodemailer');

const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

module.exports = {
  signupUser: async (req, res) => {
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

        let transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: {
            type: "OAuth2",
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          },
        });

        var mailOptions = {
          from: "socialify5@gmail.com",
          to: email,
          subject: "Conferma registrazione",
          html: "<h1> Ti confermiamo che la tua registrazione a Socialify è andata a buon fine. Buon divertimento !! </h1>",
          auth: {
              type: "Bearer",
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_SECRET
          }
        }

        transporter.sendMail (mailOptions, function(error, info) {
            if (error) {
              console.log(error);
            }
            else {
              console.log("Verification email sent");
            }
        })

        res.redirect("/dashboard");
      })
      .catch((err) => {
        console.error(err.message);
        res.sendStatus(500);
      });
  },
};
