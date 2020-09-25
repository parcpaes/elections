const Joi = require('joi');
const mongoose = require('mongoose');
const recintoSchema = require('./recinto');

const mesaSchema = new mongoose.Schema({
  name: {
    type: Number,
    required: true,
    unique: true,
    min: 1,
    max: 1024,
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1,
    max: 1024,
  },
  recinto: {
    type: recintoSchema,
    // required:true
  },
});

const Mesa = mongoose.model('Mesa', mesaSchema);

function validateMesa(mesa) {
  const schema = Joi.object({
    name: Joi.number().min(1).max(500).required(),
    cantidad: Joi.number().min(1).max(1024).required(),
  });

  return schema.validate(mesa);
}

module.exports.Mesa = Mesa;
exports.validate = validateMesa;
module.exports.mesaSchema = mesaSchema;
