// const redis = require("redis");
const express = require("express");
const { createServer } = require("http");
const path = require("path");
// const favicon = require("serve-favicon");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
// const session = require("express-session");
const cors = require("cors");
// const RedisStore = require("connect-redis")(session);
// const nunjucks = require("nunjucks");
// const flash = require("connect-flash");

require("dotenv").config();

const indexRouter = require("./routes");
const connect = require("./models");
const passport = require("passport");
const passportConfig = require("./config/passport");
// const logger = require("./logger");
// const sse = require("./sse");
// const webSocket = require("./socket");
// const checkAuction = require("./checkAuction");

const app = express();

app.set("port", process.env.PORT || 3000);

connect(); // mongoose

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
} else {
  app.use(morgan("dev"));
}

// app.use(express.static(path.join(__dirname, "public")));
// app.use("/img", express.static(path.join(__dirname, "uploads")));
// app.use(favicon(path.join(__dirname, "public", "favicon.ico")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// CORS
app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN,
  }),
);
//Cookie
app.use(cookieParser(process.env.COOKIE_SECRET));
// const sessionOption = {
//   resave: false,
//   saveUninitialized: false,
//   secret: process.env.COOKIE_SECRET,
//   cookie: {
//     httpOnly: true,
//     secure: false,
//   },
// };

// if (process.env.NODE_ENV === "production") {
//   app.set("trust proxy", 1);
//   sessionOption.proxy = true;
//   // sessionOption.cookie.secure = true;
// }
// const sessionMiddleware = session(sessionOption);
// app.use(sessionMiddleware);
// app.use((req, res, next) => {
//   if (!req.session) {
//     return next(new Error("redis might make this session issue"));
//   }
//   next();
// });

passportConfig(app, passport);

// checkAuction();

// app.locals.env = process.env;

app.use("/", indexRouter);

// app.use((req, res, next) => {
//   const err = new Error("not found");
//   err.status = 404;

//   logger.info("hello");
//   logger.error(err.message);

//   next(err);
// });

// app.use((err, req, res, next) => {
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};
//   res.status(err.status || 500);
//   res.render("error");
// });

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
  console.log(err);
  res.status(err.status || 500).json({
    error: err.message,
    status: 500,
  });
  // next(err);
});

const server = createServer(app);

// webSocket(server, app, sessionMiddleware, redisClient);
// sse(server);

server.listen(app.get("port"), () => {
  console.log(app.get("port"), "port listen");
});
