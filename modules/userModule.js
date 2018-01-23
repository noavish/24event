var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new mongoose.Schema({
    userName: String,
    userRating: Number,
    userBio: String,
    participatedEvents: [{type: Schema.Types.ObjectId, ref: 'event'}]
});

var User = mongoose.model('user', userSchema);

module.exports = User;