const { Acta, validateActa } = require('../models/acta');
const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const mongoose = require('mongoose');
const uploadFile = require('../middleware/gridfilesStorage-middleware');

const Joi = require('joi');
const images = ['image/png', 'image/jpeg', 'image/bmp', 'image/webp'];

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

router.post('/image/:id', uploadFile.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('Imagen is null');
    const imagerror = validateImage({ contentType: req.file.contentType });
    if (imagerror.error)
      return res.status(400).send(imagerror.error.details[0].message);

    const acta = await Acta.findByIdAndUpdate(req.params.id, {
      filename: req.file.filename,
    }, { new: true });
    await acta.save();
    res.status(200).json(_.pick(acta, ['_id', 'codMesa']));
  } catch (error) {
    res.status(400).send('Error uploading  imagen acta');
  }
})

router.post('/', uploadFile.single('file'), async (req, res) => {
  const { error } = validateActa(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const isActa = await Acta.findOne({ codMesa: req.body.codMesa });
  if (isActa) return res.status(400).send('Acta already register');

  const acta = new Acta({
    codMesa: req.body.codMesa,
    horaApertura: req.body.horaApertura,
    horaCierre: req.body.horaCierre,
    empadronados: req.body.empadronados,
    estado: req.body.estado
  });
  await acta.save();
  res.send(acta);
});

router.put('/:id', uploadFile.single('file'), async (req, res) => {
  // console.log('update');
  const { error } = validateActa(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (!req.file) return res.status(400).send('Imagen is null');
  const imagerror = validateImage({ contentType: req.file.contentType });
  if (imagerror.error)
    return res.status(400).send(imagerror.error.details[0].message);

  const isActa = await Acta.findOne({ codMesa: req.body.codMesa });
  if (!isActa) return res.status(400).send('Acta is not found');

  const isImage = await Acta.findOne({ filename: req.file.filename });
  // if (!isImage) return res.status(400).send('Imagen exist');

  const acta = await Acta.findByIdAndUpdate(
    req.params.id,
    {
      codMesa: req.body.codMesa,
      horaApertura: req.body.horaApertura,
      horaCierre: req.body.horaCierre,
      empadronados: req.body.empadronados,
      estado: req.body.estado,
      filename: req.file.filename,
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

module.exports = router;
