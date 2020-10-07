module.exports = function handleErrors(err, req, res, next) {
  console.log(err);
  console.log(err.message, err);
  res.status(500).send('Something failed.');
  return next();
  // error
  // warn
  // info
  // verbose
  // silly
};
