const express = require('express');
const path = require('path')
const app = express();
const port = process.env.PORT || 4000;


//Parses json to url
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());

//Multer
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

var cpUpload = upload.fields([{ name: 'firstName', maxCount: 1 }, { name: 'profilePic', maxCount: 1 }])
app.post('/test', cpUpload, (req, res, next) => {
    console.log('Body = ', req.body);
    console.log('Files = ', req.files);
    res.status(200).json({
        body: req.body,
        file: req.files
    });
    // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
  //
  // e.g.
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  //
  // req.body will contain the text fields, if there were any
})


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

// Auth Routes
const user = require('./routes/user.route');
app.use('/user', user);

app.get('/', (req, res) => {
    res.send('hey')
});

app.listen(port, () => {
    console.log(`Wayfarer server is listening on port:${port}`);
})