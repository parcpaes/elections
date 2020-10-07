const Joi = require('joi');
const mongoose = require('mongoose');
const { circunscripcionSchema } = require('./circunscripcion');

const circunscripcionSchemaU = circunscripcionSchema.clone();
circunscripcionSchemaU.remove('provincias');

const provinciaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 100,
    // unique:true
  },
  circunscripcions: [
    {
      type: circunscripcionSchemaU,
      required: true,
    },
  ],
});

const Provincia = mongoose.model('Provincia', provinciaSchema);

// eslint-disable-next-line require-jsdoc
function validateProvincia(provincia) {
  const schema = Joi.object({
    name: Joi.string().min(4).max(100).required(),
    circunscripcions: Joi.array()
      .min(1)
      .items(Joi.objectId().required())
      .required(),
  });
  return schema.validate(provincia);
}
module.exports.Provincia = Provincia;
module.exports.validate = validateProvincia;
module.exports.provinciaSchema = provinciaSchema;
