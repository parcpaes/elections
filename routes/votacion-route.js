const { Votacion, validate } = require('../models/votacion');
const express = require('express');
const { Acta, validateActa } = require('../models/acta');
const { Circunscripcion } = require('../models/circunscripcion');
const { Recinto } = require('../models/recinto');
const mongoose = require('mongoose');
const _ = require('lodash');

const router = express.Router();

const mongoDb = mongoose.connection;
let session;
// console.log(mongoDb.eventNames());
mongoDb.once('open', function () {
  gridfsbucket = new mongoose.mongo.GridFSBucket(mongoDb.db);
});

router.get('/', async (req, res) => {
  const votacion = await Votacion.find();
  res.send(votacion);
});

router.get('/:id', async (req, res) => {
  const votacion = await Votacion.findById(req.params.id);
  if (!votacion)
    return res
      .status(404)
      .send('The votacion with the given ID was not found.');

  res.send(votacion);
});

router.post('/', async (req, res) => {
  const arrayVotacion = req.body;
  if (arrayVotacion.length)
    return res.status(400).send('La longitud de datos no es correcta ');

  const { errorActa } = validateActa(arrayVotacion[0]);
  if (errorActa) return res.status(400).send(errorActa.details[0].message);

  const isActa = await Acta.findOne(
    { codMesa: arrayVotacion[0].codMesa },
    { runValidators: true }
  );

  if (isActa) return res.status(400).send('Acta is already registered');
  // const session = await mongoose.startSession();

  try {
    const actaData = arrayVotacion[0];
    // session.startTransaction();
    const acta = new Acta(
      {
        horaApertura: actaData.horaApertura,
        horaCierre: actaData.horaCierre,
        codMesa: actaData.codMesa,
        empadronados: actaData.empadronados,
        estado: actaData.estado,
        observaciones: actaData.observaciones,
        // filename:actaData.filename,
      }
      // { session }
    );
    await acta.save();

    const listVotos = arrayVotacion[1][0];

    const isRecinto = await Recinto.findById(listVotos.recinto);
    if (!isRecinto) throw Error('Recinto is not found');

    const isCircunscription = await Circunscripcion.findById(
      listVotos.circunscripcion
    );
    if (!isCircunscription) throw Error('Circunscripcion is not found');

    const votos = arrayVotacion[1].map((voto, index) => {
      voto.circunscripcion = isCircunscription;
      voto.recinto = isRecinto;
      voto.acta = _.pick(acta, [
        '_id',
        'codMesa',
        'horaApertura',
        'horaCierre',
        'empadronados',
        'estado',
      ]);
      return voto;
    });
    const votacion = await Votacion.insertMany(votos, {
      ordered: false,
      // session,
    });

    // await session.commitTransaction();
    // session.endSession();
    res.send(votacion);
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();
    console.log(error);
    res.send('error de datos');
  }
});

router.put('/:id', async (req, res) => {
  //const { error } = validate(req.body);
  const arrayVotacion = req.body;
  if (arrayVotacion.length)
    return res.status(400).send('La longitud de datos no es correcta ');

  const { errorActa } = validateActa(arrayVotacion[0]);
  if (errorActa) return res.status(400).send(errorActa.details[0].message);
  //   const departamento = await Departamento.findByIdAndUpdate(
  //     req.params.id,
  //     {
  //       name: req.body.name,
  //     },
  //     { new: true }
  //   );

  //   if (!departamento)
  //     return res
  //       .status(404)
  //       .send('The departamento with the given ID was not found.');

  //   res.send(departamento);
});

module.exports = router;
