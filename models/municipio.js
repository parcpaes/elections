const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const { provinciaSchema } = require('./provincia');
const { circunscripcionSchema } = require('./circunscripcion');
const municipioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 100,
  },
  provincia: {
    type: provinciaSchema,
    required: true,
  },
  circunscripciones: {
    type: [circunscripcionSchema],
    required: true,
  },
});

const Municipio = mongoose.model('Municipio', municipioSchema);

// eslint-disable-next-line require-jsdoc
function validateMunicipio(municipio) {
  const schema = Joi.object({
    name: Joi.string().min(4).max(100).required(),
    provinciaId: Joi.objectId().required(),
    circunscripciones: Joi.array().min(1).required(),
  });

  return schema.validate(municipio);
}

module.exports.Municipio = Municipio;
module.exports.municipioSchema = municipioSchema;
exports.validate = validateMunicipio;
