const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db = require('../models');

//Multer for File Uploads
const multer = require('multer');

const storage = multer.diskStorage({
    destination: './uploads/cityPics',
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({
    storage: storage
});


/////// CREATE A NEW CITY ///////
const cityUpload = upload.fields([{
        name: 'name',
        maxCount: 1
    },
    {
        name: 'photo',
        maxCount: 1
    },
])

router.post('/create', cityUpload, (req, res) => {
    console.log(req.body)
    db.City.findOne({
        name: req.body.name
    }, (err, city) => {
        if (err) throw err;
        if (city === null) {
            console.log(`creating ${req.body.name}`)
            let cityData = {
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                country: req.body.country,
                photo: req.files.photo[0].path
            }
            db.City.create(cityData, (err, newCity) => {
                if (err) throw err;
                res.status(200).json(newCity);
            })
        } else {
            res.status(403).json({
                error: 'City exists with that name.'
            })
        }
    });
});

/////// GET ALL CITIES ///////
router.get('/all', (req, res) => {
    console.log('retrieving all cities')
    db.City.find({})
        .exec((err, cities) => {
            if (err) throw err;
            res.json(cities)
        })
})

/////// GET INFO ON ONE CITY ///////
router.get('/:name', (req, res) => {
    console.log(`retrieving ${req.params.name}`);
    db.City.findOne({
        name: req.params.name
    }, (err, city) => {
        if (err) throw err;
        res.json(city);
    })
})

module.exports = router;