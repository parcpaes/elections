const { Acta, validateActa } = require('../models/acta');
const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const mongoose = require('mongoose');
const uploadFile = require('../middleware/gridfilesStorage-middleware');
const _ = require('lodash');
const Joi = require('joi');
const images = ['image/png', 'image/jpeg', 'image/bmp', 'image/webp'];
const actaEstados = ['Anulada', 'Verificado', 'Enviado', 'Observado'];

const mongoDb = mongoose.connection;
let gridfsbucket;
// console.log(mongoDb.eventNames());
mongoDb.once('open', function () {
  gridfsbucket = new mongoose.mongo.GridFSBucket(mongoDb.db);
});

router.get('/', async (req, res) => {
  const acta = await Acta.find().sort('name');
  res.send(acta);
});

router.get('/:id', async (req, res) => {
  const acta = await Acta.findById(req.params.id);
  if (!acta)
    return res.status(404).send('The Acta with the given ID was not found.');
  res.send(acta);
});

router.get('/image/:id', async (req, res) => {
  const acta = await Acta.findById(req.params.id);
  if (!acta)
    return res.status(404).send('The Acta with the given ID was not found.');
  gridfsbucket.openDownloadStreamByName(acta.filename).pipe(res);
});

router.put('/image/:codMesa', uploadFile.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('Imagen is null');
    const imagerror = validateImage({ contentType: req.file.contentType });
    if (imagerror.error)
      return res.status(400).send(imagerror.error.details[0].message);

    const acta = await Acta.findOneAndUpdate(
      { codMesa: req.params.codMesa },
      {
        filename: req.file.filename,
      },
      { new: true }
    );

    res.status(200).json(_.pick(acta, ['_id', 'codMesa']));
  } catch (error) {
    console.log(error);
    res.status(400).send('Error uploading  imagen acta');
  }
});

router.post('/', async (req, res) => {
  const { error } = validateActa(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isActa = await Acta.findOne({ codMesa: req.body.codMesa });
  if (isActa) return res.status(400).send('Acta already register');

  const acta = new Acta({
    codMesa: req.body.codMesa,
    horaApertura: req.body.horaApertura,
    horaCierre: req.body.horaCierre,
    empadronados: req.body.empadronados,
    estado: req.body.estado,
    observaciones: req.body.observaciones,
  });
  await acta.save();
  res.send(acta);
});

router.put('/:id', async (req, res) => {
  // console.log('update');
  req.body.observaciones = '';
  // const { error } = validateActaUpdate(req.body);
  // if (error) return res.status(400).send(error.details[0].message);

  const isActa = await Acta.findOne({ codMesa: req.body.codMesa });
  if (!isActa) return res.status(400).send('Acta is not found');

  const acta = await Acta.findByIdAndUpdate(
    req.params.id,
    {
      codMesa: req.body.codMesa,
      empadronados: req.body.empadronados,
      estado: req.body.estado,
      observaciones: req.body.observaciones,
    },
    { new: true }
  );

  if (!acta)
    return res.status(404).send('The Acta with the given ID was not found.');

  res.send(acta);
});

router.delete('/:id', async (req, res) => {
  const acta = await Acta.findByIdAndRemove(req.params.id);
  if (!acta)
    return res.status(404).send('The acta with the given ID was not found.');

  res.send(acta);
});

// eslint-disable-next-line require-jsdoc
function validateImage(fileData) {
  const schema = Joi.object({
    //  _id:Joi.string(),
    //  length:Joi.number(),
    //  chunkSize:Joi.number(),
    //  uploadDate:Joi.date(),
    //  filename:Joi.string(),
    //  md5:Joi.string(),
    contentType: Joi.string().valid(...images),
  });
  return schema.validate(fileData);
}

// eslint-disable-next-line require-jsdoc
function validateActaUpdate(acta) {
  const schema = Joi.object({
    codMesa: Joi.string().min(4).max(250).required(),
    empadronados: Joi.number().min(1).max(1024).required(),
    estado: Joi.string().valid(...actaEstados)
  });
  return schema.validate(acta);
}

module.exports = router;
