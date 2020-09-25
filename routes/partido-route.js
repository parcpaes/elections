const { Partido, validate } = require('../models/partido');
const express = require('express');

/* eslint-disable new-cap */
const router = express.Router();

router.get('/', async (req, res) => {
  const partido = await Partido.find().sort('name');
  res.send(partido);
});

router.get('/:id', async (req, res) => {
  const partido = await Partido.findById(req.params.id);
  if (!partido)
    return res.status(404).send('The partido with the given ID was not found.');
  res.send(partido);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isPartido = await Partido.findOne({ sigla: req.body.sigla });
  if (isPartido) return res.status(400).send('Partido already register');

  const partido = new Partido({
    sigla: req.body.sigla,
    name: req.body.name,
  });

  await partido.save();

  res.send(partido);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const partido = await Partido.findByIdAndUpdate(
    req.params.id,
    {
      sigla: req.body.sigla,
      name: req.body.name,
    },
    { new: true }
  );

  if (!partido)
    return res.status(404).send('The partido with the given ID was not found.');

  res.send(partido);
});

router.delete('/:id', async (req, res) => {
  const partido = await Partido.findByIdAndRemove(req.params.id);
  if (!partido)
    return res.status(404).send('The partido with the given ID was not found.');

  res.send(partido);
});

module.exports = router;
