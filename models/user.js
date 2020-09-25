const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const roles = ['Admin', 'Operador', 'Control', 'Reportes'];

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true,
  },
  fullName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    unique: true,
  },
  telefono: {
    type: Number,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  rol: {
    type: String,
    enum: roles,
    required: true,
  },
  state: {
    type: Boolean,
    required: true,
  },
});

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.getSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
  const salt = await bcrypt.getSalt();
  this.password = await bcrypt.hash(this.password, salt);
  this.findOneAndUpdate(this._id, {
    password,
  });
  next();
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, rol: this.rol },
    config.get('jwtPrivateKey')
  );
};

userSchema.statics.login = async function (name, password) {
  const user = await this.findOne({ name });
  if (!user) return null;
  const auth = await bcrypt.compare(password, user.password);
  if (auth) return user;
  return null;
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(4).max(255).required(),
    fullName: Joi.string().min(5).max(255).required(),
    telefono: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
    rol: Joi.string()
      .valid(...roles)
      .required(),
    state: Joi.boolean().required(),
  });
  return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;
