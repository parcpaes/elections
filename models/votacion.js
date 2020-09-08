const Joi = require('joi');
const mongoose = require('mongoose');
const {mesaSchema} = require('./mesa');
const {departamentoSchema} = require('./departamento');
const {circunscripcionSchema} = require('./circunscripcion');
const {provinciaSchema} = require('./provincia');
const {municipioSchema} = require('./municipio');
const {localidadSchema} = require('./localidad');
const {recintoSchema} = require('./recinto');
const {partidoSchema} = require('./partido');

const votacionSchema = new mongoose.Schema({
    votos:{
        type:Number,
        required:true,
        unique:true,
        min:0,
        max:1024
    },
    candidatura:{
        type:String,
        //required:true,
        unique:true,
        minlength:5,
        maxlength:255
    },
    // empadronados:{
    //     type:Number,
    //     min:1,
    //     max:1024,
    //     required:true
    // }
    // acta
    // tiempoApertura:{
    //     type:Date,
    //     //required:true
    // },
    mesa:{
        type:mesaSchema,
        //required:true
    },
    departamento:{
        type:departamentoSchema,
        //required:true
    },
    circunscripcion:{
        type:circunscripcionSchema,
        //required:true
    },
    provincia:{
        type:provinciaSchema,
        //required:true
    },
    municipio:{
        type:municipioSchema,
        //required:true
    },
    localidad:{
        type:localidadSchema,
        //required:true
    },
    recinto:{
        type:recintoSchema,
        //required:true
    },
    partido:{
        type:partidoSchema,
        //required:true
    }
});

const Vocacion = mongoose.model('Vocacion',votacionSchema);

function validateVocacion(partido) {
    const schema = Joi.object({
        sigla: Joi.string().min(0).max(1024).required(),
        name: Joi.number().min(5).max(255).required(),
        departamentoId: Joi.objectId().required(),
        circunscripcionId: Joi.objectId().required(),
        provinciaId: Joi.objectId().required(),
        municipioId: Joi.objectId().required(),
        localidadId: Joi.objectId().required(),
        recintoId: Joi.objectId().required(),
        partidoId: Joi.objectId().required(),
        mesaId: Joi.objectId().required()
    });

    return schema.validate(partido);
  }

  module.exports.Vocacion = Vocacion;
  exports.validate = validateVocacion;
  module.exports.votacionSchema = votacionSchema;