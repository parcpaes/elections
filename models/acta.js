const mongoose = require('mongoose');
const Joi = require('joi');
// estado: [anulada:'true', cerrada[repeticion de nueva eleccion]]
// fecha de 1 noviembre
const actaEstados = ['Anulada', 'Verificado', 'Enviado'];

const actaSchema = new mongoose.Schema({
  horaApertura: {
    type: Date,
    required: true,
  },
  horaCierre: {
    type: Date,
    required: true,
  },
  codMesa: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 250,
  },
  empadronados: {
    type: Number,
    min: 1,
    max: 1024,
    required: true,
  },
  estado: {
    type: String,
    enum: actaEstados,
  },
  observaciones: {
    type: String,
    minlength: 5,
  },
  filename: {
    type: String,
    // required: true,
  },
});
const Acta = mongoose.model('Acta', actaSchema);

// eslint-disable-next-line require-jsdoc
function validateActa(acta) {
  const schema = Joi.object({
    horaApertura: Joi.date().required(),
    horaCierre: Joi.date().required(),
    codMesa: Joi.string().min(4).max(250).required(),
    empadronados: Joi.number().min(1).max(1024).required(),
    observaciones: Joi.number().min(1).required(),
    estado: Joi.string().valid(...actaEstados),
    filename: Joi.string(),
  });
  return schema.validate(acta);
}

module.exports.Acta = Acta;
exports.validateActa = validateActa;
module.exports.actaSchema = actaSchema;
