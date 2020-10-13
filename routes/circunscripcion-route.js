const { Circunscripcion, validate } = require('../models/circunscripcion');
const { Departamento } = require('../models/departamento');
const access = require('../middleware/admin-middleware');
const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const Fawn = require('fawn');
const mongoose = require('mongoose');
Fawn.init(mongoose);

router.get('/', access('readAny', 'circunscripcions'), async (req, res) => {
  const circunscripcion = await Circunscripcion.find().populate(
    'provincias',
    'name'
  );
  res.send(circunscripcion);
});

router.get('/:id', access('readAny', 'circunscripcions'), async (req, res) => {
  const circunscripcion = await Circunscripcion.findById(req.params.id);
  if (!circunscripcion)
    return res
      .status(404)
      .send('The circunscripcion with the given ID was not found.');
  res.send(circunscripcion);
});

router.post('/', access('createAny', 'circunscripcions'), async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const circunscripcionName = await Circunscripcion.findOne({
    name: req.body.name,
  });
  if (circunscripcionName)
    return res.status(400).send('Circunscripcion is already registered');

  const departamento = await Departamento.findById(req.body.departamentoId);
  if (!departamento) return res.status(400).send('Invalid Departamento');

  const circunscripcion = new Circunscripcion({
    name: req.body.name,
    departamento: departamento,
  });

  await circunscripcion.save();
  res.send(circunscripcion);
});

router.put(
  '/:id',
  access('updateAny', 'circunscripcions'),
  async (req, res) => {
    const { error } = validate(req.body);

    const departamento = await Departamento.findById(req.body.departamentoId);
    if (!departamento) return res.status(400).send('Invalid Departamento');

    if (error) return res.status(400).send(error.details[0].message);

    const circunscripcion = await Circunscripcion.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        departamento: departamento,
      },
      { new: true }
    );

    if (!circunscripcion)
      return res
        .status(404)
        .send('The circunscripcion with the given ID was not found.');

    res.send(circunscripcion);
  }
);

router.delete(
  '/:id',
  access('deleteAny', 'circunscripcions'),
  async (req, res) => {
    const circunscripcion = await Circunscripcion.findByIdAndRemove(
      req.params.id
    );
    if (!circunscripcion)
      return res
        .status(404)
        .send('The circunscripcion with the given ID was not found.');

    res.send(circunscripcion);
  }
);

module.exports = router;
