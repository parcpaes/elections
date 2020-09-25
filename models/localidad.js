const Joi = require('joi');
const mongoose = require('mongoose');

const localidadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 100,
  },
});

const Localidad = mongoose.model('Localidad', localidadSchema);

function validateLocalidad(localidad) {
  const schema = Joi.object({
    name: Joi.string().min(4).max(100).required(),
  });

  return schema.validate(localidad);
}

module.exports.Localidad = Localidad;
exports.validate = validateLocalidad;
module.exports.localidadSchema = localidadSchema;
