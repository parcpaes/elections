const Joi = require('joi');
const mongoose = require('mongoose');
const provinciaSchema = require('./provincia');

const municipioSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:4,
        maxlength:100
    },
    provincia:{
      type: provinciaSchema,
      //required: true
    }
});

const Municipio = mongoose.model('Municipio',municipioSchema);

function validateMunicipio(municipio) {
    const schema = Joi.object({
      name: Joi.string().min(5).max(100).required()      
    });
  
    return schema.validate(municipio);
  }

  module.exports.Municipio = Municipio;
  module.exports.municipioSchema = municipioSchema;
  exports.validate = validateMunicipio;