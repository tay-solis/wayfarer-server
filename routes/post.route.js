const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db = require('../models');

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