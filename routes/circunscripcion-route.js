const {Circunscripcion, validate} = require('../models/circunscripcion');
const {Departamento} = require('../models/departamento');
const {Provincia} = require('../models/provincia');
const express = require('express');
const router = express.Router();
const Fawn = require('fawn');
const mongoose = require('mongoose');
Fawn.init(mongoose);

router.get('/', async (req, res) => {
    const circunscripcion = await Circunscripcion.find().sort('name')
        .populate("provincias","_id name");
  res.send(circunscripcion);
});

router.get('/:id', async (req, res) => {
    const circunscripcion = await Circunscripcion.findById(req.params.id)
        .populate("provincias","name");
    if (!circunscripcion) return res.status(404).send('The circunscripcion with the given ID was not found.');
    res.send(circunscripcion);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  const departamento = await Departamento.findById(req.body.departamentoId);
  if(!departamento) return res.status(400).send('Invalid Departamento');

  const provincias = await Provincia.find({_id:{$in:req.body.provincias}});
  if(!provincias) return status(400).send('Invalid Provincias');    

  const circunscripcion = new Circunscripcion({    
    name: req.body.name,
    departamento: {
      _id: departamento._id,
      name: departamento.name
    },
    provincias:req.body.provincias
  });  
  await circunscripcion.save();
  const result  = await Provincia.updateMany({_id: {$in: req.body.provincias}},{
    $push:{circunscripcions:[circunscripcion._id]}
  });
  res.send(circunscripcion);
});

router.put('/:id', async (req, res) => {    
    const { error } = validate(req.body); 

    const departamento = await Departamento.findById(req.body.departamentoId);
    if(!departamento) return res.status(400).send('Invalid Departamento');

    if (error) return res.status(400).send(error.details[0].message);
    
    const provincias = await Provincia.find({_id:{$in:req.body.provincias}});
    if(!provincias) return status(400).send('Invalid Provincias');
    
    const circunscripcion = await Circunscripcion.findByIdAndUpdate(req.params.id,{
      name:req.body.name,
      departamento:{
        _id: departamento._id,
        name: departamento.name
      },
      provincias:req.body.provincias
    },{new:true});

    if (!circunscripcion) return res.status(404).send('The circunscripcion with the given ID was not found.');
    
    const result  = await Provincia.updateMany({ $and:[{_id: {$in: req.body.provincias}}, {circunscripcions:{$nin:req.body.id}}]},{
         $push:{circunscripcions:[req.params.id]}
    });
    
    //console.log(result); 
   res.send(circunscripcion);
});


router.delete('/:id', async (req, res) => {
    const circunscripcion = await Circunscripcion.findByIdAndRemove(req.params.id);  
    if (!circunscripcion) return res.status(404).send('The circunscripcion with the given ID was not found.');    

    res.send(circunscripcion);
});


module.exports = router;