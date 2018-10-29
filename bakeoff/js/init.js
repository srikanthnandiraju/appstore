//1. load navigation for the app.
$("#navigation-links").load(App.base_url + "/screens/navigation.html");

// 2. Configure the routes.
Path.map("#/scavenger_clues").to(function() {
    $("#title-text").html("Scavenger Hunt");
    $("#stage").load(App.base_url + "/screens/scavenger_clues.html");
});

Path.root("#/scavenger_clues");
Path.listen();

// 3. Attach events to parent.
// Need this to handle event on generated links
$('#navigation-links').on('click', '.item', function() {
    App.Events.emit("hide-side-nav");
});