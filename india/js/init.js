Path.map("#/map").to(function() {
    $("#title-text").html("Mapped to Polls");
    $("#stage").load(App.base_url + "/screens/polls.html");
});


Path.root("#/map");
Path.listen();