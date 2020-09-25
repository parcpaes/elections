// const winston = require('winston');
// const config = require('config');

const express = require('express');
const cors = require('cors');

const app = express();
const path = require('path');
const bodyParser = require('body-parser');
// const methodOverride = require('method-override');
app.use(bodyParser.json());
// app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(cors());

// require('./startup/logging');
require('./startup/validation');
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config-jwt')();

app.use(express.static(path.join(__dirname, '/dist/electionweb')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname)));

const port = process.env.PORT || 3300;
app.listen(port, () => console.log(`Listening on port ${port}...`));
