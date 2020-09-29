const express = require('express');

const departamentoRoute = require('../routes/departamento-route');
const circunscripcionRoute = require('../routes/circunscripcion-route');
const provinciaRoute = require('../routes/provincia-route');
const municipioRoute = require('../routes/municipio-route');
const localidadRoute = require('../routes/localidad-route');
const recintoRoute = require('../routes/recinto-route');
const partidoRoute = require('../routes/partido-route');
const actaRoute = require('../routes/acta-route');
const userRoute = require('../routes/user-route');
const authRoute = require('../routes/auth-route');
const voteRoure = require('../routes/votacion-route');

const error = require('../middleware/error-middleware');

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/auth', authRoute);
  app.use('/api/users', userRoute);
  app.use('/api/departamentos', departamentoRoute);
  app.use('/api/circunscripcions', circunscripcionRoute);
  app.use('/api/provincias', provinciaRoute);
  app.use('/api/municipios', municipioRoute);
  app.use('/api/localidades', localidadRoute);
  app.use('/api/recintos', recintoRoute);
  // app.use('/api/partidos', partidoRoute);
  app.use('/api/actas', actaRoute);
  app.use('/api/votacion', voteRoure);
  app.use(error);
};
