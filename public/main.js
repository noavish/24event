var event24App = function() {
    var events = [];
    var currVenueDetails = {};

    var fetch = function() {
        $.ajax({
            method: "GET",
            url: '/events',
            datatype: "json",
            success: function(data) {
                events = data;

                _renderEvents();
            },
            error: function(jqXHR, testStatus) {
                console.log(testStatus);
            }
        });
    };
    fetch();

    var _renderEvents = function() {
        $(".event-list").empty();
        var source = $("#event-template").html();
        var template = Handlebars.compile(source);
        for (var i = 0; i < events.length; i++) {
            var newHTML = template(events[i]);
            $(".event-list").append(newHTML);

        }

    };

    var addEvent = function(newEvent) {
        $.ajax({
            type: "POST",
            url: '/events/newEvent',
            data: newEvent,
            processData: false,
            contentType: false,
            cache: false,
            success: function(data) {
                events.push(data);
                _renderEvents();
            },
            error: function(xhr, text, err) {
                console.log(err);
            }
        });
    };

    var _maxAttendees = function(index) {
        for (var i = 0; i < events.length; i++) {
            if (events[index].attendees.length >= events[index].maxParticipants) {
                return false;
            } else {
                return true
            }
        }
    }

    var joinEvent = function(eventid, useremail) {
        var index = events.map(function(e) { return e._id; }).indexOf(eventid);

        if (_maxAttendees(index)) {
            $.ajax({
                type: "POST",
                url: '/events/' + eventid + '/users/' + useremail,
                data: { email: useremail },
                success: function(data) {
                    events = data;
                    fetch();

                },
                error: function(xhr, text, err) {
                    console.log(err);
                }
            });
        } else {
            $('.event-list').on('click', '#join-event', function() {
                $(this).toggleClass('gray-div');
                $(this).text('FULL,STOP TICKLING ME!')
            });
        }
    };

    var removeEvent = function(index) {
        $.ajax({
            type: 'DELETE',
            url: '/events/' + index,
            success: function(data) {
                console.log('success');
                fetch();
            },
            error: function() {
                console.log('error');

            }
        });
    };

    var venueDetailsFill = function(venueName) {
        $.ajax({
            method: "GET",
            url: `/venueDetails/${venueName}`,
            success: function(data) {
                console.log(data);
                currVenueDetails = {data};
                console.log(currVenueDetails);
                $('#event-address').val(data.address);
            },
            error: function(jqXHR, testStatus) {
                console.log(testStatus);
            }
        });
        return false;
    };

    var returnCurrVenueDetails = function () {
        return currVenueDetails;
    };

    return {
        addEvent: addEvent,
        joinEvent: joinEvent,
        _renderEvents: _renderEvents,
        venueDetailsFill: venueDetailsFill,
        removeEvent: removeEvent,
        returnCurrVenueDetails: returnCurrVenueDetails
    };
};

var app = event24App();

// $('.save-event').on('click', function() {
//     var userEmail = $('#event-creator').val();
//     var eventCity = $('.event-cities').val();
//     var eventDate = $('#event-date').val();
//     var eventTime = $('#event-time').val();
//     var eventName = $('#event-name').val();
//     var eventDesc = $('#event-desc').val();
//     var placeName = $('#event-venue').val();
//     var address = $('#event-address').val();
//     var maxParticipants = $('#max-num').val();
//     var newEvent = {
//         userEmail: userEmail,
//         eventCity: eventCity,
//         eventDate: eventDate,
//         eventTime: eventTime,
//         eventName: eventName,
//         eventDesc: eventDesc,
//         placeName: placeName,
//         address: address,
//         maxParticipants: maxParticipants
//     };
//     app.addEvent(newEvent);
//     $(this).parents('form')[0].reset();
// });


$('.cancel-event').on('click', function() {
    $(this).parents('form')[0].reset();
});

$('#event-form').submit(function(event) {
    var currentPlace = app.returnCurrVenueDetails();
    // alert("form sumbited ")
    event.preventDefault();
    var userEmail = $('#event-creator').val();
    // var placeName = $('#event-venue').val();
    // var eventCity = $('.event-cities').val();
    // var address = $('#event-address').val();
    var placeName = currentPlace.data.name;
    var eventCity = currentPlace.data.city;
    var address = currentPlace.data.address;
    var phone = currentPlace.data.phone;
    var picURL = currentPlace.data.picURL;
    var rating = currentPlace.data.rating;
    var price = currentPlace.data.price;
    var eventDate = $('#event-date').val();
    var eventTime = $('#event-time').val();
    var eventName = $('#event-name').val();
    var eventDesc = $('#event-desc').val();
    var maxParticipants = $('#max-num').val();
    var myFile = $('#image').prop('files');

    var formData = new FormData(this);
    formData.append('userEmail', userEmail);
    formData.append('placeName', placeName);
    formData.append('eventCity', eventCity);
    formData.append('address', address);
    formData.append('phone', phone);
    formData.append('picURL', picURL);
    formData.append('rating', rating);
    formData.append('price', price);
    formData.append('eventDate', eventDate);
    formData.append('eventTime', eventTime);
    formData.append('eventName', eventName);
    formData.append('eventDesc', eventDesc);
    formData.append('maxParticipants', maxParticipants);
    formData.append('placeImage', myFile);

    app.addEvent(formData);
    // $(this).reset();
    // $('#myInput').trigger('show');
});


$('.event-list').on('click', '#join-event', function() {
    var eventID = $(this).parents('.event-div').data().id
    var userEmail = $(this).siblings('.user-field-email').val()
    app.joinEvent(eventID, userEmail)
});



//remove event on click
$('.event-list').on('click', '.delete-btn', function() {
    var index = $(this).parents('.event-div').data().id;
    // console.log(index);
    app.removeEvent(index);
});
//Show form on create event button click

$('#myModal').on('shown.bs.modal', function() {
    $('#myInput').trigger('show')

});


$('.carousel').carousel();

$('#event-venue').on('keyup', function(event) {
    var venueName = $(this).val();
    var venueCity = $(this).siblings('.event-cities').val();
    console.log(venueCity);
    app.venueDetailsFill(venueName);

});



var options = {

    url: function (phrase) {
        return "/autocomplete/"+phrase;
    },

    getValue: function (element) {
        return element.text;
    },

    ajaxSettings: {
        dataType: "json",
        method: "GET",
        data: {
            // dataType: "json"
        }
    },
    preparePostData: function (data) {
        data.phrase = $("#search").val();
        return data;
    },
    requestDelay: 400
};

$("#search").easyAutocomplete(options);


