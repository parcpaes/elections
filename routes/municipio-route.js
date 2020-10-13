const { Municipio, validate } = require('../models/municipio');
const { Provincia } = require('../models/provincia');
const { Circunscripcion } = require('../models/circunscripcion');
const express = require('express');
const access = require('../middleware/admin-middleware');
const router = express.Router();
const { ObjectId } = require('mongoose').Types;

router.get('/', async (req, res) => {
  const municipio = await Municipio.find().sort('name');
  res.send(municipio);
});

const idType = (id) => {
  // eslint-disable-next-line new-cap
  return ObjectId(id);
};

router.get('/:id', async (req, res) => {
  const municipio = await Municipio.findById(req.params.id);
  if (!municipio)
    return res
      .status(404)
      .send('The municipio with the given ID was not found.');
  res.send(municipio);
});

router.post('/', access('createAny', 'municipios'), async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isMunicipio = await Municipio.findOne({ name: req.body.name });
  if (isMunicipio) return res.status(400).send('Municipio already register');

  const provincia = await Provincia.findOne({ _id: req.body.provinciaId });
  if (!provincia) return res.status(400).send('Provincia is not found');

  const listCircunscripcionsId = req.body.circunscripcions.map(
    getCastObjectIds
  );

  if (!listCircunscripcionsId)
    return res.status(400).send('provincia.circunscripcions is empty');

  const circunscripcions = await Circunscripcion.find({
    _id: { $in: listCircunscripcionsId },
  });

  const municipio = new Municipio({
    name: req.body.name,
    provincia: provincia,
    circunscripcions: circunscripcions,
  });

  await municipio.save();
  res.send(municipio);
});

// eslint-disable-next-line require-jsdoc
function getCastObjectIds(value) {
  return ObjectId(value);
}

router.put('/:id', access('updateAny', 'municipios'), async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const provincia = await Provincia.findOne({ _id: req.body.provinciaId });
  if (!provincia) return res.status(400).send('Provincia is not found');

  const listCircunscripcionsId = req.body.circunscripcions.map(
    getCastObjectIds
  );

  if (!listCircunscripcionsId)
    return res.status(400).send('provincia.circunscripcions is empty');

  const circunscripcions = await Circunscripcion.find({
    _id: { $in: listCircunscripcionsId },
  });

  const municipio = await Municipio.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        provincia: provincia,
        circunscripcions: circunscripcions,
      },
    },
    { new: true }
  );

  if (!municipio)
    return res
      .status(404)
      .send('The municipio with the given ID was not found.');

  res.send(municipio);
});

router.delete('/:id', access('deleteAny', 'municipios'), async (req, res) => {
  console.log(req.params.id);
  const municipio = await Municipio.findByIdAndRemove(req.params.id);
  if (!municipio)
    return res
      .status(404)
      .send('The municipio with the given ID was not found.');

  res.send(municipio);
});

module.exports = router;
