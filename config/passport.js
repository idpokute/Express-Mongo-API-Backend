const local = require("./localStrategy");
const jwt = require("./jwtStrategy");
const User = require("../models/user");

module.exports = (app, passport) => {
  // app.use(passport.initialize());
  // app.use(passport.session());

  // passport.serializeUser((user, done) => {
  //   done(null, user._id);
  // });

  // passport.deserializeUser(async (id, done) => {
  //   try {
  //     const user = await User.findById(id);
  //     done(null, user);
  //   } catch (error) {
  //     done(error, null);
  //   }
  // });

  local(passport);
  jwt(passport);
};
