const express = require("express");
// const passport = require("passport");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
const router = express.Router();
// const authRouter = require("./authRouter");
// const auctionRouter = require("./auctionRouter");
// const { isLoggedIn, isNotLoggedIn } = require("./middleware");

router.post("/forgot-password", (req, res) => {
  if (!req.body || !req.body.email) {
    res.status(400).json({
      message: "invalid body",
      status: 400,
    });
  } else {
    const { email } = req.body;

    res.status(200).json({
      message: `forgot password requested to token ${email}`,
      status: 200,
    });
  }
});

router.post("/reset-password", (req, res) => {
  if (!req.body || !req.body.email) {
    res.status(400).json({
      message: "invalid body",
      status: 400,
    });
  } else {
    const { email } = req.body;

    res.status(200).json({
      message: `reset password requested to token ${email}`,
      status: 200,
    });
  }
});

module.exports = router;
