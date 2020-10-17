const express = require('express');

const departamentoRoute = require('../routes/departamento-route');
const circunscripcionRoute = require('../routes/circunscripcion-route');
const provinciaRoute = require('../routes/provincia-route');
const municipioRoute = require('../routes/municipio-route');
const localidadRoute = require('../routes/localidad-route');
const recintoRoute = require('../routes/recinto-route');
const actaRoute = require('../routes/acta-route');
const userRoute = require('../routes/user-route');
const authRoute = require('../routes/auth-route');
const voteRoure = require('../routes/votacion-route');
const reportesRoute = require('../routes/reportes-route');
const taskRoute = require('../routes/task-route');
const error = require('../middleware/error-middleware');
const auth = require('../middleware/auth-middleware');

module.exports = function (app) {
  app.use(express.json());
  app.use('/api/auth', authRoute);
  // app.use(authVerify);
  app.use('/api/users', auth, userRoute);
  app.use('/api/tasks', auth, taskRoute);
  app.use('/api/departamentos', auth, departamentoRoute);
  app.use('/api/circunscripcions', auth, circunscripcionRoute);
  app.use('/api/provincias', auth, provinciaRoute);
  app.use('/api/municipios', auth, municipioRoute);
  app.use('/api/localidades', auth, localidadRoute);
  app.use('/api/recintos', auth, recintoRoute);
  // app.use('/api/partidos', partidoRoute);
  app.use('/api/actas', auth, actaRoute);
  app.use('/api/votacion', auth, voteRoure);
  app.use('/api/reportes', reportesRoute);
  app.use(error);
};
