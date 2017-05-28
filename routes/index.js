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
    Gallery.find({ name: { $ne: "0" } }, {},function(e,galleries){
        res.render('index', {
            "galleries_row_1" : galleries.slice(0,3),
            "galleries_row_2" : galleries.slice(3,6),
            "galleries_row_3" : galleries.slice(6,7)
        });
    }).sort( { name: 1 } );
});

router.get('/photos', function(req, res) {

    Gallery.find({ $query: { }, $orderby: { name : 1 } },{},function(e,galleries){
		Photo.find({},{}, function(e,photos){
			var galleries_dict = {};
			for (var i=0; i<galleries.length; ++i) {
				galleries_dict[galleries[i]._id] = galleries[i];
				galleries_dict[galleries[i]._id].photos = [];
			}
			var unassigned_photos = [];
			for (var i=0; i<photos.length; ++i) {

				if (photos[i].gallery_id != undefined && galleries_dict[photos[i].gallery_id] != undefined) {
					galleries_dict[photos[i].gallery_id].photos.push(photos[i]);
				}
				else {
					unassigned_photos.push(photos[i]);
				}
			}

			var galleries_arr = [];
			for (var i in galleries) {
				galleries_arr.push(galleries[i]);
			}

			galleries_arr.sort(function(a, b) {
			    return parseInt(a.name) - parseInt(b.name);
			});

			res.render('photos', {
				"unassigned_photos" : unassigned_photos,
				"galleries" : galleries_arr
			});
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
			new_photo.gallery_id = "5928a613f0b79922962e104d"; // TODO replace with query, or use name?
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

router.put('/photos/:photo_id', function(req, res) {
	console.log(req.params.photo_id);
	Photo.findOneAndUpdate({ _id: req.params.photo_id }, req.body, {new: true}, function(err, photo) {
		if (err)
			res.send(err);
		res.json(photo);
	});
});


router.get('/galleries', function(req, res) {
	//res.redirect('/');
	//return;
	
	// disable for now - constant galleries

    Gallery.find({},{},function(e,galleries){
        res.render('galleries', {
            "galleries" : galleries
        });
    }).sort( { name: 1 } );
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
    Gallery.findOne({ name:req.params.gallery_name },{},function(e,gallery) {
    	if (gallery == undefined) {
    		res.redirect('/');
    		return;
    	}
    	Photo.find({ gallery_id:gallery._id }, {}, function(e, photos) {
    		res.render('gallery', {
    			"photos" : photos,
    			"gallery" : gallery
    		});
    	})
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
