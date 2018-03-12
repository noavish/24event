var event24App = function() {
    var events = [];
    var currVenueDetails = {};

    var fetch = function() {
        $.ajax({
            method: "GET",
            url: '/events',
            datatype: "json",
            success: function(data) {
                console.log(data)
                events = data;
                _renderEvents();
            },
            error: function(jqXHR, testStatus) {
                console.log(testStatus);
            }
        });
    };

    fetch();

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

    var _renderEvents = function() {
        $(".event-list").empty();
        var source = $("#event-template").html();
        var template = Handlebars.compile(source);

        for (event of events) {
            var newHTML = template(event);
            $(".event-list").append(newHTML);
            _renderComments(event._id);
        }
    };

    var addComments = function (eventID, comment, eventIndex) {
        console.log(comment);
        $.ajax({
            type: "POST",
            url: `/events/${eventID}/comments`,
            data: comment,
            success: function(data) {
                console.log(data);
               for(var i = 0 ; i < events.length ; i ++){
                    if( data._id === events[i]._id){
                      events[i] = (data);
                      break;
                 }
               }
                _renderComments(eventID);
            },
            error: function(xhr, text, err) {
                console.log(err);
            }
        });
    };

    function _renderComments(eventID) {
        var index = events.map(function(e) { return e._id; }).indexOf(eventID);
        var $commentsList = $('.event-list').find(`[data-id=${eventID}]`).closest('.event').find('.comments-container');
        $commentsList.empty();
        var source = $('#comment-template').html();
        var template = Handlebars.compile(source);
        console.log(event);
        var comments =  events[index].comments;
        for(comment of comments){
            var newHTML = template(comment);
            $commentsList.append(newHTML);
        }
    }

    var _maxAttendees = function(index) {
        for (var i = 0; i < events.length; i++) {
            if (events[index].attendees.length >= events[index].maxParticipants) {
                return false;
            } else {
                return true
            }
        }
    };

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
                for (var i=0; i<events.length; i++) {
                    if (data === events[i]._id) {
                        events.splice(i, 1);
                        break;
                    }
                }
                _renderEvents();
            },
            error: function() {
                console.log('error');
            }
        });
    };

    var venueDetailsFill = function(venueCity, venueName) {
        $.ajax({
            method: "GET",
            url: `/venueDetails/${venueCity}/${venueName}`,
            success: function(data) {
                currVenueDetails = data;
                console.log(currVenueDetails);
                $('#event-address').val(currVenueDetails.address);
                // $('.venueDetails').html(`${currVenueDetails.data.address}`);
                var source = $("#placeDetails-template").html();
                var template = Handlebars.compile(source);
                var newHTML = template(currVenueDetails);
                $(".venueDetails").html(newHTML);

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
        venueDetailsFill: venueDetailsFill,
        removeEvent: removeEvent,
        returnCurrVenueDetails: returnCurrVenueDetails,
        addComments: addComments
    };
};

var app = event24App();

$('.cancel-event').on('click', function() {
    $(this).parents('form')[0].reset();
});

var _renderStars = function(starsNum){
    let html = '';
    for(let i=0;i<starsNum;i++){
        html +='⭐';
    }
    return html;
};
Handlebars.registerHelper("ratingToStars", _renderStars);

var options = {
    url : "/autocomplete",
    getValue: function (element) {
        return element.place.placeName;
    },
    template: {
        type: "description",
        fields: {
            description: "eventDesc",
        }
    },
    list: {
        match: {
            enabled: true
        }
    },
    theme: "plate-dark",
     requestDelay: 400
};

$("#search").easyAutocomplete(options);

$('.clear-venue').on('click', function () {
    $('#event-venue').val('');
    $('#event-address').val('');
    $('.venueDetails').html('');
});

$('#event-form').submit(function(event) {
    $('#myModal').modal('hide');
    var currentPlace = app.returnCurrVenueDetails();
    event.preventDefault();

    var userEmail = $('#event-creator').val();
    var placeName = currentPlace.name;
    var eventCity = currentPlace.city;
    var address = currentPlace.address;
    var phone = currentPlace.phone;
    var picURL = currentPlace.picURL;
    var rating = currentPlace.rating;
    var price = currentPlace.price;
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
    $(this)[0].reset();
});

//Join event
$('.event-list').on('click', '#join-event', function() {
    var eventID = $(this).parents('.event-div').data().id
    var userEmail = $(this).siblings('.user-field-email').val()
    app.joinEvent(eventID, userEmail)
});

//remove event on click
$('.event-list').on('click', '.delete-btn', function() {
    var index = $(this).parents('.event-div').data().id;
    app.removeEvent(index);
});

//Show form on create event button click
$('#myModal').on('shown.bs.modal', function() {
    $('#myInput').trigger('show')
});

//activate image carousel
$('.carousel').carousel();

//social media share link
// add this rail gallery effect
$(document).on('click', '#socialShare > .socialBox', function() {
    var self = $(this);
    var element = $('#socialGallery a');
    var c = 0;
    if (self.hasClass('animate')) {
        return;
    }
    if (!self.hasClass('open')) {
        self.addClass('open');
        TweenMax.staggerTo(element, 0.3, {
                opacity: 1,
                visibility: 'visible'
            },
            0.075);
        TweenMax.staggerTo(element, 0.3, {
                top: -12,
                ease: Cubic.easeOut
            },
            0.075);
        TweenMax.staggerTo(element, 0.2, {
                top: 0,
                delay: 0.1,
                ease: Cubic.easeOut,
                onComplete: function() {
                    c++;
                    if (c >= element.length) {
                        self.removeClass('animate');
                    }
                }
            },
            0.075);
        self.addClass('animate');
    } else {
        TweenMax.staggerTo(element, 0.3, {
                opacity: 0,
                onComplete: function() {
                    c++;
                    if (c >= element.length) {
                        self.removeClass('open animate');
                        element.css('visibility', 'hidden');
                    }
                }
            },
            0.075);
    }
});

$('.search-venue').on('click', function() {
    var venueName = $('#event-venue').val();
    var venueCity = $('.event-cities option:selected').text();
    app.venueDetailsFill(venueCity, venueName);
});

$('.clear-venue').on('click', function() {
    $('#event-venue').val('');
    $('#event-address').val('');
    $('.venueDetails').html('');
});

$('.event-list').on('click', '#comment-event', function () {
   var comment = {commentEmail: $(this).parents('.input-group-btn').siblings('.comment-email').val(),
       commentInput: $(this).parents('.input-group-btn').siblings('.comment-input').val()};
   var eventID = $(this).closest('.event-div').data().id;
   var eventIndex = $(this).closest('.event').index();

    app.addComments(eventID, comment, eventIndex);
});



