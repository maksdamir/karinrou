var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GalleryScheme = new Schema({
	name: String,
	title: String,
	created_date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Gallery', GalleryScheme);