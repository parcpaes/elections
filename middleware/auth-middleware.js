const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function authVerifyToken(req, res, next) {
  const token = req.header('authjwt');
  console.log('token');
  console.log(token);
  if (!token) return res.status(401).send('Access denied. Not token provied');
  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    // req.user._id;
    return next();
  } catch (exception) {
    return res.status(400).send('Invalid Token.');
  }
};
