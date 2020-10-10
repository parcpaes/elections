const { Votacion, validate } = require('../models/votacion');
const express = require('express');
const router = express.Router();
const { Recinto } = require('../models/recinto');
const { ObjectId } = require('mongoose').Types;
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const _ = require('lodash');
const { values } = require('lodash');

const listTypeElection = {
  presidente: 'Presidente y Vicepresidente',
  diputado: 'Diputados Uninominales',
  diputadoEspecial: 'Diputados Especiales',
};
// const firstMatch = {
//   'recinto._id': null,
//   'recinto.municipio._id': null,
//   'recinto.provincia._id': null,
//   'recinto.circunscripcion._id': null,
// };
const groupPipe = {
  $group: {
    _id: '$candidaturas.candidatura',
    CREEMOS: { $sum: '$candidaturas.CREEMOS' },
    ADN: { $sum: '$candidaturas.ADN' },
    MASIPSP: { $sum: '$candidaturas.MASIPSP' },
    FPV: { $sum: '$candidaturas.FPV' },
    PANBOL: { $sum: '$candidaturas.PANBOL' },
    LIBRE21: { $sum: '$candidaturas.LIBRE21' },
    CC: { $sum: '$candidaturas.CC' },
    votosValidos: { $sum: '$candidaturas.votosValidos' },
    votosBlancos: { $sum: '$candidaturas.votosBlancos' },
    votosNullos: { $sum: '$candidaturas.votosNullos' },
    actasValidas: { $sum: 1 },
    mesas: {
      $addToSet: {
        recintos: { id: '$recinto._id', mesas: '$recinto.totalMesas' },
      },
    },
  },
};
const projectPipe = {
  $project: {
    CREEMOS: { $multiply: [{ $divide: ['$CREEMOS', '$votosValidos'] }, 100] },
    ADN: { $multiply: [{ $divide: ['$ADN', '$votosValidos'] }, 100] },
    MASIPSP: { $multiply: [{ $divide: ['$MASIPSP', '$votosValidos'] }, 100] },
    FPV: { $multiply: [{ $divide: ['$FPV', '$votosValidos'] }, 100] },
    PANBOL: { $multiply: [{ $divide: ['$PANBOL', '$votosValidos'] }, 100] },
    LIBRE21: { $multiply: [{ $divide: ['$LIBRE21', '$votosValidos'] }, 100] },
    CC: { $multiply: [{ $divide: ['$CC', '$votosValidos'] }, 100] },
    votosValidos: 1,
    votosBlancos: 1,
    votosNullos: 1,
    actasValidas: 1,
    mesas: { $sum: '$mesas.recintos.mesas' },
    total: { $add: ['$votosValidos', '$votosBlancos', '$votosNullos'] },
  },
};
// eslint-disable-next-line require-jsdoc
const idType = (result, value, key) => {
  if (key == 'recinto') {
    result[`${key}._id`] = ObjectId(value);
  } else {
    result[`recinto.${key}._id`] = ObjectId(value);
  }
  return result;
};

const secondMatch = function (election) {
  return {
    $match: { 'candidaturas.candidatura': listTypeElection[election] },
  };
};

router.get('/', async (req, res) => {
  const { error } = validateQuery(req.query);

  if (error) return res.status(400).send(error.details[0].message);
  try {
    const firstMatch = _.chain(req.query)
      .omit(['eleccion'])
      .reduce(idType, {})
      .value();
    firstMatch.estado = 'Verificado';

    const election = secondMatch(req.query.eleccion);
    // console.log(firstMatch);

    const votacion = await Votacion.aggregate([
      {
        $match: firstMatch,
      },
      {
        $unwind: '$candidaturas',
      },
      election,
      groupPipe,
      projectPipe,
    ]);
    res.send(votacion);
  } catch (error) {
    console.log(error);
  }
});

const groupPipeWiner = {
  $group: {
    _id: '$candidaturas.candidatura',
    CREEMOS: { $push: '$candidaturas.CREEMOS' },
    ADN: { $push: '$candidaturas.ADN' },
    MASIPSP: { $push: '$candidaturas.MASIPSP' },
    FPV: { $push: '$candidaturas.FPV' },
    PANBOL: { $push: '$candidaturas.PANBOL' },
    LIBRE21: { $push: '$candidaturas.LIBRE21' },
    CC: { $push: '$candidaturas.CC' },
    votosValidos: { $sum: '$candidaturas.votosValidos' },
    votosBlancos: { $sum: '$candidaturas.votosBlancos' },
    votosNullos: { $sum: '$candidaturas.votosNullos' },
    actasValidas: { $sum: 1 },
    listMesas: { $push: '$numeroMesa' },
    mesas: { $first: '$recinto.totalMesas' },
  },
};

router.get('/recinto/:id', async (req, res) => {
  const isRecinto = await Votacion.findOne({ 'recinto._id': req.params.id });
  if (!isRecinto) return res.status(400).send('Recinto no existe');
  const votacion = await Votacion.aggregate([
    {
      $match: { 'recinto._id': ObjectId(req.params.id) },
    },
    {
      $unwind: '$candidaturas',
    },
    { $match: { 'candidaturas.candidatura': 'Presidente y Vicepresidente' } },
    groupPipeWiner,
  ]);
  res.send(votacion);
});

router.get('/', async (req, res) => {
  const votacion = await Votacion.findById(req.params.id);
  if (!votacion)
    return res
      .status(404)
      .send('The Votacion with the given ID was not found.');

  res.send(votacion);
});

// eslint-disable-next-line require-jsdoc
function validateQuery(queryparams) {
  const schema = Joi.object({
    eleccion: Joi.string()
      .valid(...Object.keys(listTypeElection))
      .required(),
    recinto: Joi.objectId(),
    municipio: Joi.objectId(),
    provincia: Joi.objectId(),
    circunscripcion: Joi.objectId(),
  });
  return schema.validate(queryparams);
}
module.exports = router;
