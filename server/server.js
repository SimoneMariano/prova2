const dotenv = require("dotenv");
const express = require("express");

dotenv.config();

const INSTANCE = process.env.INSTANCE;
const PORT = process.env.PORT || 3000;

const app = express();

app.listen(PORT, () => console.log(`${INSTANCE} -> PORT: ${PORT}`));
