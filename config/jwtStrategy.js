const JwtStrategy = require("passport-jwt").Strategy;
const User = require("../models/user");

module.exports = (passport) => {
  passport.use(
    new JwtStrategy(
      {
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: (req) => {
          let token = null;
          if (req && req.cookies) token = req.cookies.jwt;
          return token;
        },
      },
      async (token, done) => {
        try {
          return done(null, token.user);
        } catch (error) {
          console.error(error);
          return done(new Error(error));
        }
      },
    ),
  );
};
