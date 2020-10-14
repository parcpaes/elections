// const { Task, validate } = require('../models/task');
// const express = require('express');
// const { User } = require('../models/user');
// const { Acta } = require('../models/acta');
// // eslint-disable-next-line new-cap
// const router = express.Router();

// router.get('/', async (req, res) => {
//   const task = await Task.find();
//   res.send(task);
// });

// router.get('/user/:id', async (req, res) => {
//   const task = await Task.findOne({ user: req.params.id });
//   if (!task)
//     return res.status(404).send('The task with the given ID was not found.');

//   res.send(task);
// });

// router.post('/', async (req, res) => {
//   const { error } = validate(req.body);
//   if (error) return res.status(400).send(error.details[0].message);

//   const isUser = await User.findOne({ _id: req.body.userId });
//   if (isUser) return res.status(400).send('User already register');

//   const isActa = await Acta.findOne({ codMesa: req.body.codMesa });
//   if (isActa) return res.status(400).send('Acta already register');

//   const task = new Task({
//     operacion: req.body.operacion,
//     user: {
//       _id: user._id,
//       fullName: user.fullName,
//     },
//     acta: {
//       _id: acta._id,
//       codMesa: acta.codMesa,
//     },
//   });

//   await task.save();

//   res.send(task);
// });

// router.delete('/:id', async (req, res) => {
//   const task = await Task.findByIdAndRemove(req.params.id);
//   if (!task)
//     return res.status(404).send('The task with the given ID was not found.');

//   res.send(task);
// });

// module.exports = router;
