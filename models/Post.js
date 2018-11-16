const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user:{
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    city:{
        type: Schema.Types.ObjectId,
        ref: 'city'
    },
    title:{
        type: String,
        default: ''
    },
    content:{
        type: String,
        default: ''
    }, 
    postedOn: Date,
      
  });

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;