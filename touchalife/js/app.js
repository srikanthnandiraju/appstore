var App = {};

App.donation_requests = [];
App.donation_request_id = undefined;


// Global Event Bus to fire and listen to events
App.Events = {
    emit: function(event_name, event_payload) {
        $("body").trigger(event_name, event_payload);
    },
    listen: function(event_name, callback) {
        $("body")
            .unbind(event_name)
            .bind(event_name, function(e, data) {
                callback(data);
            });
    }
};

App.FullScreen = {
    show: function(screenurl) {
        $("#fullscreen_stage").load(screenurl);
        $("#fullscreenElement").addClass("open");
    },
    hide: function() {
        $("#fullscreenElement").removeClass("open");
    }
};

App.init = function() {
    NProgress.configure({
        showSpinner: false
    });

    $(document).ajaxStart(function() {
        NProgress.start();
    });

    $(document).ajaxStop(function() {
        NProgress.done();
    });

    $(".fullscreen-close").on("click", function(event) {
        App.FullScreen.hide();
    });

    $(".ui.dropdown").dropdown({
        // allowCategorySelection: true,
        transition: "fade up",
        on: "hover"
    });

    $('#full-screen').click(function() {
        $(document).toggleFullScreen();
        return false;
    });

    // Side Nav Instance
    // App.sidenav = new Sidenav({
    //     content: document.getElementById("content"),
    //     sidenav: document.getElementById("sidenav"),
    //     backdrop: document.getElementById("backdrop")
    // });

    // // FastClick.attach(document.body);
    // document.getElementById("menu-toggle").addEventListener("click", function() {
    //     App.sidenav.open();
    // });

    // $(".side-menu-items .item").click(function() {
    //     App.Events.emit("hide-side-nav");
    // });
};

App.Utils = {
    isNumeric: function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },
    showInBrowser: function(url_to_show) {
        var ref = window.open(
            url_to_show,
            "_blank",
            "location=no,footer=yes,closebuttoncaption=Close,zoom=no,footercolor=#199DDC,closebuttoncolor=#ffffff"
        );
    },
    loadTemplateToHolder: function(template, holder, payload) {
        try {
            var template = $(template).html();
            var html = Mustache.to_html(template, payload);
            $(holder).html(html);
        } catch (err) {
            debug("Error loading template to holder.. Screen may not be visible");
        }
    }
};

// Generic events to handle side bar visibility
App.Events.listen("hide-side-nav", function() {
    App.sidenav.close();
});
App.Events.listen("show-side-nav", function() {
    App.sidenav.open();
});

var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    }
};

// APP SPECIFIC DATA AND FUNCTIONS
App.feedData = {};
App.currentTopic = "Homeless kids in america";

function loadData(text) {
    // jQuery.ajaxPrefilter(function(options) {
    //     options.url = "https://cors-anywhere.herokuapp.com/" + options.url;
    // });

    var skey = "'" + escape(text) + "'";
    if (App.feedData[skey] != undefined) {
        var itemsFound = App.feedData[skey];
        App.Events.emit("feed-data-loaded", {
            data: itemsFound
        });
    } else {
        text = encodeURI(text);
        var modifiedItems = [];
        // var rssurl =
        //     "https://news.google.com/news/rss/search/section/q/" +
        //     text +
        //     "/?ned=us&gl=US&hl=en";

        rssurl = "http://www.nandiraju.com/CLIENTS/news/read.php?q=" + text;


        $.get(rssurl, function(data) {
            // GET call

            var $xml = $(data);
            $xml.find("item").each(function() {
                // xml loop

                var item = $(this);
                var one_item = {
                    feedlink: item.find("link").text(),
                    title: item.find("title").text(),
                    description: item.find("description").text(),
                    time_lapsed: moment(item.find("pubDate").text()).fromNow(),
                    date: item.find("pubDate").text(),
                    author: item.find("author").text()
                };

                //debug("data " + one_item.time_lapsed);

                var content = item.find("media\\:content,content");
                var img = "https://dummyimage.com/1x1/fff/fff.png&text=" + "news";
                var img = undefined;

                if (content.attr("medium") == "image") {
                    img = content.attr("url");
                }
                one_item.image = img;
                modifiedItems.push(one_item);
            }); // xml loop end

            modifiedItems.sort(function(a, b) {
                return new Date(b.date) - new Date(a.date);
            });

            App.feedData[skey] = modifiedItems;
            App.Events.emit("feed-data-loaded", {
                data: modifiedItems
            });
        });
    }
}

