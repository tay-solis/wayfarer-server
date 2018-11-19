const express = require('express');
const path = require('path')
const app = express();
const port = process.env.PORT || 4000;
const db = require('./models');


//JSON to url parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


//Mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/jwtauth', {
    useNewUrlParser: true
});

//CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
    next();
});

//Static Files and Image Upload Paths
app.use(express.static('public'));
app.use('/uploads', express.static(__dirname + '/uploads'))

// Auth Routes
const user = require('./routes/user.route');
app.use('/user', user);

// Post Routes
const posts = require('./routes/post.route');
app.use('/posts', posts);

// City Routes
const city = require('./routes/city.route');
app.use('/city', city);

// Home Route for Testing
app.get('/', (req, res) => {
    res.send('hey')
});

app.listen(port, () => {
    console.log(`Wayfarer server is listening on port:${port}`);
})