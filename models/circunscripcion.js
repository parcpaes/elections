const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const { departamentoSchema } = require('./departamento');
const circunscripcionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  provincias: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provincia',
    },
  ],
  departamento: {
    type: departamentoSchema,
    required: true,
  },
});

const Circunscripcion = mongoose.model(
  'Circunscripcion',
  circunscripcionSchema
);

// eslint-disable-next-line require-jsdoc
function validateCircunscripcion(circunscripcion) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    departamentoId: Joi.objectId().required()
  });
  return schema.validate(circunscripcion);
}

module.exports.Circunscripcion = Circunscripcion;
exports.validate = validateCircunscripcion;
module.exports.circunscripcionSchema = circunscripcionSchema;
