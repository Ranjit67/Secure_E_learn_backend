const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const morgan = require("morgan");
var createError = require("http-errors");
const proxy = require("http-proxy-middleware");
// const cors = require('cors');
const request = require("request");

const app = express();

// app.use('/api',
// createProxyMiddleware({ target: 'https://leacturedot.herokuapp.com',

//    changeOrigin: true }));

app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  //restricted link - https://leacturedot.herokuapp.com
  res.header("Access-Control-Allow-Origin", "*");

  // Request headers you wish to allow
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization"
  );

  // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  if (req.method === "OPTIONS") {
    // Request methods you wish to allow
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
    return res.status(200).json({});
  }
  // Pass to next layer of middleware
  next();
});

app.get("/", (req, res, next) => {
  res.send("modan marunu tu.");
});

mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("The data base is connected.");
});
mongoose.connection.on("error", (err) => {
  console.log(err);
});

app.use(express.json());

app.use(require("./routes/auth"));

app.use(require("./routes/post"));

const student = require("./routes/student/auth");
app.use("/user", student);

app.use(async (req, res, next) => {
  next(createError.NotFound());
});

app.use(async (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status,
      message: err.message,
    },
  });
});

let port = process.env.PORT || 9000;
app.listen(port, "0.0.0.0", function () {
  console.log("The port 9000 is ready to start...");
});
