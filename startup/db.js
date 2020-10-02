const mongoose = require('mongoose');
// const winston = require('winston');
const mongoURL = 'mongodb://localhost/election';

module.exports = function conectionDB() {
  mongoose
    .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true, autoIndex: false })
    .then(() => console.log('Connected to MongoDb.. '));

  mongoose.set('useCreateIndex', true);
};
