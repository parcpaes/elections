const mongoose = require('mongoose');
// const winston = require('winston');
const mongoURL = 'mongodb+srv://paes:9876543210@cluster0.5etmh.mongodb.net/election?retryWrites=true&w=majority';

module.exports = function conectionDB() {
  mongoose
    .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDb.. '));

  mongoose.set('useCreateIndex', true);
};
