var mongoose = require('mongoose');

// SCHEMA
// ==============================================

var settingsSchema = mongoose.Schema(
{
	title:       {type: String, required: true, unique: true},
	description: {type: String, required: true, unique: true}
});

// EXPORT
// ==============================================

module.exports = mongoose.model('settings', settingsSchema, 'settings');