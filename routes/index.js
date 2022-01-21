const express = require("express");
const passport = require("passport");
const router = express.Router();
const passwordRouter = require("./password");
const jwt = require("jsonwebtoken");
const secureRouter = require("./secure");
const { isLoggedIn, isNotLoggedIn } = require("./middleware");

const tokens = [];

router.get("/status", (req, res) => {
  res.status(200).json({
    message: "ok",
    status: 200,
  });
});

router.post(
  "/signup",
  passport.authenticate("signup", { session: false }),
  async (req, res) => {
    res.status(200).json({
      message: "signup successful",
      status: 200,
    });
  }
);

router.post("/login", (req, res, next) => {
  passport.authenticate("login", (authError, user) => {
    try {
      if (authError) {
        console.error(authError);
        return next(authError);
      }
      if (!user) {
        return next(new Error("Login Failed."));
      }
      req.login(user, { session: false }, (loginError) => {
        if (loginError) {
          console.error(loginError);
          return next(loginError);
        }
        // Success
        // create jwt
        const body = {
          _id: user._id,
          email: user.email,
          nickname: user.nickname,
        };
        const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;
        // token expiry time should be shorter than refreshToken
        const token = jwt.sign({ user: body }, JWT_SECRET, {
          expiresIn: 300,
        });
        const refreshToken = jwt.sign({ user: body }, JWT_REFRESH_SECRET, {
          expiresIn: 86400,
        });

        // store token in Cookie
        res.cookie("jwt", token);
        res.cookie("refreshJwt", refreshToken);

        // store token in memory, it should be in db such as mongo/redis
        tokens[refreshToken] = {
          token,
          refreshToken,
          email: user.email,
          _id: user._id,
          nickname: user.nickname,
        };
        console.log(tokens);
        // send token to the user
        return res.status(200).json({
          token,
          refreshToken,
          status: 200,
        });
      });
    } catch (err) {
      console.error(err);
      return next(err);
    }
  })(req, res, next);
});

router.post("/logout", (req, res) => {
  if (req.cookies) {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken in tokens) {
      delete tokens[refreshToken];
    }

    res.clearCookie("jwt");
    res.clearCookie("refreshJwt");
  }

  res.status(200).json({
    message: "logged out",
    status: 200,
  });
});

router.post("/token", (req, res) => {
  const { refreshToken } = req.body;

  if (refreshToken in tokens) {
    const body = {
      email: tokens[refreshToken].email,
      _id: tokens[refreshToken]._id,
      nickname: tokens[refreshToken].nickname,
    };

    const { JWT_SECRET, JWT_REFRESH_SECRET } = process.env;
    // token expiry time should be shorter than refreshToken
    const token = jwt.sign({ user: body }, JWT_SECRET, {
      expiresIn: 300,
    });
    res.cookie("jwt", token);
    tokens[refreshToken].token = token;

    res.status(200).json({
      token,
      status: 200,
    });
  } else {
    res.status(401).json({
      message: "unauthorized",
      status: 401,
    });
  }
});

router.use("/", passwordRouter);
router.use("/", passport.authenticate("jwt", { session: false }), secureRouter);

module.exports = router;
