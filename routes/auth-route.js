const { User } = require('../models/user');
const express = require('express');
const Joi = require('joi');
// eslint-disable-next-line new-cap
const router = express.Router();

// const roles = ['Admin','Operador','Jefe-Recinto'];
const maxhours = 6 * 60 * 60 * 1000;

router.post('/', async (req, res) => {
  // console.log(req.body);
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ name: req.body.usuario });
  if (!user) return res.status(400).send('Invalid email or password');
  const validPassword = User.login(req.body.usuario, req.body.password);

  if (!validPassword) return res.status(400).send('Invalid email or password');

  const token = user.generateAuthToken();
  res.cookie('authjwt', token, { httpOnly: true, maxAge: maxhours });
  res.status(200).json({ token });
});

router.get('/', (req, res) => {
  res.cookie('authjwt', '', { maxAge: 0 });
  res.clearCookie('authjwt');
  res.redirect('/');
});

// eslint-disable-next-line require-jsdoc
function validate(req) {
  const schema = Joi.object({
    usuario: Joi.string().min(3).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(req);
}

module.exports = router;
