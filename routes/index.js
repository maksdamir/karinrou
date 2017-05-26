var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Gallery = require('../models/gallery');
var Photo = require('../models/photo');

router.get('/', function(req, res, next) {
    Gallery.find({},{},function(e,galleries){
        res.render('index', {
            "galleries_row_1" : galleries.slice(0,3),
            "galleries_row_2" : galleries.slice(3,6),
            "galleries_row_3" : galleries.slice(6,7)
        });
    });
});

router.get('/photos', function(req, res) {
	Photo.find({},{}, function(e, photos) {
		console.log(photos);
		res.render('photos', {
			"photos" : photos
		});
	});
});

router.post('/photos', function(req, res) {
	var new_photo = new Photo(req.body);
	new_photo.save(function(err, photo) {
		if (err)
			res.send(err);
		res.json(photo);
	});
});

router.get('/galleries', function(req, res) {
	// TODO: redirect if not admin 
	// res.redirect('/');

    Gallery.find({},{},function(e,galleries){
    	console.log(galleries);
    	Photo.find({ '_id' : { $in: [galleries[0].photos]} }, {}, function(e2, photos) {
    		console.log(photos);
	        res.render('galleries', {
	            "galleries" : galleries
	        });
    	});
    });
});

router.post('/galleries', function(req, res) {
	var new_gallery = new Gallery(req.body);
	new_gallery.save(function(err, gallery) {
		if (err)
			res.send(err);
		res.json(gallery);
	});
});

router.get('/galleries/:gallery_name', function(req, res) {
    Gallery.find({ name:req.params.gallery_name },{},function(e,gallery){
        res.render('gallery', {
            "gallery" : gallery
        });
    });
});

router.put('/galleries/:gallery_id', function(req, res) {
	Gallery.findOneAndUpdate(req.params.galleryId, req.body, {new: true}, function(err, gallery) {
		if (err)
			res.send(err);
		res.json(gallery);
	});
});



module.exports = router;
