const { Votacion, validate } = require('../models/votacion');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const votacion = await Votacion.aggregate([
    {
      $match: {},
    },
  ]);
  res.send(votacion);
});

router.get('/:id', async (req, res) => {
  const votacion = await Votacion.findById(req.params.id);
  if (!votacion)
    return res
      .status(404)
      .send('The Votacion with the given ID was not found.');

  res.send(votacion);
});

module.exports = router;
