const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user");

module.exports = (passport) => {
  passport.use(
    "signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passportField: "password",
        passReqToCallback: true,
        session: false,
      },
      async (req, email, password, done) => {
        try {
          const { nickname } = req.body;

          const result = await User.findByEmail(email);

          if (result !== null) {
            return done(new Error("Email is already registered"), false);
          }

          const newUser = new User({
            email,
            nickname,
          });
          await newUser.setPassword(password);
          await newUser.save();

          return done(null, {
            email: newUser.email,
            nickname: newUser.nickname,
          });

          // passport에서 로그인을 처리하는 방법
          // req.login(req.body, () => {
          //   res.redirect('/auth/profile')
          // })
        } catch (error) {
          console.error(error);
          return done(new Error(error), false);
        }
      },
    ),
  );

  // login
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
        passportField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await User.findByEmail(email);
          if (user) {
            if (await user.checkPassword(password)) {
              return done(null, user);
            } else {
              return done(new Error("Incorrect Password"), false);
            }
          } else {
            return done(new Error("Incorrect Email"), false);
          }
        } catch (error) {
          console.error(error);
          done(error);
        }
      },
    ),
  );
};
