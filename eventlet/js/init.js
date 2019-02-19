//1. load navigation for the app.
$("#navigation-links").load(App.base_url + "/screens/navigation.html");

// 2. Configure the routes.
Path.map("#/news").to(function () {
    $("#title-text").html("News");
    $("#stage").load(App.base_url + "/screens/news.html");
});

Path.root("#/news");
Path.listen();

// 3. Attach events to parent.
// Need this to handle event on generated links
$('#navigation-links').on('click', '.item', function () {
    App.Events.emit("hide-side-nav");
});

App.Events.listen("show-announcement-screen", function () {
    var ref = window.open(App.serverURL + "/content/announcements.html", '_blank',
        'location=no,footer=yes,closebuttoncaption=Close Announcements,zoom=no,footercolor=#199DDC,closebuttoncolor=#ffffff');
});