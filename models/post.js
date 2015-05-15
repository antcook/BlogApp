var mongoose = require('mongoose');

// SCHEMA
// ==============================================

var postSchema = mongoose.Schema(
{
	title:     {type: String, required: true, unique: true},
	url:       {type: String, required: true, unique: true},
	author:    {type: String, required: true},
	authorUrl: {type: String, required: true},
	date:      {type: Date, required: true, default: Date.now},
	content:   {type: String, required: true}
});

// EXPORT
// ==============================================

module.exports = mongoose.model('Post', postSchema);