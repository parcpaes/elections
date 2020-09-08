const Joi = require('joi');
const mongoose = require('mongoose');
const circunscripcionSchema = require('./circunscripcion');

const provinciaSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:4,
        maxlength:100,
        unique:true
    },
    circunscripcion:{
      type: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Circunscripcion'
        }
      ],
    }
});

const Provincia = mongoose.model('Provincia',provinciaSchema);

function validateProvincia(provincia) {
    const schema = Joi.object({
      name: Joi.string().min(5).max(100).required()      
    });
  
    return schema.validate(provincia);
  }

  module.exports.Provincia = Provincia;
  exports.validate = validateProvincia;
  module.exports.provinciaSchema = provinciaSchema;