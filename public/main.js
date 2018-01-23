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
        let source = $("#event-template").html();
        let template = Handlebars.compile(source);
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
            success: function(data) {

                events.push(data);
                console.log(events)
                _renderEvents();
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

$('.save-event').on('click', function() {
    var userEmail = $('#event-creator').val();
    var eventCity = $('.event-cities').val();
    var eventDate = $('#event-date').val();
    var eventTime = $('#event-time').val();
    var eventName = $('#event-name').val();
    var eventDesc = $('#event-desc').val();
    var placeName = $('#event-venue').val();
    var address = $('#event-address').val();
    var maxParticipants = $('#max-num').val();
    var newEvent = {
        userEmail: userEmail,
        eventCity: eventCity,
        eventDate: eventDate,
        eventTime: eventTime,
        eventName: eventName,
        eventDesc: eventDesc,
        placeName: placeName,
        address: address,
        maxParticipants: maxParticipants
    };
    app.addEvent(newEvent);
    $(this).parents('form')[0].reset();
});


$('.cancel-event').on('click', function() {
    $(this).parents('form')[0].reset();
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