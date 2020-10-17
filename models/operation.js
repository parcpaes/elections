const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const taskNames = ['Enviado', 'Verificado', 'Anulada', 'Observado'];
const moment = require('moment-timezone');
const timezone = moment.tz('America/La_Paz');

const operationSchema = new mongoose.Schema({
  operacion: {
    type: String,
    required: true,
    enum: taskNames,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  acta: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Acta',
  },
  hora: {
    type: Date,
    required: true,
    default: timezone.format(),
  },
  ipadress: {
    type: String,
    required: true,
  },
});

const Operation = mongoose.model('Operation', operationSchema);

// eslint-disable-next-line require-jsdoc
function validateOpracion(task) {
  const schema = Joi.object({
    operacion: Joi.string()
      .valid(...taskNames)
      .required(),
    userId: Joi.objectId().required(),
    actaId: Joi.objectId().required(),
    hora: Joi.date().required(),
  });
  return schema.validate(task);
}

module.exports.Operation = Operation;
exports.validate = validateOpracion;
module.exports.operationSchema = operationSchema;
