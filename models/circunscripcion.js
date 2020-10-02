const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const { departamentoSchema } = require('./departamento');

const circunscripcionSchema = new mongoose.Schema({
  name: {
    type: Number,
    required: true,
    min: 1,
    max: 1024,
  },
  departamento: {
    type: departamentoSchema,
    required: true,
  },
});

const Circunscripcion = mongoose.model('Circunscripcion', circunscripcionSchema);

// eslint-disable-next-line require-jsdoc
function validateCircunscripcion(circunscripcion) {
  const schema = Joi.object({
    name: Joi.number().min(1).max(1024).required(),
    departamentoId: Joi.objectId().required(),
  });
  return schema.validate(circunscripcion);
}

module.exports.Circunscripcion = Circunscripcion;
exports.validate = validateCircunscripcion;
module.exports.circunscripcionSchema = circunscripcionSchema;
