const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/signup', function(req, res) {
   console.log('body----------------')
   console.log(req.body);
   console.log('params----------------')
   console.log(req.params);
   console.log('files----------------')
   console.log(req.files)
   console.log('file----------------')
   console.log(req.file)

   //Check if user exists with that username
   User.findOne({username: req.body.username}, (err, existingUser)=>{
      if (err) throw err;
      if(existingUser === null){
         User.findOne({email: req.body.email}, (err, existingEmail)=>{
            if(err) throw err;
            if(existingEmail === null){
               const user = new User({
                  _id: new  mongoose.Types.ObjectId(),
                  firstName: req.body.firstName,
                  lastName: req.body.lastName,
                  username: req.body.username,
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
            } else{
               console.log('Bad signup: Email already exists')
               res.status(403).json({
                  error: 'Email already exists'
               });
            }
         })
      } else{
         console.log('Bad signup: Username already exists')
               res.status(403).json({
                  error: 'Username already exists'
               });
      }
   })        
});

router.post('/login', function(req, res){

   User.findOne({username: req.body.username}, (err, user)=>{
      if(err) throw err;
      if (user !== null){
         bcrypt.compare(req.body.password, user.password, (err, result)=>{
            if (err) throw err;
            if(result) {
               const JWTToken = jwt.sign({
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profilePic: user.profilePic,
                    _id: user._id
                  },
                  'secret',
                   {
                     expiresIn: '2h'
                   });
                   return res.status(200).json({
                     success: 'Welcome back!',
                     token: JWTToken
                   });
              }
            return res.status(401).json({
               failed: 'Credentials not valid'
            });
         });
      } else {
         return res.status(403).json({
            error: 'Username not found.'
         });
      }
   });
});
module.exports = router;