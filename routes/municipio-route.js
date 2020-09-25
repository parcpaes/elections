const { Municipio, validate } = require('../models/municipio');
const { Provincia } = require('../models/provincia');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const municipio = await Municipio.find().sort('name');
  res.send(municipio);
});

router.get('/:id', async (req, res) => {
  const municipio = await Municipio.findById(req.params.id);
  if (!municipio)
    return res
      .status(404)
      .send('The municipio with the given ID was not found.');
  res.send(municipio);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isMunicipio = await Municipio.findOne({ name: req.body.name });
  if (isMunicipio) return res.status(400).send('Municipio already register');

  const provincia = await Provincia.findOne({ _id: req.body.provinciaId });
  if (!provincia) return res.status(400).send('Provincia is not found');

  const municipio = new Municipio({
    name: req.body.name,
    provincia: provincia,
  });

  await municipio.save();

  res.send(municipio);
});

router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const provincia = await Provincia.findOne({ _id: req.body.provinciaId });
  console.log(provincia);
  if (!provincia) return res.status(400).send('Provincia is not found');

  const municipio = await Municipio.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      provincia: provincia,
    },
    { new: true }
  );

  if (!municipio)
    return res
      .status(404)
      .send('The municipio with the given ID was not found.');

  res.send(municipio);
});

router.delete('/:id', async (req, res) => {
  console.log(req.params.id);
  const municipio = await Municipio.findByIdAndRemove(req.params.id);
  if (!municipio)
    return res
      .status(404)
      .send('The municipio with the given ID was not found.');

  res.send(municipio);
});

module.exports = router;
