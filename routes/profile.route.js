const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db = require('../models');

router.post('/create', (req, res)=>{
    let profileData = req.body;
    console.log(`Creating Profile: ${profileData}`);

    db.Profile.create({

    }, (err, savedProfile)=>{

    })
});

router.get('/:username', (req,res)=>{
    db.User.findOne({username: req.params.username}, (err, user)=>{
        if (err) throw err;
        if (user === null){
            res.status(404).json({
                error: "User not found."
            })
        } else {
            db.Profile.findOne({user: user})
                .populate('Profile')
                .populate('Posts')
                .exec((err, profile)=>{
                    if (err) throw err;
                    res.json(profile);
                })
        }
    })  
});

module.exports = router;