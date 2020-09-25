const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function authVerifyToken(req, res, next) {
  const token = req.cookies.authjwt;
  if (!token) return res.status(401).send('Access denied. Not token provied');
  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    // console.log(req.user);
    // req.user._id;
    return next();
  } catch (exception) {
    return res.status(400).send('Invalid Token.');
  }
};
