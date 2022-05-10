const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");

const { passport } = require("./middlewares/passport");
const googleOauthRoutes = require("./routes/auth");

dotenv.config();

const INSTANCE = process.env.INSTANCE || "";
const MONGO_URI = process.env.MONGO_URI || "";
const PORT = process.env.PORT || 3000;

const app = express();

/* set middlewares */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    cookie: {
      /* cookie's lifetime: one day */
      maxAge: 1000 * 60 * 60 * 24,
      secure: false,
    },
    resave: false,
    saveUninitialized: true,
    secret: process.env.SECRET,
    store: new MongoStore({ mongoUrl: MONGO_URI }),
  })
);

/* initialize passport */
app.use(passport.initialize());
app.use(passport.session());

/* set routes */
app.use("/auth", googleOauthRoutes);

/* set root path */

/* set mongo connection */
mongoose
  .connect(MONGO_URI)
  .then((result) => {
    console.log(`${INSTANCE} -> database: ${result.connection.host}`);
    /* start app */
    app.listen(PORT, () => {
      console.log(`${INSTANCE} -> PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err.message);
  });
