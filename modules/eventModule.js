var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new mongoose.Schema({
    eventCreator: {type: Schema.Types.ObjectId, ref: 'user'},
    attendees: [{type: Schema.Types.ObjectId, ref: 'user'}],
    eventDate: Date,
    maxParticipants: Number,
    eventPlace: {type: Schema.Types.ObjectId, ref: 'place'}
});
// , { usePushEach: true });

var User = mongoose.model('user', userSchema);

module.exports = User;