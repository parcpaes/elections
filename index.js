//const winston = require('winston');
const config = require('config');
const express = require('express');
const cors = require('cors');
const app = express();


const bodyParser = require('body-parser');
//const methodOverride = require('method-override');

app.use(bodyParser.json());
//app.use(methodOverride('_method'));

app.set('view engine', 'ejs');

app.use(cors());
app.get('/',(req,res)=>{    
    res.render('index');    
})

//require('./startup/logging');
require('./startup/validation');
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config-jwt')()

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));