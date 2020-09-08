const express = require('express');
const departamento_route = require('../routes/departamento-route');
const provincia_route = require('../routes/provincia-route');
const municipio_route = require('../routes/municipio-route');
const localidad_route = require('../routes/localidad-route');
const recinto_route = require('../routes/recinto-route');
const partido_route = require('../routes/partido-route');

const error = require('../middleware/error-middleware');

module.exports = function(app){    
    app.use(express.json());
    app.use('/api/departamentos', departamento_route);     
    app.use('/api/provincias', provincia_route);
    app.use('/api/municipios',municipio_route);
    app.use('/api/localidades',localidad_route);
    app.use('/api/recintos',recinto_route);
    app.use('/api/partidos',partido_route);
    app.use(error);
}
