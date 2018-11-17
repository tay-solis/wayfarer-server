const db = require('./models');
const mongoose = require('mongoose');

db.City.deleteMany({}, (err, deletedCities)=>{
    if(err) throw err;
    db.User.deleteMany({}, (err, deletedUsers)=>{
        if(err) throw err;
        db.Post.deleteMany({}, (err, deletedPosts)=>{
            if(err) throw err;
            console.log('Database cleared.')
        })
    })
})