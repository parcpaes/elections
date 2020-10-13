//  const admin = require('../middleware/admin-middleware');
const auth = require('../middleware/auth-middleware');
const { Recinto, validate } = require('../models/recinto');
const { Circunscripcion } = require('../models/circunscripcion');
const { Provincia } = require('../models/provincia');
const { Municipio } = require('../models/municipio');
// const { Localidad } = require('../models/localidad');
const access = require('../middleware/admin-middleware');
const { validateMesa } = require('../models/mesa');
const express = require('express');
const _ = require('lodash');
// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', access('readAny', 'recintos'), async (req, res) => {
  const recinto = await Recinto.find();
  res.send(recinto);
});

router.get('/:id', access('readAny', 'recintos'), async (req, res) => {
  const recinto = await Recinto.findById(req.params.id);
  if (!recinto)
    return res.status(404).send('The recinto with the given ID was not found.');
  res.send(recinto);
});

router.post('/', access('createAny', 'recintos'), async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const circunscripcion = await Circunscripcion.findOne({
    _id: req.body.circunscripcionId,
  });

  if (!circunscripcion)
    return res.status(400).send('Circunscripcion was not found');

  const provincia = await Provincia.findOne({ _id: req.body.provinciaId });
  if (!provincia) return res.status(400).send('Provincia was not found');

  const municipio = await Municipio.findOne({ _id: req.body.municipioId });
  if (!municipio) return res.status(400).send('Municipio was not found');

  // const localidad = await Localidad.findOne({ _id: req.body.localidadId });
  // if (!localidad) return res.status(400).send('Localidad was not found');
  try {
    const localizacion = { type: 'Point', coordinates: req.body.localizacion };
    const recinto = new Recinto({
      institucion: req.body.institucion,
      tipo: req.body.tipo,
      circunscripcion: circunscripcion,
      provincia: _.pick(provincia, ['_id', 'name']),
      municipio: _.pick(municipio, ['_id', 'name']),
      localidad: req.body.localidad,
      mesas: req.body.mesas,
      totalMesas: req.body.totalMesas,
      totalHabilitados: req.body.totalHabilitados,
      localizacion: localizacion,
    });
    await recinto.save();

    res.send(recinto);
  } catch (error) {
    console.log(error);
    res.send(error.message);
  }
});

router.put('/:id', access('updateAny', 'recintos'), async (req, res) => {
  const { error } = validate(req.body);
  // console.log(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // console.log(req.body);
  const circunscripcion = await Circunscripcion.findOne({
    _id: req.body.circunscripcionId,
  });

  if (!circunscripcion)
    return res.status(400).send('Circunscripcion was not found');

  const provincia = await Provincia.findOne({ _id: req.body.provinciaId });
  if (!provincia) return res.status(400).send('Provincia was not found');

  const municipio = await Municipio.findOne({ _id: req.body.municipioId });
  if (!municipio) return res.status(400).send('Municipio was not found');

  // const localidad = await Localidad.findOne({ _id: req.body.localidadId });
  // if (!localidad) return res.status(400).send('Localidad was not found');

  const localizacion = { type: 'Point', coordinates: req.body.localizacion };
  const recinto = await Recinto.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        institucion: req.body.institucion,
        tipo: req.body.tipo,
        circunscripcion: circunscripcion,
        provincia: _.pick(provincia, ['_id', 'name']),
        municipio: _.pick(municipio, ['_id', 'name']),
        localidad: req.body.localidad,
        mesas: req.body.mesas,
        totalMesas: req.body.totalMesas,
        totalHabilitados: req.body.totalHabilitados,
        localizacion: localizacion,
      },
    },
    { new: true }
  );

  if (!recinto)
    return res.status(404).send('The recinto with the given ID was not found.');

  res.send(recinto);
});

router.put(
  '/:id/mesa',
  access('updateAny', 'recintos/id/mesa'),
  async (req, res) => {
    const { error } = validateMesa(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const isMesa = await Recinto.findOne({
      _id: req.params.id,
      mesas: { $elemMatch: { mesa: req.body.mesa } },
    });
    if (!isMesa) return res.status(400).send('La Mesa o Recinto no existe');
    const recinto = await Recinto.updateOne(
      { _id: req.params.id, mesas: { $elemMatch: { mesa: req.body.mesa } } },
      {
        $set: {
          'mesas.$.estado': req.body.estado,
          'mesas.$.delegado': req.body.delegado,
          'mesas.$.fecha': Date.now(),
        },
      }
    );
    if (!recinto)
      return res
        .status(404)
        .send('The recinto with the given ID was not found.');

    res.send(recinto);
  }
);

router.delete('/:id', access('deleteAny', 'recintos'), async (req, res) => {
  const recinto = await Recinto.findByIdAndRemove(req.params.id);
  if (!recinto)
    return res.status(404).send('The recinto with the given ID was not found.');

  res.send(recinto);
});

module.exports = router;
