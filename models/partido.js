const Joi = require('joi');
const mongoose = require('mongoose');
const listTypeElection = [
  'Presidente y Vicepresidente',
  'Diputados Uninominales',
  'Diputados Especiales',
];

const partidoSchema = new mongoose.Schema({
  candidatura: {
    type: String,
    required: true,
    enum: listTypeElection,
  },
  CREEMOS: {
    type: Number,
    required: true,
    min: 0,
    max: 1024,
    default: 0,
  },
  ADN: {
    type: Number,
    required: true,
    min: 0,
    max: 1024,
    default: 0,
  },
  MASIPSP: {
    type: Number,
    required: true,
    min: 0,
    max: 1024,
    default: 0,
  },
  FPV: {
    type: Number,
    required: true,
    min: 0,
    max: 1024,
    default: 0,
  },
  PANBOL: {
    type: Number,
    required: true,
    min: 0,
    max: 1024,
    default: 0,
  },
  LIBRE21: {
    type: Number,
    required: true,
    min: 0,
    max: 1024,
    default: 0,
  },
  CC: {
    type: Number,
    required: true,
    min: 0,
    max: 1024,
    default: 0,
  },
  JUNTOS: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
    default: 0,
  },
  votosBlancos: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  votosNullos: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  votosValidos: {
    type: Number,
    required: true,
    min: 1,
    max: 1024,
  },
});

// const Partido = mongoose.model('Partido', partidoSchema);

// eslint-disable-next-line require-jsdoc
function validatePartido(partido) {
  const schema = Joi.object({
    candidatura: Joi.string()
      .valid(...listTypeElection)
      .required(),
    votosBlancos: Joi.number().min(0).max(255).required(),
    votosNullos: Joi.number().min(0).max(255).required(),
    CREEMOS: Joi.number().min(0).max(1024).required(),
    ADN: Joi.number().min(0).max(1024).required(),
    MASIPSP: Joi.number().min(0).max(1024).required(),
    FPV: Joi.number().min(0).max(1024).required(),
    PANBOL: Joi.number().min(0).max(1024).required(),
    LIBRE21: Joi.number().min(0).max(1024).required(),
    CC: Joi.number().min(0).max(1024).required(),
    JUNTOS: Joi.number().min(0).max(255),
    votosValidos: Joi.number().min(1).max(1024),
  });
  return schema.validate(partido);
}
exports.validatePartido = validatePartido;
module.exports.partidoSchema = partidoSchema;
