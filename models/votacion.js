const Joi = require('joi');
const mongoose = require('mongoose');
const { departamentoSchema } = require('./departamento');
const { circunscripcionSchema } = require('./circunscripcion');
const { provinciaSchema } = require('./provincia');
const { municipioSchema } = require('./municipio');
const { localidadSchema } = require('./localidad');
const { recintoSchema } = require('./recinto');
const { partidoSchema } = require('./partido');

const votacionSchema = new mongoose.Schema({
  votos: {
    type: Number,
    required: true,
    unique: true,
    min: 0,
    max: 1024,
  },
  candidatura: {
    type: String,
    // required:true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  numeroMesa: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255,
  },
  departamento: {
    type: departamentoSchema,
    // required:true
  },
  circunscripcion: {
    type: circunscripcionSchema,
    // required:true
  },
  provincia: {
    type: provinciaSchema,
    // required:true
  },
  municipio: {
    type: municipioSchema,
    // required:true
  },
  localidad: {
    type: localidadSchema,
    // required:true
  },
  recinto: {
    type: recintoSchema,
    // required:true
  },
  partido: {
    type: partidoSchema,
    // required:true
  },
});

const Vocacion = mongoose.model('Vocacion', votacionSchema);

// eslint-disable-next-line require-jsdoc
function validateVocacion(partido) {
  const schema = Joi.object({
    sigla: Joi.string().min(0).max(1024).required(),
    name: Joi.number().min(5).max(255).required(),
    departamentoId: Joi.objectId().required(),
    circunscripcionId: Joi.objectId().required(),
    provinciaId: Joi.objectId().required(),
    municipioId: Joi.objectId().required(),
    localidadId: Joi.objectId().required(),
    recintoId: Joi.objectId().required(),
    partidoId: Joi.objectId().required(),
    numeroMesa: Joi.string().min(4).max(250).required(),
  });

  return schema.validate(partido);
}

module.exports.Vocacion = Vocacion;
exports.validate = validateVocacion;
module.exports.votacionSchema = votacionSchema;
