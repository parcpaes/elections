// const winston = require('winston');
// const config = require('config');

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const path = require('path');
const bodyParser = require('body-parser');
// const methodOverride = require('method-override');
// const helmet = require('helmet');
// app.use(helmet());

app.use(bodyParser.json());
// app.use(methodOverride('_method'));

// app.set('view engine', 'ejs');
app.use(cors());
app.set('trust proxy',true);
app.use(cookieParser());
// require('./startup/logging');
require('./startup/config-jwt')();
require('./startup/validation');
require('./startup/routes')(app);
require('./startup/db')();

// app.use(cors());

app.use(express.static(path.join(__dirname, '/dist')));
app.get('*', (req, res) => res.sendFile(path.join(__dirname)));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
