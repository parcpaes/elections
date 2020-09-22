const {Mesa, validate} = require('../models/mesa');
const express = require('express');
const router = express.Router();


router.get('/', async (req, res) => {
    const mesa = await Mesa.find().sort('name');
  res.send(mesa);
});

router.get('/:id', async (req, res) => {
    const mesa = await Mesa.findById(req.params.id);  
    if (!mesa) return res.status(404).send('The mesa with the given ID was not found.');
    res.send(mesa);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const isMesa = await Mesa.findOne({codMesa: req.body.codMesa});
  if(isMesa) return res.status(400).send('Mesa already register');

  const mesa = new Mesa({    
    name: req.body.name,
    codMesa: req.body.codMesa,
    cantidad: req.body.cantidad   
  });
  
  await mesa.save();

  res.send(mesa);
});

router.put('/:id', async (req, res) => {
  //   const { error } = validate(req.body); 
  //   if (error) return res.status(400).send(error.details[0].message);

  //   const mesa = await Mesa.findByIdAndUpdate(req.params.id,{
  //       name: req.body.name,
  //       codMesa: req.body.codMesa,
  //       cantidad: req.body.cantidad  
  //   },{new:true});

  // if (!mesa) return res.status(404).send('The mesa with the given ID was not found.');

  // res.send(mesa); 
});

router.delete('/:id', async (req, res) => {
    const mesa = await Mesa.findByIdAndRemove(req.params.id);  
    if (!mesa) return res.status(404).send('The mesa with the given ID was not found.');    

    res.send(mesa);
});


module.exports = router;