const { Votacion, validate } = require('../models/votacion');
const express = require('express');
const { Acta, validateActa } = require('../models/acta');
const { Circunscripcion } = require('../models/circunscripcion');
const { validatePartido } = require('../models/partido');
const { Recinto } = require('../models/recinto');
const mongoose = require('mongoose');
const _ = require('lodash');

const uploadFile = require('../middleware/gridfilesStorage-middleware');

const siglasParidos = [
  'CREEMOS',
  'ADN',
  'MASIPSP',
  'FPV',
  'PANBOL',
  'LIBRE21',
  'CC',
];

// eslint-disable-next-line new-cap
const router = express.Router();

const Joi = require('joi');
const images = ['image/png', 'image/jpeg', 'image/bmp', 'image/webp'];

const mongoDb = mongoose.connection;
let gridfsbucket;
// console.log(mongoDb.eventNames());
mongoDb.once('open', function () {
  gridfsbucket = new mongoose.mongo.GridFSBucket(mongoDb.db);
});

const idType = (id) => {
  // eslint-disable-next-line new-cap
  return mongoose.Types.ObjectId(id);
};

router.get('/recinto/:id', async (req, res) => {
  if (!req.params.id) return res.status(400).send('id null');
  try {
    const votacion = await Votacion.aggregate([
      {
        $match: { 'recinto._id': idType(req.params.id) },
      },
      {
        $project: {
          _id: 0,
          numeroMesa: 1,
          institucion: '$recinto.institucion',
          estado: 1,
        },
      },
    ]);
    res.send(votacion);
  } catch (error) {
    return res.status(400).send(error.message);
  }
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
  const dataVote = req.body;
  const isActa = await Acta.findOne(
    { codMesa: dataVote.codMesa }
    // { runValidators: true }
  );
  if (!isActa) return res.status(400).send('Acta is not found');

  try {
    const { errorParitdo } = validatePartido(dataVote.candidaturas);
    if (errorParitdo)
      return res.status(400).send(errorParitdo.details[0].message);
    if (!dataVote.candidaturas || !dataVote.candidaturas.length)
      return res.status(400).send('[candidaturas] is empty');

    const isRecinto = await Recinto.findById(dataVote.recinto, { mesas: 0 });
    if (!isRecinto) throw Error('Recinto is not found');

    dataVote.candidaturas.map(validarSumaVotosValidso);

    const votacion = await Votacion.insertMany([
      {
        numeroMesa: dataVote.numeroMesa,
        recinto: isRecinto,
        acta: _.pick(isActa, [
          '_id',
          'codMesa',
          'horaApertura',
          'horaCierre',
          'empadronados',
          'estado',
        ]),
        estado: dataVote.estado,
        candidaturas: dataVote.candidaturas,
      },
    ]);
    res.send(votacion);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

// eslint-disable-next-line require-jsdoc
function validarSumaVotosValidso(voto) {
  const sumVote = function sum(votosSum = 0, index) {
    if (index < 0) return votosSum;
    console.log(voto[siglasParidos[index]]);
    votosSum = votosSum + voto[siglasParidos[index]];
    return sum(votosSum, index - 1);
  };
  const total = sumVote(0, siglasParidos.length - 1);
  console.log('total serve: ' + total);
  console.log('total client: ' + voto.votosValidos);
  if (voto.votosValidos !== total)
    throw Error('Suma de votos valido es incorrectos : ' + voto.candidatura);
}

router.put('/:id', async (req, res) => {
  const dataVote = req.body;
  const isActa = await Acta.findOne(
    { codMesa: dataVote.codMesa }
    // { runValidators: true }
  );
  if (!isActa) return res.status(400).send('Acta is not found');

  try {
    const { errorParitdo } = validatePartido(dataVote.candidaturas);
    if (errorParitdo)
      return res.status(400).send(errorParitdo.details[0].message);

    if (!dataVote.candidaturas.length)
      return res.status(400).send('[candidaturas] is empty');

    const isRecinto = await Recinto.findById(dataVote.recinto, { mesas: 0 });
    if (!isRecinto) throw Error('Recinto is not found');

    dataVote.candidaturas.map(validarSumaVotosValidso);
    console.log(dataVote.estado);
    const votacion = await Votacion.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          numeroMesa: dataVote.numeroMesa,
          recinto: isRecinto,
          acta: _.pick(isActa, [
            '_id',
            'codMesa',
            'horaApertura',
            'horaCierre',
            'empadronados',
            'estado',
          ]),
          estado: dataVote.estado,
          candidaturas: dataVote.candidaturas,
        },
      },
      { new: true }
    );
    res.send(votacion);
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

module.exports = router;
