const express = require('express');
const { User } = require('../models/user');
const { Recinto } = require('../models/recinto');
const { ObjectId } = require('mongoose').Types;
const { Task, validateTask } = require('../models/task');
const Joi = require('joi');
// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', async (req, res) => {
  const task = await Task.find().populate('user', '_id fullName state');
  res.send(task);
});

router.get('/user/:id', async (req, res) => {
  const task = await Task.findOne({ user: req.params.id }).populate(
    'user',
    '_id fullName state'
  );
  res.send(task);
});

function getCastObjectIds(value) {
  return ObjectId(value);
}

router.post('/', async (req, res) => {
  console.log('post task');
  const { error } = validateTask(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isUserTask = await Task.findOne({ user: req.body.userId });
  if (isUserTask)
    return res.status(400).send('User already register in task collection');

  const user = await User.findOne({ _id: req.body.userId });
  if (!user) return res.status(400).send('User no existe in User collections');

  const listRecintosId = req.body.recintos.map(getCastObjectIds);

  if (!listRecintosId) return res.status(400).send('task.recintos is empty');

  const recintos = await Recinto.find({
    _id: { $in: listRecintosId },
  });
  console.log(user._id);
  const task = new Task({
    user: ObjectId(user._id),
    recintos: recintos,
  });
  await task.save();
  res.send(task);
});

router.put('/user/:id', async (req, res) => {
  const { error } = validateTaskUpdate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isUserTask = await Task.findOne({ user: req.params.id });
  if (!isUserTask)
    return res.status(400).send('Usuario no exisite in task collections');

  const user = await User.findOne({ _id: req.params.id });
  if (!user) return res.status(400).send('User no existe in User collection');
  console.log(req.body.recintos);
  const listRecintosId = req.body.recintos.map(getCastObjectIds);

  if (!listRecintosId) return res.status(400).send('task.recintos is empty');

  const recintos = await Recinto.find({
    _id: { $in: listRecintosId },
  });

  const task = await Task.findOneAndUpdate(
    { user: user._id },
    {
      $set: {
        user: user._id,
        recintos: recintos,
      },
    },
    { new: true }
  );
  if (!task)
    return res.status(404).send('The taks with the given ID was not found.');
  res.send(task);
});

router.delete('/:id', async (req, res) => {
  const task = await Task.findByIdAndRemove(req.params.id);
  if (!task)
    return res.status(404).send('The task with the given ID was not found.');

  res.send(task);
});
function validateTaskUpdate(task) {
  const schema = Joi.object({
    recintos: Joi.array().min(1).max(10).required(),
  });
  return schema.validate(task);
}

module.exports = router;
