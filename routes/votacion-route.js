const { Votacion, validate } = require('../models/votacion');
const express = require('express');
const { Acta, validateActa } = require('../models/acta');
const { Circunscripcion } = require('../models/circunscripcion');
const { validatePartido } = require('../models/partido');
const { Recinto } = require('../models/recinto');
const mongoose = require('mongoose');
const _ = require('lodash');

const uploadFile = require('../middleware/gridfilesStorage-middleware');

const router = express.Router();

const Joi = require('joi');
const images = ['image/png', 'image/jpeg', 'image/bmp', 'image/webp'];

const mongoDb = mongoose.connection;
let gridfsbucket;
// console.log(mongoDb.eventNames());
mongoDb.once('open', function () {
  gridfsbucket = new mongoose.mongo.GridFSBucket(mongoDb.db);
});

router.get('/recinto/:id', async (req, res) => {
  if (req.params.id) return res.status(400).send('id null');
  const votacion = await Votacion.aggregate([
    {
      $match: { "recinto._id": req.params.id }
    },
    {
      $project: {
        _id: 0,
        numeroMesa: 1,
        institucion: "$recinto.institucion",
        estado: 1
      }
    }
  ]);
  res.send(votacion);
});

router.get('/', async (req, res) => {
  const votacion = await Votacion.find();
  res.send(votacion);
});

router.get('/test/:id', async (req, res) => {
  // const { circunscripcionId, municipioId, provinciaId } = req.body;  
  console.log('test1 ..');
  const votacion = await Votacion.aggregate([
    {
      $match:
      {
        "circunscripcion._id": req.params.id,
        "circunscripcion.provincias": { $in: [ObjectId("5f5ac09ffa74ada37adf107a")] },
        "recinto.municipio._id": ObjectId("5f5ac0e1f770bc79cb72c0b7")
      }
    }
  ]);
  // "circunscripcion.provincias": { $in: [ObjectId("5f5ac09ffa74ada37adf107a")]}
  console.log(votacion);
  res.send("votacion");
})

router.get('/:id', async (req, res) => {
  const votacion = await Votacion.findById(req.params.id);
  if (!votacion)
    return res
      .status(404)
      .send('The votacion with the given ID was not found.');

  res.send(votacion);
});

router.post('/', uploadFile.single('file'), async (req, res) => {
  //console.log(req.file);
  // console.log(req.body);
  const arrayVotacion = JSON.parse(req.body.arrayVotacion);
  // if (!req.file) return res.status(400).send('Imagen is null');
  // const imagerror = validateImage({ contentType: req.file.contentType });
  // if (imagerror.error)
  //   return res.status(400).send(imagerror.error.details[0].message);
  if (arrayVotacion.length < 3)
    return res.status(400).send('La longitud de datos no es correcta');

  const { errorActa } = validateActa(arrayVotacion[0]);
  if (errorActa) return res.status(400).send(errorActa.details[0].message);

  const isActa = await Acta.findOne(
    { codMesa: arrayVotacion[0].codMesa },
    { runValidators: true }
  );

  // const isImage = await Acta.findOne({ filename: req.file.filename });
  // if (!isImage) return res.status(400).send('Imagen exist');

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
        filename: req.file.filename,
      }
      // { session }
    );

    const { errorParitdo } = validatePartido(arrayVotacion[2]);
    if (errorActa) return res.status(400).send(errorParitdo.details[0].message);
    console.log(arrayVotacion[1]);
    const votaciones = arrayVotacion[1];
    console.log(votaciones);
    const isRecinto = await Recinto.findById(votaciones.recinto);

    if (!isRecinto) throw Error('Recinto is not found');

    const isCircunscription = await Circunscripcion.findById(
      votaciones.circunscripcion
    );
    if (!isCircunscription) throw Error('Circunscripcion is not found');

    const paritosVotos = arrayVotacion[2];
    if (!paritosVotos.length) throw Error('Los votos estan vacios');

    await acta.save();
    const votacion = await Votacion.insertMany(
      [
        {
          numeroMesa: votaciones.numeroMesa,
          circunscripcion: isCircunscription,
          recinto: isRecinto,
          acta: _.pick(acta, [
            '_id',
            'codMesa',
            'horaApertura',
            'horaCierre',
            'empadronados',
            'estado',
          ]),
          estado: votaciones.estado,
          candidatura: paritosVotos,
        },
      ],
      {
        // session,
      }
    );

    // await session.commitTransaction();
    // session.endSession();
    res.send(votacion);
  } catch (error) {
    // await session.abortTransaction();
    // session.endSession();
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.put('/:id', async (req, res) => {
  // const { error } = validate(req.body);
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

// eslint-disable-next-line require-jsdoc
function validateImage(fileData) {
  const schema = Joi.object({
    contentType: Joi.string().valid(...images),
  });
  return schema.validate(fileData);
}

module.exports = router;
