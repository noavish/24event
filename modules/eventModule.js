var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new mongoose.Schema({
    userEmail: String,
    place: {type: Schema.Types.ObjectId, ref: 'place'},
    eventDate: Date,
    eventTime: Time,
    eventName: String,
    eventDesc: String,
    maxParticipants: Number,
    attendees: [{type: Schema.Types.ObjectId, ref: 'user'}],
});
// , { usePushEach: true });

var Event = mongoose.model('event', eventSchema);

module.exports = Event;