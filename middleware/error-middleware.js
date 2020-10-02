module.exports = function handleErrors(err, req, res, next) {
  console.log(err.message, err);
  res.status(500).send(err.message);
  return next();
  // error
  // warn
  // info
  // verbose
  // silly
};
