//1. load navigation for the app.
$("#navigation-links").load(App.base_url + "/screens/navigation.html");

// 2. Configure the routes.
Path.map("#/map").to(function() {
    $("#title-text").html("Map");
    $("#stage").load(App.base_url + "/screens/map.html");
});

Path.map("#/find-beacons").to(function() {
    $("#title-text").html("Beacons");
    $("#stage").load(App.base_url + "/screens/beacons.html");
});

Path.root("#/map");
Path.listen();

// 3. Attach events to parent.
// Need this to handle event on generated links
$('#navigation-links').on('click', '.item', function() {
    App.Events.emit("hide-side-nav");
});