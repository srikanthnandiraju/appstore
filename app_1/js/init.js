Path.map("#/map").to(function () {
    $("#title-text").html("Map");
    $("#stage").load(App.base_url + "/screens/map.html");
});

Path.map("#/find-beacons").to(function () {
    $("#title-text").html("Beacons");
    $("#stage").load(App.base_url + "/screens/beacons.html");
});

Path.root("#/map");
Path.listen();