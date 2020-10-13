const { Departamento, validate } = require('../models/departamento');
const express = require('express');
const access = require('../middleware/admin-middleware');
const router = express.Router();

router.get('/', access('readAny', 'departamentos'), async (req, res) => {
  const departamento = await Departamento.find().sort('name');
  res.send(departamento);
});

router.get('/:id', access('readAny', 'departamentos'), async (req, res) => {
  const departamento = await Departamento.findById(req.params.id);
  if (!departamento)
    return res
      .status(404)
      .send('The departamento with the given ID was not found.');

  res.send(departamento);
});

router.post('/', access('createAny', 'departamentos'), async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isDepartamento = await Departamento.findOne({ name: req.body.name });
  if (isDepartamento)
    return res.status(400).send('Departamento already register');

  const departamento = new Departamento({
    name: req.body.name,
  });

  await departamento.save();

  res.send(departamento);
});

router.put('/:id', access('updateAny', 'departamentos'), async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const departamento = await Departamento.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
    },
    { new: true }
  );

  if (!departamento)
    return res
      .status(404)
      .send('The departamento with the given ID was not found.');

  res.send(departamento);
});

router.delete(
  '/:id',
  access('deleteAny', 'departamentos'),
  async (req, res) => {
    const departamento = await Departamento.findByIdAndRemove(req.params.id);
    if (!departamento)
      return res
        .status(404)
        .send('The departamento with the given ID was not found.');

    res.send(departamento);
  }
);

module.exports = router;
