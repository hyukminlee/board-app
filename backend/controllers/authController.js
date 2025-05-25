const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });
};

exports.googleAuthCallback = (req, res) => {
  const token = exports.generateToken(req.user);
  res.redirect(`${process.env.CLIENT_URL}/oauth2/redirect?token=${token}`);
};
