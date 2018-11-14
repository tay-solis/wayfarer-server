const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.post('/signup', function(req, res) {
         const user = new User({
            _id: new  mongoose.Types.ObjectId(),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            city: req.body.city,
            email: req.body.email  
         });

         bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
              if(err) throw err;
              user.password = hash;
              user.save().then(function(result) {
                console.log(result);
                res.status(200).json({
                   success: 'New user has been created'
                });
             }).catch(err=> {
                res.status(500).json({
                   error: err
                });
             })
        })
         
   });
});


module.exports = router;