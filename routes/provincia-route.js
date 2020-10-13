// const auth = require('../middleware/auth-middleware');
const { Provincia, validate } = require('../models/provincia');
const {
  Circunscripcion,
  circunscripcionSchema,
} = require('../models/circunscripcion');
const access = require('../middleware/admin-middleware');

const express = require('express');
const mongoose = require('mongoose');
/* eslint-disable new-cap */
const router = express.Router();

const idType = (id) => {
  // eslint-disable-next-line new-cap
  return mongoose.Types.ObjectId(id);
};

router.get('/', async (req, res) => {
  const provincia = await Provincia.find();
  res.send(provincia);
});

router.get('/:id', async (req, res) => {
  const provincia = await Provincia.findById(req.params.id);
  if (!provincia)
    return res
      .status(404)
      .send('The provincia with the given ID was not found.');
  res.send(provincia);
});

router.post('/', access('createAny', 'provincias'), async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isProvincia = await Provincia.findOne({ name: req.body.name });
  if (isProvincia) return res.status(400).send('Provincia already register');

  const listCircunscripcionsId = [];
  req.body.circunscripcions.forEach((value) => {
    listCircunscripcionsId.push(idType(value));
  });
  if (!listCircunscripcionsId)
    return res.status(400).send('provincia.circunscripcions is empty');

  const circunscripcions = await Circunscripcion.find(
    {
      _id: { $in: listCircunscripcionsId },
    },
    { name: 1, departamento: 1 }
  );

  const provincia = new Provincia({
    name: req.body.name,
    circunscripcions: circunscripcions,
  });

  await provincia.save();
  res.send(provincia);
});

router.put('/:id', access('updateAny', 'provincias'), async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const listCircunscripcionsId = [];
  req.body.circunscripcions.forEach((value) => {
    listCircunscripcionsId.push(idType(value));
  });
  if (!listCircunscripcionsId)
    return res.status(400).send('provincia.circunscripcions is empty');

  const circunscripcions = await Circunscripcion.find(
    {
      _id: { $in: listCircunscripcionsId },
    },
    { name: 1, departamento: 1 }
  );
  const provincia = await Provincia.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        circunscripcions: circunscripcions,
      },
    },
    { new: true }
  );

  if (!provincia)
    return res
      .status(404)
      .send('The provincia with the given ID was not found.');

  res.send(provincia);
});

router.delete('/:id', access('deleteAny', 'provincias'), async (req, res) => {
  const provincia = await Provincia.findByIdAndRemove(req.params.id);
  if (!provincia)
    return res
      .status(404)
      .send('The provincia with the given ID was not found.');

  res.send(provincia);
});

module.exports = router;
