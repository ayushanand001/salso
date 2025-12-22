require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

require("dotenv").config();
require("express-session")


const app = express();

mongoose.connect(process.env.MONGO_URI);

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: "secretkey",
  resave: false,
  saveUninitialized: false
}));

app.use("/", require("./routes/authroutes"));
app.use("/", require("./routes/dashboardroutes"));

app.listen(3000, () => console.log("Server started"));
