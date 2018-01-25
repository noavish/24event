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
        // for (var i = 0; i < events.length; i++) {
            var newHTML = template({event: events});
            $(".event-list").append(newHTML);
        // }
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
                console.log('success');
                fetch();
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

    $('#myModal').modal('hide');    
    var currentPlace = app.returnCurrVenueDetails();
    event.preventDefault();
  
    var userEmail = $('#event-creator').val();
    // var placeName = $('#event-venue').val();
    // var eventCity = $('.event-cities').val();
    // var address = $('#event-address').val();
    var placeName = currentPlace.name;
    var eventCity = currentPlace.city;
    var address = currentPlace.address;
    var phone = currentPlace.phone;
    var picURL = currentPlace.picURL;
    var rating = currentPlace.rating;
    var price = currentPlace.price;
    var eventDate = $('#event-date').val();
    // var eventTime = $('#event-time').val();
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
    // formData.append('eventTime', eventTime);
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
              };
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

$('.clear-venue').on('click', function () {
    $('#event-venue').val('');
    $('#event-address').val('');
    $('.venueDetails').html('');
});

