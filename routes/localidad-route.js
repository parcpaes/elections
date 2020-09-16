const {Localidad, validate} = require('../models/localidad');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    const localidad = await Localidad.find().sort('name');
  res.send(localidad);
});

router.get('/:id', async (req, res) => {
    const localidad = await Localidad.findById(req.params.id);  
    if (!localidad) return res.status(404).send('The localidad with the given ID was not found.');
    res.send(localidad);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const isLocalidad = await Localidad.findOne({name: req.body.name});
  if(isLocalidad) return res.status(400).send('Localidad already register');

  const localidad = new Localidad({
    name: req.body.name    
  });
  
  await localidad.save();

  res.send(localidad);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const Localidad = await Localidad.findByIdAndUpdate(req.params.id,{
      name:req.body.name      
    },{new:true});

  if (!Localidad) return res.status(404).send('The Localidad with the given ID was not found.');

  res.send(Localidad); 
});

router.delete('/:id', async (req, res) => {
    const Localidad = await Localidad.findByIdAndRemove(req.params.id);  
    if (!Localidad) return res.status(404).send('The Localidad with the given ID was not found.');    

    res.send(Localidad);
});


module.exports = router;