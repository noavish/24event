$('.search-city').on('click', function () {

    alert("clicked");
    
    let source = $("#event-template").html();
    let template = Handlebars.compile(source);
    let html = template();
    $(".event-list").append(html);
});

