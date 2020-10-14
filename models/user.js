/* eslint-disable require-jsdoc */
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
    type: String,
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

function generatePassword() {
  return ((Math.PI * 7) / 2) * 100;
}

userSchema.statics.encryptPwd = async function (password = generatePassword()) {
  const salt = await bcrypt.genSalt();
  return await bcrypt.hash(password, salt);
};

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, rol: this.rol },
    config.get('jwtPrivateKey'),
    {
      expiresIn: '1h',
    }
  );
};

userSchema.statics.login = async function (name, password) {
  try {
    const user = await this.findOne({ name: name });
    if (!user) return null;
    const auth = await bcrypt.compare(password, user.password);
    if (auth) return user;
    return null;
  } catch (error) {
    console.log(errro.message);
  }
};

const User = mongoose.model('User', userSchema);

// eslint-disable-next-line require-jsdoc
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
module.exports.userSchema = userSchema;
