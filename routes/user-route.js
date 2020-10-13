const auth = require('../middleware/auth-middleware');
// const admin = require('../middleware/admin-middleware');
// const config = require('config');
const access = require('../middleware/admin-middleware');
const _ = require('lodash');
const { User, validate } = require('../models/user');
const express = require('express');
/* eslint-disable new-cap */
const router = express.Router();

router.get('/', access('readAny', 'users'), async (req, res) => {
  const user = await User.find().select('-password');
  res.send(user);
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.post('/', access('createAny', 'users'), async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { name, fullName, telefono, password, rol, state } = req.body;
  let user = await User.findOne({
    $or: [{ name }, { telefono }],
  });

  if (user) return res.status(400).send('User already register');
  const passwordGen = await User.encryptPwd(password);
  user = new User({
    name,
    fullName,
    telefono,
    password: passwordGen,
    rol,
    state,
  });
  await user.save();
  res.status(200).json({ name, fullName, telefono, rol, state });
  // const token = user.generateAuthToken();
  // res.header('x-auth-token',token).send(_.pick(user,['_id','name']));
});

router.put('/:id', access('updateAny', 'users'), async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const { name, fullName, telefono, password, rol, state } = req.body;
  const passwordGen = await User.encryptPwd(password);
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        fullName,
        telefono,
        password: passwordGen,
        rol,
        state,
      },
      { new: true }
    );
    if (!user)
      return res.status(404).send('The User with the given ID was not found.');
    res.status(200).json({ name, fullName, telefono, rol, state });
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
