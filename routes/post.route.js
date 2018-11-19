const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db = require('../models');


/////// GET INDIVIDUAL POST ///////
router.get('/post/:id', (req, res) => {
    console.log(`looking for post ${req.params.id}`)
    db.Post.findOne({
            _id: req.params.id
        })
        .populate({
            path: 'user',
            model: db.User
        })
        .populate({
            path: 'city',
            model: db.City
        })
        .exec((err, post) => {
            if (err) throw err;
            res.json(post)
        })
})

/////// GET POSTS BY CITY ///////
router.get('/from/:cityname', (req, res) => {
    console.log(`retrieving posts about ${req.params.cityname}`);
    db.City.findOne({
        name: req.params.cityname
    }, (err, city) => {
        if (err) throw err;
        if (city === null) {
            res.status(404).json({
                error: 'city not found'
            })
        } else {
            db.Post.find({
                    city: city
                })
                .populate({
                    path: 'user',
                    model: db.User
                })
                .exec((err, posts) => {
                    if (err) return console.log(err);
                    res.json(posts)
                })
        }
    })
})

///////// GET POSTS BY USERNAME ///////
router.get('/author/:username', (req, res) => {
    console.log(`retrieving posts by ${req.params.username}`);
    db.User.findOne({
        username: req.params.username
    }, (err, user) => {
        if (err) throw err;
        if (user === null) {
            res.status(404).json({
                error: 'user not found'
            })
        } else {
            db.Post.find({
                    user: user
                })
                .populate({
                    path: 'user',
                    model: db.User
                })
                .populate({
                    path: 'city',
                    model: db.City
                })
                .exec((err, posts) => {
                    if (err) return console.log(err);
                    res.json(posts)
                })
        }
    })
})

/////// CREATE POST ///////
router.post('/create', (req, res) => {
    console.log(`Creating post:`);
    console.log(req.body)
    let postData = {
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        content: req.body.content,
        postedOn: req.body.postedOn,
    }


    db.Post.create(postData, (err, savedPost) => {
        if (err) throw err;
        db.City.findOne({
            name: req.body.city
        }, (err, savedCity) => {
            if (err) throw err;
            db.User.findOne({
                username: req.body.user.username
            }, (err, savedUser) => {
                if (err) throw err;
                savedCity.posts.push(savedPost);
                savedCity.save((err, savedCity) => {
                    if (err) throw err;
                    console.log(savedCity)
                });
                savedUser.posts.push(savedPost);
                savedUser.save((err, savedUser) => {
                    if (err) throw err;
                    console.log(savedUser)
                });
                savedPost.user = savedUser;
                savedPost.city = savedCity;
                savedPost.save((err, savedPost) => {
                    if (err) throw err;
                    console.log(`Saved ${savedPost}`)
                });
                res.json(savedPost)
            })
        })

    });
});

/////// EDIT A POST ///////
router.put('/edit/:id', (req, res) => {
    let postId = req.params.id;
    console.log(`Updating ${postId}...`);
    let updateBody = req.body;

    db.Post.findOneAndUpdate({
        _id: postId
    }, updateBody, {
        new: true
    }, (err, updatedPost) => {
        if (err) return console.log(`Could not update ${postId}: ${err}`);
        res.json(updatedPost);
    });

})

/////// DESTROY A POST ///////
router.delete('/delete/:id', (req, res) => {
    let postId = req.params.id;
    console.log(`Deleting ${postId}...`);
    db.Post.deleteOne({
        _id: postId
    }, (err, deletedPost) => {
        if (err) throw err;
        res.status(200).json({
            "Deleted Post": deletedPost
        })
    })

})

module.exports = router;