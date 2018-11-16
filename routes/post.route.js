const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db = require('../models');


//Get individual post
router.get('/post/:id', (req,res)=>{
    console.log(`looking for post ${req.params.id}`)
    db.Post.findOne({_id: req.params.id})
    .populate({path: 'user', model: db.User})
    .exec((err, post)=>{
        if(err) throw err;
        res.json(post)
    })
})

//Get all posts from a user
router.get('/:username', (req, res)=>{
    console.log(`retrieving posts by ${req.params.username}`);
    db.User.findOne({username: req.params.username}, (err, user)=>{
        if(err) throw err;
        if (user === null){
            res.status(404).json({
                error: 'user not found'
            })
        } else{
            db.Post.find({user: user})
            .populate({path: 'user', model: db.User})
            .exec((err, posts)=>{
                if(err) throw err;
                res.json(posts)
            })
        }
    })
})

//Add a new post
router.post('/create', (req, res) => {
    console.log(`Creating post:`);
    console.log(req.body)
    let postData = {
        _id: new  mongoose.Types.ObjectId(),
        title: req.body.title,
        content: req.body.content,
        postedOn: req.body.postedOn,
    }
    

    db.Post.create(postData, (err, savedPost) => {
        if (err) throw err;
        db.User.findOne({
            username: req.body.user.username
        }, (err, savedUser) => {
            if (err) throw err;
            savedUser.posts.push(savedPost);
            savedUser.save((err, savedUser) => {
                if (err) throw err;
                console.log(`Saved post to ${savedUser.username}`)
            });
            savedPost.user = savedUser;
            savedPost.save((err, savedPost) => {
                if (err) throw err;
                console.log(`Saved ${savedPost}`)
            });
            res.json(savedPost)
        })
    });
});

module.exports = router;