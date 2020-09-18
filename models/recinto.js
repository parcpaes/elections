const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const {municipioSchema} = require('./municipio');
const {localidadSchema} = require('./localidad');
const typeElection = ["Uninominal","Especial"];

const recintoSchema = new mongoose.Schema({
    institucion:{
        type:String,
        required:true,
        minlength:4,
        maxlength:255
    },
    tipo:{
        type:[String],
        enum:typeElection,
        required:true
    },
    numeroMesas:{
        type:Number,
        required:true,
        min:1,
        max:1024
    },
    municipio:{
        type: municipioSchema,
        required:true
    },
    localidad:{
        type:localidadSchema
    },
    localizacion:[
        {
            type:[Number],
            unique:true
        }
    ]
});



const Recinto = mongoose.model('Recinto',recintoSchema);

function validateRecinto(recinto) {
    const schema = Joi.object({
      institucion: Joi.string().min(4).max(255).required(),
      tipo: Joi.array().items(Joi.string().valid(...typeElection)).min(1).required(),
      numeroMesas: Joi.number().min(1).max(1024).required(),
      municipioId: Joi.objectId().required(),
      localidadId: Joi.objectId().required()
    });

    return schema.validate(recinto);
  }

  module.exports.Recinto = Recinto;
  module.exports.recintoSchema = recintoSchema;
  exports.validate = validateRecinto;