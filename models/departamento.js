const Joi = require('joi');
const mongoose = require('mongoose');

const departamentoSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        minlength:4,
        maxlength:100
    }
});

const Departamento = mongoose.model('Departamento',departamentoSchema);

function validateDepartamento(departamento) {
    const schema = Joi.object({
      name: Joi.string().min(5).max(100).required()  
    });
    return schema.validate(departamento);
  }

  module.exports.Departamento = Departamento;
  exports.validate = validateDepartamento;
  module.exports.departamentoSchema = departamentoSchema;