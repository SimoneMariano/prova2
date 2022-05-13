const bodyParser = require("body-parser");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");

const { passport } = require("./middlewares/passport");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const apiRoutes = require("./routes/post");
const welcomeRoutes = require("./routes/welcome");

dotenv.config();

const INSTANCE = process.env.INSTANCE || "";
const MONGO_URI = process.env.MONGO_URI || "";
const PORT = process.env.PORT || 3000;

const app = express();

/* set view engine */
app.set("view engine", "ejs");

/* set middlewares */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());
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
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/api/v1/post", apiRoutes);
app.use("/", welcomeRoutes);

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
