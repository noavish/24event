var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require('multer')
var upload = multer({ dest: 'uploads/' })



mongoose.connect(process.env.CONNECTION_STRING || 'mongodb://localhost/24eventDB');

//Require Var

var User = require('./modules/userModule');
var Event = require('./modules/eventModule');
var Places = require('./modules/placeModules');


var app = express();
app.use(express.static('public'));
app.use(express.static('node_modules'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));



//------tamplate route 


// app.post('/createvent', (req, res) => {
//     var event = new Event({
//         eventCreator: ,
//         attendees: ,
//         eventDate: ,
//         maxParticipants: ,
//         eventPlace:
//     })
//     event.save(function(err, data) {
//         if (err) throw error;
//         else res.send(data);
//     });
// })



app.listen(process.env.PORT || '8080');