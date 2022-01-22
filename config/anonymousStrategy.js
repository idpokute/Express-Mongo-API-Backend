const AnonymousStrategy = require("passport-anonymous").Strategy;

module.exports = (passport) => {
  passport.use(new AnonymousStrategy());
};
