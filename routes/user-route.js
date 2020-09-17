const auth = require('../middleware/auth-middleware');
const admin = require('../middleware/admin-middleware');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


router.get('/',async(req, res)=>{
    const user = await User.find().select('-password');
    res.send(user);
})
router.get('/me',auth , async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.post('/', async (req, res)=>{
    const { error } = validate(req.body);     
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({$or:[
            {name: req.body.name},
            {telefono: req.body.telefono}]});

    if(user) return res.status(400).send('User already register');
    
    user = new User(_.pick(req.body,['name','fullName','telefono','password','rol','state']));
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password,salt);
    
    await user.save();
    const token = user.generateAuthToken();
    res.header('x-auth-token',token).send(_.pick(user,['_id','name']));
});
 
router.put('/:id', async (req, res)=>{
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findByIdAndUpdate(req.params.id,{
      name:req.body.name,
      fullName: req.body.fullName,
      telefono: req.body.telefono,
      password:req.body.password,
      state: req.body.state
    },{new:true});

    if (!user) return res.status(404).send('The User with the given ID was not found.');

    res.send(user); 
});

module.exports = router;