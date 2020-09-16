const mongoose = require('mongoose');
//const winston = require('winston');
module.exports = function(){
    mongoose.connect('mongodb://localhost/election',{useNewUrlParser: true, useUnifiedTopology: true})
        .then(()=> console.log('Connected to MongoDb.. '));

    mongoose.set('useCreateIndex', true);
}