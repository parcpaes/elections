const mongoose = require('mongoose');
const Joi = require('joi');
// estado: [anulada:'true', cerrada[repeticion de nueva eleccion]]
//fecha de 1 noviembre
const actaSchema = new mongoose.Schema({
    horaApertura:{
        type:Date,
        required:true   
    },
    horaCierre:{
        type:Date,
        required:true
    },
    codMesa:{
        type:String,
        required:true,
        unique:true,
        minlength:4,
        maxlength:250,
    },    
    empadronados:{
        type:Number,
        min:1,
        max:1024,
        required:true
    },
    estado:{
        type:String,
        enum:['anulada','cerrada']
    },
    filename:{
        type:String,
        required:true,
    }    
});

const Acta = mongoose.model('Acta',actaSchema);

function validateActa(acta) {
    const schema = Joi.object({
      horaApertura: Joi.date().required(), 
      horaCierre: Joi.date().required(),
      codMesa: Joi.string().min(4).max(250).required(),
      empadronados:Joi.number().min(1).max(1024).required(), 
      filename: Joi.string()
    });

    return schema.validate(acta);
  }

  module.exports.Acta = Acta;
  exports.validate = validateActa;
  module.exports.actaSchema = actaSchema;