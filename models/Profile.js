const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    bio: {
        type: String,
        default: ''
    },
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;