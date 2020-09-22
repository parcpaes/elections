const admin = require('../middleware/admin-middleware');
const auth = require('../middleware/auth-middleware');
const {Recinto, validate} = require('../models/recinto');
const {Municipio} = require('../models/municipio');
const {Localidad} = require('../models/localidad');
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

    const municipio = await Municipio.findOne({_id: req.body.municipioId});
    if(!municipio) return res.status(400).send('Municipio was not found');

    const localidad = await Localidad.findOne({_id: req.body.localidadId});
    if(!localidad) return res.status(400).send('Localidad was not found');

    try{
      const recinto = new Recinto({    
        institucion: req.body.institucion,  
        tipo: req.body.tipo,
        numeroMesas:req.body.numeroMesas,
        municipio:  municipio,
        localidad: localidad,
        localizacion: req.body.localizacion
      });
      
      await recinto.save();
    
      res.send(recinto);
    }catch(error){
      res.send(error.message);
    }
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body); 
    console.log(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const municipio = await Municipio.findOne({_id: req.body.municipioId});
    if(!municipio) return res.status(400).send('Municipio was not found');

    const localidad = await Localidad.findOne({_id: req.body.localidadId});
    if(!localidad) return res.status(400).send('Localidad was not found');

    const recinto = await Recinto.findByIdAndUpdate(req.params.id,{
      institucion: req.body.institucion,  
      tipo: req.body.tipo,
      numeroMesas:req.body.numeroMesas,
      municipio:  municipio,
      localidad: localidad,
      localizacion: req.body.localizacion
    },{new:true});

  if (!recinto) return res.status(404).send('The recinto with the given ID was not found.');

  res.send(recinto); 
});

router.delete('/:id', [auth,admin],async (req, res) => {
    const recinto = await Recinto.findByIdAndRemove(req.params.id);  
    if (!recinto) return res.status(404).send('The recinto with the given ID was not found.');    

    res.send(recinto);
});


module.exports = router;