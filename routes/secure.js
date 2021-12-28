const express = require("express");
// const passport = require("passport");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");
const router = express.Router();
// const authRouter = require("./authRouter");
// const auctionRouter = require("./auctionRouter");
// const { isLoggedIn, isNotLoggedIn } = require("./middleware");
const Chat = require("../models/chat");

router.post("/chat", async (req, res) => {
  if (!req.body || !req.body.message) {
    return res.status(400).json({
      message: "invalid body",
      status: 400,
    });
  } else {
    const { message } = req.body;
    const { email } = req.user;

    console.log(req.user);
    console.log(message);

    const newChat = await Chat.create({
      email,
      message,
    });

    return res.status(200).json({
      chat: newChat,
      message: `message sent`,
      status: 200,
    });
  }
});

module.exports = router;
