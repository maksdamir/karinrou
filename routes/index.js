var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Gallery = require('../models/gallery');
var Photo = require('../models/photo');

var path = require('path');
var formidable = require('formidable');
var fs = require('fs');

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'hf7ourhvw', 
  api_key: '926943892711519', 
  api_secret: '7VY3VBS0dvzXpDfwGm4aHnk4UZ8' 
});

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
		res.render('photos', {
			"photos" : photos
		});
	});
});

router.post('/photos', function(req, res) {
	// create an incoming form object
	var form = new formidable.IncomingForm();

	// specify that we want to allow the user to upload multiple files in a single request
	form.multiples = true;

	// every time a file has been uploaded successfully,
	// rename it to it's orignal name
	form.on('file', function(field, file) {
		cloudinary.uploader.upload(file.path, function(result) { 
			// console.log(result);
			var new_photo = new Photo();
			new_photo.cloudinary_public_id = result.public_id;
			new_photo.save(function(err, ph) {
				if (err)
					res.send(err);
				// console.log(ph);
			});
		});
	});

	// log any errors that occur
	form.on('error', function(err) {
		console.log('An error has occured: \n' + err);
	});

	// once all the files have been uploaded, send a response to the client
	form.on('end', function() {
		res.end('success');
	});

	// parse the incoming request containing the form data
	form.parse(req);
});

router.get('/galleries', function(req, res) {
	// TODO: redirect if not admin 
	// res.redirect('/');

    Gallery.find({},{},function(e,galleries){
        res.render('galleries', {
            "galleries" : galleries
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
