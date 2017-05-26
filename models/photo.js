var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PhotoScheme = new Schema({
	gallery_id: {type: Schema.Types.ObjectId, ref: 'Gallery'},
	img_base64_data: String
});

module.exports = mongoose.model('Photo', PhotoScheme);