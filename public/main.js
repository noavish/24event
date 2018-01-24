var event24App = function() {
    var events = [];
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

    }

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
                console.log(events)
                _renderEvents();
            },
            error : function (xhr,text,err) {
                console.log(err);
            }
        });
    };

    var joinEvent = function(userEmail, eventID) {
        $.ajax({
            type: "POST",
            url: '/events' + eventID + '/user/' + userEmail,
            success: function(specificEvent) {},
        });
    };

    return {
        addEvent: addEvent,
        joinEvent: joinEvent,
        _renderEvents: _renderEvents
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


$('#event-form').submit(function (event) {
    alert("form sumbited ")
    event.preventDefault();
    var userEmail = $('#event-creator').val();
    var eventCity = $('.event-cities').val();
    var eventDate = $('#event-date').val();
    var eventTime = $('#event-time').val();
    var eventName = $('#event-name').val();
    var eventDesc = $('#event-desc').val();
    var placeName = $('#event-venue').val();
    var address = $('#event-address').val();
    var maxParticipants = $('#max-num').val();
    var myFile = $('#image').prop('files');
    debugger;

    var formData = new FormData(this);
    formData.append('userEmail', userEmail);
    formData.append('eventCity', eventCity);
    formData.append('eventDate', eventDate);
    formData.append('eventTime', eventTime);
    formData.append('eventName', eventName);
    formData.append('eventDesc', eventDesc);
    formData.append('placeName', placeName);
    formData.append('address', address);
    formData.append('maxParticipants', maxParticipants);
    formData.append('placeImage', myFile);
   
    app.addEvent(formData);
    $(this).reset();
    $('#myInput').trigger('show');
});



$('div').on('click', '.join-event', function() {
    var userEmail = $('div').val();
    var eventID = $(this).data().id();
    joinEvent(userEmail, eventID);
});

$('.btn')
    //Show form on create event button click

$('#myModal').on('shown.bs.modal', function() {
    $('#myInput').trigger('show')
});
