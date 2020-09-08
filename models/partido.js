const Joi = require('joi');
const mongoose = require('mongoose');

const partidoSchema = new mongoose.Schema({
    sigla:{
        type:String,
        required:true,
        unique:true,
        minlength:2,
        maxlength:64
    },
    name:{
        type:String,
        //required:true,
        unique:true,
        minlength:2,
        maxlength:255
    },
    
});

const Partido = mongoose.model('Partido',partidoSchema);

function validatePartido(partido) {
    const schema = Joi.object({
      sigla: Joi.string().min(2).max(64).required(),
      name: Joi.string().min(2).max(255).required()
    });

    return schema.validate(partido);
  }

  module.exports.Partido = Partido;
  exports.validate = validatePartido;
  module.exports.partidoSchema = partidoSchema;