const Joi = require('joi');
const mongoose = require('mongoose');
const estadoMesa = ['Sin Aperturar', 'Aperturado', 'Anulada'];
const delegado = ['false', 'true'];
const mesaSchema = new mongoose.Schema({
  mesa: {
    type: Number,
    required: true,
    // unique: true,
    // trim:true,
    // sparse: true,
    // index:true,
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
    enum: delegado,
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
    delegado: Joi.string().valid(...delegado),
  });
  return schema.validate(mesa);
}

module.exports.Mesa = Mesa;
exports.validateMesa = validateMesa;
module.exports.mesaSchema = mesaSchema;
