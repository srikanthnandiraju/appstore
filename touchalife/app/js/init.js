//1. load navigation for the app.
$("#navigation-links").load(App.base_url + "/screens/navigation.html");

// 2. Configure the routes.
Path.map("#/scavenger_clues").to(function() {
    $("#title-text").html("Scavenger Hunt");
    $("#stage").load(App.base_url + "/screens/scavenger_clues.html");
});

Path.map("#/social_feed").to(function() {
    $("#title-text").html("Feed");
    $("#stage").load(App.base_url + "/screens/social_feed.html");
});

Path.map("#/points").to(function() {
    $("#title-text").html("WOW Points");
    $("#stage").load(App.base_url + "/screens/points.html");
});

Path.map("#/logout").to(function() {
    App.Events.emit('user-logged-out');
});


Path.root("#/scavenger_clues");
Path.listen();

// 3. Attach events to parent.
// Need this to handle event on generated links
$('#navigation-links').on('click', '.item', function() {
    App.Events.emit("hide-side-nav");
});

App.Events.listen("show-announcement-screen", function() {
    var ref = window.open(App.serverURL + "/content/announcements.html", '_blank',
        'location=no,footer=yes,closebuttoncaption=Close Announcements,zoom=no,footercolor=#199DDC,closebuttoncolor=#ffffff');
});