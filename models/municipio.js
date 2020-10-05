const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const provinciaSchema = require('./provincia');
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
  circunscripcions: [
    {
      type: circunscripcionSchema,
      required: true,
    },
  ],
});

const Municipio = mongoose.model('Municipio', municipioSchema);

function validateMunicipio(municipio) {
  const schema = Joi.object({
    name: Joi.string().min(4).max(100).required(),
    provinciaId: Joi.objectId().required(),
  });

  return schema.validate(municipio);
}

module.exports.Municipio = Municipio;
module.exports.municipioSchema = municipioSchema;
exports.validate = validateMunicipio;
