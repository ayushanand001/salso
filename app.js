require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

// view engine
app.set("view engine", "ejs");

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// routes
app.use("/", require("./routes/authroutes"));
app.use("/", require("./routes/salonroutes"));
app.use("/", require("./routes/gettinggdt"));
app.use("/",require("./routes/payment"));
app.use("/", require("./routes/salondashboardroutes"));


// server
app.listen(process.env.PORT || 3000, () => {
  console.log("Server started");
});
