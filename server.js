const express = require('express');
const path = require('path')
const app = express();
const port = process.env.PORT || 4000;
const db = require('./models');


//Parses json to url
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());


//Mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/jwtauth', { useNewUrlParser: true });

//CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    next();
});

app.use(express.static('public'));
app.use('/uploads', express.static(__dirname + '/uploads'))

// Auth Routes
const user = require('./routes/user.route');
app.use('/user', user);

//User Profile
// const profile = require('./routes/profile.route');
// app.use('/profile', profile);

// app.get('/profile/:username', (req,res )=>{
//     db.User.findOne({username: username}, (err, user)=>{
//         if (err) throw err;
//         if (user === null){
//             res.status(404).json({
//                 error: "User not found."
//             })
//         } else {
//             db.Profile.findOne({user: user})
//                 .populate('User')
//                 .populate('Posts')
//                 .exec((err, profile)=>{
//                     if (err) throw err;
//                     res.json(profile);
//                 })
//         }
//     })
    
// });

app.get('/', (req, res) => {
    res.send('hey')
});

app.listen(port, () => {
    console.log(`Wayfarer server is listening on port:${port}`);
})