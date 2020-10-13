const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function authVerifyToken(req, res, next) {
  try {
    const token = req.cookies.authjwt;
    console.log(token);
    if (!token) {
      return res.status(401).send('Acceso denegado');
    }
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded;
    // req.user._id;
    return next();
  } catch (exception) {
    next();
    return res.status(400).send('Invalid Token.');
  }
};
