const Joi = require('joi');
const mongoose = require('mongoose');
const estadoMesa = ['Sin Aperturar', 'Aperturado', 'Anulada'];
const mesaSchema = new mongoose.Schema({
  mesa: {
    type: Number,
    required: true,
    min: 1,
    max: 512,
  },
  habilitados: {
    type: Number,
    required: true,
    min: 1,
    max: 1024,
  },
  estado: {
    type: String,
    enum: estadoMesa,
    required: true,
    default: 'Sin Aperturar',
  },
  delegado: {
    type: String,
    default: 'false',
  },
  fecha: {
    type: Date,
    default: null,
    min: Date.now,
  },
});

const Mesa = mongoose.model('Mesa', mesaSchema);

// eslint-disable-next-line require-jsdoc
function validateMesa(mesa) {
  const schema = Joi.object({
    mesa: Joi.number().min(1).max(512).required(),
    estado: Joi.string().valid(...estadoMesa),
    delegado: Joi.string().minx(1).max(255),
  });
  return schema.validate(mesa);
}

module.exports.Mesa = Mesa;
exports.validateMesa = validateMesa;
module.exports.mesaSchema = mesaSchema;
