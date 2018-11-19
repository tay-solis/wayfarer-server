const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/wayfarer", {useNewUrlParser: true});

// module.exports.MODELNAME = require('./MODELFILE');
module.exports.Post = require('./Post')
module.exports.Profile = require('./Profile')
module.exports.User = require('./User')
module.exports.City = require('./City')
