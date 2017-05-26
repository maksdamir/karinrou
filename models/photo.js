var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PhotoScheme = new Schema({
	gallery_id: {type: Schema.Types.ObjectId, ref: 'Gallery'},
	cloudinary_public_id: String
});

module.exports = mongoose.model('Photo', PhotoScheme);