function debug(...message) {
    // comment for live
    console.log(...message);
}

function showPage(page_url) {
    window.location.href = page_url;
}

// check if user roles authenticated
function validate_current_user_role() {
    const user_session_data = sessionStorage.getItem('LoginInfo');
    if (!user_session_data) {
        return false;
    } else {
        const parse_user_login_data = JSON.parse(user_session_data);
        const login_user_roles = parse_user_login_data.roles;
        const check_role_auth = login_user_roles.some(
            item => ['admin', 'tal_admin', 'volunteer', 'donor', 'donee'].includes(item.toLowerCase())
        );
        return check_role_auth;
    }
}

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};

function isSmallScreen() {
    return (window.innerWidth < 700)
}

// return current user Roles
function get_current_user_roles() {

    if (App.UserProfile && App.UserProfile.role) {
        return App.UserProfile.role;
    }

    const user_session_data = sessionStorage.getItem('LoginInfo');
    if (!user_session_data) {
        //return false;
        return [];
    } else {
        const parse_user_login_data = JSON.parse(user_session_data);
        const login_user_roles = parse_user_login_data.roles;
        return login_user_roles;
    }
}

// -------------------------GLOBAL EVENTS FOR  SCREENS
App.Events.listen("user-logged-in", function() {
    //App.Events.emit("show-welcome-screen");
    localStorage.setItem("user_logged_in", "1");
    App.user_logged_in = true;
});
App.Events.listen("user-logged-out", function(user_data) {
    localStorage.setItem("user_logged_in", undefined);
    sessionStorage.setItem('LoginInfo', undefined);
    App.User = undefined;
    App.auth.signOut();
    debug(" User logged out");
    document.location.href = "#/login";
    App.user_logged_in = undefined;
});
App.Events.listen("user-signed-up", function(user_data) {
    App.User = user_data.fb_user;
    App.UserProfile = user_data.user_signup_details;
    createEntry("signup_requests", {
        user_id: App.User.uid,
        first_name: App.UserProfile.first_name,
        last_name: App.UserProfile.last_name,
        email: App.UserProfile.email
    });
    App.Events.emit("user-logged-in");
    debug(" User signed up" + App.UserProfile);
});

App.Events.listen("show-welcome-screen", function() {
    App.FullScreen.hide();
    //$("#stage").load("screens/dashboard.html");
    $("#stage").load("screens/welcome.html");
});

// Menu handling for Donor and Donee
App.Events.listen("donor-logged-screen", function() {
    $("#donations").show()
    $("#requests").hide()
    $("#user-organization").show()
    $("#admin-menu").hide()
    $("#my-transactions").show()
});

App.Events.listen("both-logged-screen", function() {
    $("#admin-menu").hide()
    $("#donations").show()
    $("#requests").show()
    $("#user-organization").show()
    $("#my-transactions").show()
});

App.Events.listen("donee-logged-screen", function() {
    $("#admin-menu").hide()
    $("#donations").hide()
    $("#requests").show()
    $("#user-organization").show()
    $("#my-transactions").show()
});

App.Events.listen("admin-logged-screen", function() {
    $("#admin-menu").show()
    $("#tal-roles").hide()
    $("#my-transactions").hide()
        // $("#donations").hide()
        // $("#requests").hide()
    $("#user-organization").hide()
});