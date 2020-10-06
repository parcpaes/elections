const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const { circunscripcionSchema } = require('./circunscripcion');
const { provinciaSchema } = require('./provincia');
const { municipioSchema } = require('./municipio');
const { localidadSchema } = require('./localidad');
const { mesaSchema } = require('./mesa');

const typeElection = ['Uninominal', 'Especial'];

const provinciaSchemaU = provinciaSchema.clone();
provinciaSchemaU.remove('circunscripcions');

const municipioSchemaU = municipioSchema.clone();
municipioSchemaU.remove('provincia');
municipioSchemaU.remove('circunscripcions');

const recintoSchema = new mongoose.Schema({
  institucion: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 255,
  },
  tipo: {
    type: [String],
    enum: typeElection,
    required: true,
  },
  circunscripcion: {
    type: circunscripcionSchema,
    required: true,
  },
  provincia: {
    type: provinciaSchemaU,
    required: true,
  },
  municipio: {
    type: municipioSchemaU,
    required: true,
  },
  localidad: {
    type: String,
    minlength: 4,
    maxlength: 255,
  },
  mesas: {
    type: [mesaSchema],
    required: true,
  },
  totalMesas: {
    type: Number,
    required: true,
    min: 1,
    max: 512,
  },
  totalHabilitados: {
    type: Number,
    min: 1,
    max: 1024,
  },
  localizacion: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
      index: '2dsphere',
    },
  },
});

// recintoSchema.pre('save', async (next) => {
//   const isExists = await this.constructor.findOne({
//     localizacion: { $in: this.localizacion },
//   });
//   if (isExists) throw Error('Localizaciones is already registered');
//   next();
// });

const Recinto = mongoose.model('Recinto', recintoSchema);

const mesaValidSchema = {
  mesa: Joi.number().min(1).max(512).required(),
  habilitados: Joi.number().min(1).max(1024).required(),
};
// eslint-disable-next-line require-jsdoc
function validateRecinto(recinto) {
  const schema = Joi.object({
    institucion: Joi.string().min(4).max(255).required(),
    tipo: Joi.array()
      .items(Joi.string().valid(...typeElection))
      .min(1)
      .required(),
    circunscripcionId: Joi.objectId().required(),
    provinciaId: Joi.objectId().required(),
    municipioId: Joi.objectId().required(),
    localidadId: Joi.string().min(4).max(255),
    mesas: Joi.array().min(1).items(Joi.object(mesaValidSchema)).required(),
    totalMesas: Joi.number().min(1).max(512).required(),
    totalHabilitados: Joi.number().min(1),
    localizacion: Joi.array().items(Joi.number()),
  });

  return schema.validate(recinto);
}

module.exports.Recinto = Recinto;
module.exports.recintoSchema = recintoSchema;
exports.validate = validateRecinto;
