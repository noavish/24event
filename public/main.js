var currentUserID = 123;

var addEvent = () =>
{
    $.ajax({
        type: "POST",
        url: '/events/newEvent',
        data: {currentUserID: currentUserID}
        success: function (newPost) {
            console.log(newPost)
            fetch();
            _renderPosts();
        },

    });
}



