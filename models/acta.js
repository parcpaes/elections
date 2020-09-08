const mongoose = require('mongoose');
const {mesaSchema} = require('./mesa');
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
        type:mesaSchema,
        //required:true,        
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
    }
});

const Acta = mongoose.model('Acta',actaSchema);

function validateActa(mesa) {
    const schema = Joi.object({
      horaApertura: Joi.date().required(), 
      horaCierre: Joi.date().required(),
      codMesa: Joi.number().min(1).max(1024).required(),
      empadronados:Joi.number().min(1).max(1024).required()
    });

    return schema.validate(mesa);
  }

  module.exports.Acta = Acta;
  exports.validate = validateActa;
  module.exports.actaSchema = actaSchema;