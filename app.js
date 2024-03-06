const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
const dotenv = require("dotenv").config();
const connectDB = require("./database/connect");
const loginSignupRoute = require("./routes/loginSignupRoute");
connectDB();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(
    "/",
    loginSignupRoute,
  );

  app.listen(process.env.PORT ? process.env.PORT : 5000, () => {
    console.log(`app listening on PORT ${process.env.PORT}`);
  })