const express = require("express");
const nodemailer = require("nodemailer");
const cons = require("consolidate"); // for template engine
const crypto = require("crypto");
const path = require("path");
const User = require("../models/user");
const user = require("../models/user");

// This app uses Google SMTP by nodemailer
// .env needs following variable
/*
EMAIL=your google email
PASSWORD=Do not use your google password. You need create password for the app.
EMAIL_PROVIDER=gmail
EMAIL_HOST=smtp.gmail.com
*/
const email = process.env.EMAIL;
const password = process.env.PASSWORD;

const smtpTransport = nodemailer.createTransport({
  service: process.env.EMAIL_PROVIDER,
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: email,
    pass: password,
  },
});

// const handlebarsOptions = {
//   viewEngine: {
//     extName: ".hbs",
//     defaultLayout: null,
//     partialsDir: "./templates/",
//     layoutDir: "./templates/",
//   },
//   viewPath: path.resolve("./templates/"),
//   extName: ".html",
// };

// smtpTransport.use("compile", hbs(handlebarsOptions));

const router = express.Router();
// const authRouter = require("./authRouter");
// const auctionRouter = require("./auctionRouter");
// const { isLoggedIn, isNotLoggedIn } = require("./middleware");

router.post("/forgot-password", async (req, res) => {
  try {
    const userEmail = req.body.email;
    const user = await User.findByEmail(userEmail);
    if (!user) {
      res.status(400).json({
        message: "invalid email",
        status: 400,
      });
      return;
    }

    // create user token
    const buffer = crypto.randomBytes(20);
    const token = buffer.toString("hex");

    // token lives 10 minutes
    await User.findByIdAndUpdate(
      { _id: user._id },
      { resetToken: token, resetTokenExp: Date.now() + 600000 }
    );

    // Send Email
    const templatePath = path.join(
      req.app.get("templates"),
      "forgot-password.html"
    );

    // send user password reset email
    const html = await cons.nunjucks(templatePath, {
      name: userEmail,
      url: `http://localhost:${process.env.PORT || 5000}?token=${token}`,
    });
    const emailOptions = {
      to: userEmail,
      from: email,
      subject: "MMO password reset",
      html,
    };
    await smtpTransport.sendMail(emailOptions);

    res.status(200).json({
      message: `email has been sent to your email address. Password reset link is only valid 10 minutes. ${userEmail}`,
      status: 200,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      message: "email delivery failed",
      status: 400,
    });
  }
});

router.post("/reset-password", async (req, res) => {
  const userEmail = req.body.email;
  const user = await User.findOne({
    resetToken: req.body.token,
    resetTokenExp: {
      $gt: Date.now(),
    },
    email: userEmail,
  });
  if (!user) {
    res.status(400).json({
      message: "invalid token",
      status: 400,
    });
    return;
  }

  // ensure password was provided, and that the password matches the verified password
  if (
    !req.body.password ||
    !req.body.verifiedPassword ||
    req.body.password !== req.body.verifiedPassword
  ) {
    res.status(400).json({
      message: "password do not match",
      status: 400,
    });
    return;
  }
  // Update User model
  await user.setPassword(req.body.password);
  user.resetToken = undefined;
  user.resetTokenExp = undefined;
  await user.save();

  // send user password reset email
  const templatePath = path.join(
    req.app.get("templates"),
    "reset-password.html"
  );

  // Send email
  const html = await cons.nunjucks(templatePath, {
    name: user.nickname,
  });

  const emailOptions = {
    to: userEmail,
    from: email,
    subject: "Your password reset confirmation",
    html,
  };
  await smtpTransport.sendMail(emailOptions);

  res.status(200).json({
    message: `${userEmail}'s password has been updated.`,
    status: 200,
  });
});

module.exports = router;
