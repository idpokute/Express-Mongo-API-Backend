module.exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(400).json({ message: "invalid body", status: 400 });
  }
};
// Only guest can access
module.exports.isNotLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    next();
  } else {
    res.status(400).json({ message: "invalid body", status: 400 });
  }
};
