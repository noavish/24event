var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new mongoose.Schema({
    commentEmail: String,
    commentInput: String
});

var eventSchema = new mongoose.Schema({
    userEmail: String,
    place: { type: Schema.Types.ObjectId, ref: 'place' },
    eventDate: String,
    eventTime: String,
    eventName: String,
    eventDesc: String,
    userPic : String,
    maxParticipants: Number,
    attendees: [],
    comments: [commentSchema]
});
// , { usePushEach: true });

var Event = mongoose.model('event', eventSchema);

module.exports = Event;