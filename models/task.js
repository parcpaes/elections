const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const { userSchema } = require('./user');
const { actaSchema } = require('./acta');
const taskNames = ['Enviado', 'Verificado', 'Anulado'];

const taskSchema = new mongoose.Schema({
  operacion: {
    type: String,
    required: true,
    enum: taskNames,
  },
  user: {
    type: userSchema,
    required: true,
  },
  acta: {
    type: actaSchema,
    required: true,
  },
  hora: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

const Task = mongoose.model('Task', taskSchema);

// eslint-disable-next-line require-jsdoc
function validateTask(task) {
  const schema = Joi.object({
    operacion: Joi.string()
      .valid(...taskNames)
      .required(),
    userId: Joi.objectId().required(),
    actaId: Joi.objectId().required(),
    hora: Joi.date().required(),
  });
  return schema.validate(task);
}

module.exports.Task = Task;
exports.validate = validateTask;
module.exports.taskSchema = taskSchema;
