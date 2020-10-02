// const auth = require('../middleware/auth-middleware');
const { Provincia, validate } = require('../models/provincia');
const express = require('express');

/* eslint-disable new-cap */
const router = express.Router();

router.get('/', async (req, res) => {
  const provincia = await Provincia.find();
  res.send(provincia);
});

router.get('/:id', async (req, res) => {
  const provincia = await Provincia.findById(req.params.id);
  if (!provincia) return res.status(404).send('The provincia with the given ID was not found.');
  res.send(provincia);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isProvincia = await Provincia.findOne({ name: req.body.name });
  if (isProvincia) return res.status(400).send('Provincia already register');

  const provincia = new Provincia({
    name: req.body.name,
    circunscripciones: req.body.circunscripciones,
  });
  await provincia.save();

  res.send(provincia);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const provincia = await Provincia.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        circunscripciones: req.body.circunscripciones,
      },
    },
    { new: true }
  );

  if (!provincia) return res.status(404).send('The provincia with the given ID was not found.');
  res.send(provincia);
});

router.delete('/:id', async (req, res) => {
  const provincia = await Provincia.findByIdAndRemove(req.params.id);
  if (!provincia) return res.status(404).send('The provincia with the given ID was not found.');

  res.send(provincia);
});

module.exports = router;
