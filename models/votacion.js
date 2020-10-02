const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const { actaSchema } = require('./acta');
const { circunscripcionSchema } = require('./circunscripcion');
const { recintoSchema } = require('./recinto');
const { partidoSchema } = require('./partido');
const { Circunscripcion } = require('../models/circunscripcion');
const { Recinto } = require('../models/recinto');

const votationEstado = ['Enviado', 'Verificado', 'Anulada'];
const listTypeElection = [
  'Presidente y Vicepresidente',
  'Diputados Uninominales',
  'Diputados Especiales',
];

const votacionSchema = new mongoose.Schema({
  // votos: {
  //   type: Number,
  //   required: true,
  //   min: 1,
  //   max: 1024,
  // },
  candidaturas: {
    type: [partidoSchema],
    // required: true,
  },
  numeroMesa: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255,
  },
  circunscripcion: {
    type: circunscripcionSchema,
    // required: true,
  },
  recinto: {
    type: recintoSchema,
    // required: true,
  },
  acta: {
    type: actaSchema,
    required: true,
  },
  estado: {
    type: String,
    enum: votationEstado,
  },
});

const Votacion = mongoose.model('Votacion', votacionSchema);

// eslint-disable-next-line require-jsdoc
function validateVocacion(partido) {
  const schema = Joi.object({
    // votos: Joi.number().min(0).max(1024).required,
    numeroMesa: Joi.string().min(4).max(250).required(),
    circunscripcion: Joi.objectId().required(),
    recinto: Joi.objectId().required(),
    acta: Joi.objectId().required(),
    estado: Joi.string()
      .valid(...taskNames)
      .required(),
  });
  return schema.validate(partido);
}

module.exports.Votacion = Votacion;
exports.validate = validateVocacion;
module.exports.votacionSchema = votacionSchema;
