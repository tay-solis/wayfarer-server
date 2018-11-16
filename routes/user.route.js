const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const db = require('../models')

//Multer
const multer = require('multer');

const storage = multer.diskStorage({
    destination: './uploads/profilePics',
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`)
    }
  })

  const upload = multer({ storage: storage });


/////// SIGN UP //////
const userUpload = upload.fields([
   { name: 'firstName', maxCount: 1 },
   { name: 'lastName', maxCount: 1},
   { name: 'profilePic', maxCount: 1 },
   { name: 'email', maxCount: 1 },
   { name: 'username', maxCount: 1 },
   { name: 'city', maxCount: 1},
   { name: 'joinDate', maxCount: 1},
   { name: 'password', maxCount: 1 },
   ])

router.post('/signup', userUpload, function(req, res) {
   console.log(req.body)
   console.log(req.files)

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
                  joinDate: req.body.joinDate,
                  email: req.body.email  
               });

               user.profilePic = req.files.profilePic[0].path;

               
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
               // 

               
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


/////// LOG IN ///////
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
                    username: user.username,
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

/////// RETRIEVE USER INFO ///////
router.get('/:username', (req,res)=>{
   db.User.findOne({username: req.params.username})
   // .populate('Profile')
   .populate('Posts')
   .exec((err, user)=>{
      if (err) throw err;
      res.json(user);
   })
   // .catch((err)=>{
   //    res.status(404).send(err);
   // })  
});

module.exports = router;