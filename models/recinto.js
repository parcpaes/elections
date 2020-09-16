const Joi = require('joi');
const mongoose = require('mongoose');
const {municipioSchema} = require('./municipio');
const {localidadSchema} = require('./localidad');

const recintoSchema = new mongoose.Schema({
    institucion:{
        type:String,
        required:true,
        minlength:4,
        maxlength:255
    },
    tipo:{
        type:[String],
        enum:["Uninominal","Especial"],
        required:true
    },
    numeroMesas:{
        type:[String],
        required:true
    },
    municipio:{
        type: municipioSchema,
        //required:true
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
      tipo: Joi.array().items().min(1).required(),
      numeroMesas: Joi.array().items().min(1).required()
    });

    return schema.validate(recinto);
  }

  module.exports.Recinto = Recinto;
  module.exports.recintoSchema = recintoSchema;
  exports.validate = validateRecinto;