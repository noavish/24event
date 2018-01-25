var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new mongoose.Schema({
    userEmail: String,
    place: { type: Schema.Types.ObjectId, ref: 'place' },
    eventDate: String,
    eventTime: String,
    eventName: String,
    eventDesc: String,
    maxParticipants: Number,
    attendees: [],
});
// , { usePushEach: true });

var Event = mongoose.model('event', eventSchema);

module.exports = Event;