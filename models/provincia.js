const Joi = require('joi');
const mongoose = require('mongoose');
const { circunscripcionSchema } = require('./circunscripcion');

const provinciaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 100,
    // unique:true
  },
  circunscripciones: {
    type: [circunscripcionSchema],
    require: true,
  },
});

const Provincia = mongoose.model('Provincia', provinciaSchema);

// eslint-disable-next-line require-jsdoc
function validateProvincia(provincia) {
  const schema = Joi.object({
    name: Joi.string().min(4).max(100).required(),
    circunscripciones: Joi.array().min(1).required(),
  });
  return schema.validate(provincia);
}

module.exports.Provincia = Provincia;
module.exports.validate = validateProvincia;
module.exports.provinciaSchema = provinciaSchema;
