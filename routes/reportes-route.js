const { Votacion, validate } = require('../models/votacion');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
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
        recintos: { id: '$recinto._id', mesas: '$recinto.numeroMesas' },
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
    votosBlancos: 1,
    votosNullos: 1,
    actasValidas: 1,
    mesas: { $sum: '$mesas.recintos.mesas' },
    total: { $add: ['$votosValidos', '$votosBlancos', '$votosNullos'] },
  },
};

const idType = (id) => {
  // eslint-disable-next-line new-cap
  return mongoose.Types.ObjectId(id);
};

router.get('/recinto/:id', async (req, res) => {
  const votacion = await Votacion.aggregate([
    {
      $match: {
        'recinto._id': idType(req.params.id),
        estado: 'Verificado',
      },
    },
    {
      $unwind: '$candidaturas',
    },
    {
      $match: { 'candidaturas.candidatura': 'Presidente y Vicepresidente' },
    },
    groupPipe,
    projectPipe,
  ]);
  res.send(votacion);
});

router.get('/:id', async (req, res) => {
  const votacion = await Votacion.findById(req.params.id);
  if (!votacion)
    return res
      .status(404)
      .send('The Votacion with the given ID was not found.');

  res.send(votacion);
});

module.exports = router;
