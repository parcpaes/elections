const {Recinto, validate} = require('../models/recinto');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    const recinto = await Recinto.find().sort('name');
  res.send(recinto);
});

router.get('/:id', async (req, res) => {
    const recinto = await Recinto.findById(req.params.id);  
    if (!recinto) return res.status(404).send('The recinto with the given ID was not found.');
    res.send(recinto);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const isRecinto = await Recinto.findOne({name: req.body.institucion});
  if(isRecinto) return res.status(400).send('Recinto already register');

  console.log(req.body);
  const recinto = new Recinto({    
    institucion: req.body.institucion,    
    tipo: req.body.tipo
  });
  
  await recinto.save();

  res.send(recinto);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const recinto = await Recinto.findByIdAndUpdate(req.params.id,{
      institucion:req.body.name,
      tipo: req.body.tipo
    },{new:true});

  if (!recinto) return res.status(404).send('The recinto with the given ID was not found.');

  res.send(recinto); 
});

router.delete('/:id', async (req, res) => {
    const recinto = await Recinto.findByIdAndRemove(req.params.id);  
    if (!recinto) return res.status(404).send('The recinto with the given ID was not found.');    

    res.send(recinto);
});


module.exports = router;