/* eslint-disable require-jsdoc */
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const { recintoSchema } = require('./recinto');
const mongoose = require('mongoose');

const recintoSchemaU = recintoSchema.clone();
recintoSchemaU.remove('localizacion');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  recintos: [
    {
      type: recintoSchemaU,
      required: true,
    },
  ],
});

const Task = mongoose.model('Task', taskSchema);
// eslint-disable-next-line require-jsdoc
function validateTask(task) {
  const schema = Joi.object({
    userId: Joi.objectId().required(),
    recintos: Joi.array().min(1).max(10).required(),
  });
  return schema.validate(task);
}

module.exports.Task = Task;
module.exports.validateTask = validateTask;
