//1. load navigation for the app.
$("#navigation-links").load(App.base_url + "/screens/navigation.html");

// 2. Configure the routes.
Path.map("#/polls").to(function() {
    $("#title-text").html("Map");
    $("#stage").load(App.base_url + "/screens/polls.html");
});

Path.root("#/polls");
Path.listen();

// 3. Attach events to parent.
// Need this to handle event on generated links
$('#navigation-links').on('click', '.item', function() {
    App.Events.emit("hide-side-nav");
});