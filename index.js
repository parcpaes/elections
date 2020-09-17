//const winston = require('winston');
const config = require('config');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

//require('./startup/logging');
require('./startup/validation');
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config-jwt')()

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));