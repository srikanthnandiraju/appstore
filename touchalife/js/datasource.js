// var config = {
//     apiKey: "AIzaSyDoWsICR8ZKG8sbQdv9ONCwyqXgn8A-ZAg",
//     authDomain: "touchalife-dev.firebaseapp.com",
//     databaseURL: "https://touchalife-dev.firebaseio.com",
//     projectId: "touchalife-dev",
//     storageBucket: "touchalife-dev.appspot.com",
//     messagingSenderId: "923020318128"
// };
// firebase.initializeApp(config);


// Demo app configuration
var firebaseConfig = {
    apiKey: "AIzaSyC4iBOFRfwl7zuraCGJRSKUK6YYg8rS4c0",
    authDomain: "touch-a-life-demo.firebaseapp.com",
    databaseURL: "https://touch-a-life-demo.firebaseio.com",
    projectId: "touch-a-life-demo",
    storageBucket: "touch-a-life-demo.appspot.com",
    messagingSenderId: "297119938664",
    appId: "1:297119938664:web:c4d40fda8d2ad23cb9e3dd",
    measurementId: "G-0EH5DVN767"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// Set Global vars on App scope.
App.db = firebase.firestore();
App.auth = firebase.auth();

App.auth.onAuthStateChanged(function(fireUser) {
    debug(" Login state changed ");
    if (fireUser) {
        App.User = fireUser;
        App.Events.emit("user-logged-in", fireUser);
        var userId = App.User.uid;
        //debug("Got User id " + JSON.stringify(App.User));

        App.db.collection("user_profile").where("user_id", "==", App.User.uid)
            .get()
            .then(function(querySnapshot) {
                if (querySnapshot.size === 0) {
                    console.log("User data not found");
                    return;
                } else {
                    if (querySnapshot.docs[0] && App.User.uid) {
                        App.UserProfile = querySnapshot.docs[0].data();
                        $("#user-name-in-header").html("Welcome " + App.UserProfile.first_name)

                        App.UserProfile = querySnapshot.docs[0].data();
                        App.User.record_id = querySnapshot.docs[0].id;
                        var loginInfo = {
                            user_id: App.User.uid,
                            first_name: App.UserProfile.first_name,
                            last_name: App.UserProfile.last_name,
                            email: App.UserProfile.email,
                            record_id: App.User.record_id,
                            roles: App.UserProfile.role
                        }

                        sessionStorage.setItem("LoginInfo", JSON.stringify(loginInfo));
                        let myLoginInfo = JSON.stringify(loginInfo.roles)

                        if (myLoginInfo.includes("tal_admin")) {
                            App.Events.emit("admin-logged-screen");
                        }
                        if (myLoginInfo.includes('donor')) {
                            App.Events.emit("donor-logged-screen");
                        }
                        if (myLoginInfo.includes('donee')) {
                            App.Events.emit("donee-logged-screen");
                        }
                        if ((myLoginInfo.includes('donor')) && (myLoginInfo.includes('donee'))) {
                            App.Events.emit("both-logged-screen");
                        }
                        // querySnapshot.forEach(function (doc) {
                        //     // doc.data() is never undefined for query doc snapshots
                        //     debug(doc.id, " => ", doc.data());
                        // });
                        App.Events.emit("show-welcome-screen");
                    } else {
                        console.log("User not found");
                        return;
                    }
                }
            })

    }
});

function createEntry(table, row) {
    row.created_at = firebase.firestore.Timestamp.now().toMillis();
    row.updated_at = firebase.firestore.Timestamp.now().toMillis();
    App.db.collection(table).add(row);
}

function updateEntry(table, id, row) {
    row.updated_at = firebase.firestore.Timestamp.now().toMillis();
    App.db.collection(table).doc(id).update(row);
}

function deleteEntry(table, id) {
    App.db.collection(table).doc(id).delete();
}