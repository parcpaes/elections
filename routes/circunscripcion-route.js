const {Circunscripcion, validate} = require('../models/circunscripcion');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    const circunscripcion = await Circunscripcion.find().sort('name');
  res.send(circunscripcion);
});

router.get('/:id', async (req, res) => {
    const circunscripcion = await Circunscripcion.findById(req.params.id);  
    if (!circunscripcion) return res.status(404).send('The circunscripcion with the given ID was not found.');
    res.send(circunscripcion);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  const circunscripcion = new Circunscripcion({    
    name: req.body.name    
  });
  
  await circunscripcion.save();

  res.send(circunscripcion);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const circunscripcion = await Circunscripcion.findByIdAndUpdate(req.params.id,{
      name:req.body.name      
    },{new:true});

  if (!circunscripcion) return res.status(404).send('The circunscripcion with the given ID was not found.');

  res.send(circunscripcion); 
});

router.delete('/:id', async (req, res) => {
    const circunscripcion = await Circunscripcion.findByIdAndRemove(req.params.id);  
    if (!circunscripcion) return res.status(404).send('The circunscripcion with the given ID was not found.');    

    res.send(circunscripcion);
});


module.exports = router;