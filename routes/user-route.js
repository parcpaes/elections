const auth = require('../middleware/auth-middleware');
// const admin = require('../middleware/admin-middleware');
// const config = require('config');
const _ = require('lodash');
const { User, validate } = require('../models/user');
const express = require('express');
/* eslint-disable new-cap */
const router = express.Router();

router.get('/', async (req, res) => {
  const user = await User.find().select('-password');
  res.send(user);
});

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({
    $or: [{ name: req.body.name }, { telefono: req.body.telefono }],
  });

  if (user) return res.status(400).send('User already register');

  user = new User(
    _.pick(req.body, [
      'name',
      'fullName',
      'telefono',
      'password',
      'rol',
      'state',
    ])
  );
  await user.save();
  res
    .status(200)
    .json(_.pick(user, ['_id', 'name', 'fullname', 'rol', 'state']));
  // const token = user.generateAuthToken();
  // res.header('x-auth-token',token).send(_.pick(user,['_id','name']));
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      fullName: req.body.fullName,
      telefono: req.body.telefono,
      password: req.body.password,
      state: req.body.state,
    },
    { new: true }
  );

  if (!user)
    return res.status(404).send('The User with the given ID was not found.');

  res
    .status(200)
    .json(_.pick(user, ['_id', 'name', 'fullname', 'rol', 'state']));
});

module.exports = router;
