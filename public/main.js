var event24App = function() {


    var addEvent = (newEvent) => {
        $.ajax({
            type: "POST",
            url: '/events/newEvent',
            data: newEvent,
            success: function (newEvent) {
                console.log(newEvent.);
            }
        });
    }

    return {
        addEvent: addEvent,

    };
};



var app = event24App();

$('.save-event').on('click', function () {
    var userEmail =
    var eventDate =
    var maxParticipants =
    var eventPlace =
    var newEvent = {userEmail: userEmail,
        eventDate: eventDate,
        maxParticipants: maxParticipants,
        eventPlace: eventPlace};
    app.addEvent(newEvent);
});