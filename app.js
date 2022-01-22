const express = require("express");
const { createServer } = require("http");
require("dotenv").config();
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const indexRouter = require("./routes"); // JWT setting included
const connect = require("./models");
const passport = require("passport");
const passportConfig = require("./config/passport");

const app = express();

app.set("port", process.env.PORT || 3000);
app.set("templates", path.join(__dirname, "templates")); // email templates for password reset

connect(); // mongoose

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// CORS
app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN, // only allow access from my client
  })
);

//Cookie
app.use(cookieParser(process.env.COOKIE_SECRET));
// Passport
passportConfig(app, passport);

// Router
app.use("/", indexRouter);

// 404
app.use((req, res, next) => {
  res.status(404).json({
    message: "404 - not found",
    status: 404,
  });
  next(err);
});

// 500
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message,
    status: 500,
  });
  // next(err);
});

const server = createServer(app);

server.listen(app.get("port"), () => {
  console.log(app.get("port"), "port listen");
});
