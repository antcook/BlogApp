var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var validate = require('mongoose-validate');

// SCHEMA
// ==============================================

var userSchema = mongoose.Schema(
{
	email        : {type: String, required: true, unique: true},
	password     : {type: String, required: true},
	firstName    : {type: String, required: true},
	lastName     : {type: String, required: true},
	url          : {type: String, required: true}
});

// GENERATE HASH
// ==============================================

userSchema.methods.generateHash = function(password)
{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// CHECK PASSWORD
// ==============================================

userSchema.methods.validPassword = function(password)
{
    return bcrypt.compareSync(password, this.password);
};

// EXPORT
// ==============================================

module.exports = mongoose.model('User', userSchema);