var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var placeSchema = new mongoose.Schema({
    placeName: String,
    eventCity: String,
    address: String,
    phone: Number,
    picURL: String,
    rating: String,
    price: String
});

var Place = mongoose.model('place', placeSchema);

module.exports = Place;