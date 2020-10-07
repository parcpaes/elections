const Joi = require('joi');
const mongoose = require('mongoose');

const mesaSchema = new mongoose.Schema({
  mesa: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 512,
  },
  habilitados: {
    type: Number,
    required: true,
    min: 1,
    max: 1024,
  },
});

const Mesa = mongoose.model('Mesa', mesaSchema);

// eslint-disable-next-line require-jsdoc
function validateMesa(mesa) {
  const schema = Joi.object({
    mesa: Joi.number().min(1).max(512).required(),
    habilitados: Joi.number().min(1).max(1024).required(),
  });
  return schema.validate(mesa);
}

module.exports.Mesa = Mesa;
exports.validateMesa = validateMesa;
module.exports.mesaSchema = mesaSchema;
