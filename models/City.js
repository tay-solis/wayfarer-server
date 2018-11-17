const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CitySchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name:{
        type: String,
        default: ''
    },
    country:{
        type: String,
        default: 'Somewhere in the World...'
    },
    photo:{
        type: String,
        default: '#'
    },
    posts:[{
        type: Schema.Types.ObjectId,
        ref: 'posts'
    }], 
      
  });

const City = mongoose.model('City', CitySchema);

module.exports = City;