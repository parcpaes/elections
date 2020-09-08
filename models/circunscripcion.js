const Joi = require('joi');
const mongoose = require('mongoose');
const {departamentoSchema} = require('./departamento');
const {provinciaSchema} = require('./provincia');

const circunscripcionSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:4,
        maxlength:50
    },
    departamento:{
        type: departamentoSchema,
        required: true
    },
    provincias:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Provincia'
        }
    ]
});

const Circunscripcion = mongoose.model('Circunscripcion',circunscripcionSchema);

function validateCircunscripcion(circunscripcion) {
    const schema = Joi.object({
      name: Joi.string().min(5).max(50).required()      
      departamentoId: Joi.objectId().required(),
      //provincias: Joi.array().min(1).required()
    });  
    return schema.validate(circunscripcion);
  }

  module.exports.Circunscripcion = Circunscripcion;
  exports.validate = validateCircunscripcion;
  module.exports.circunscripcionSchema = circunscripcionSchema;