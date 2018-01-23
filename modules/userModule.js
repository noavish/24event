var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new mongoose.Schema({
    userEmail: String
});

var User = mongoose.model('user', userSchema);

module.exports = User;