
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBI0OtM8eBZA0jn2Nq0DJWJ20VWGuo-ATo",
    authDomain: "incrome-1377.firebaseapp.com",
    databaseURL: "https://incrome-1377.firebaseio.com",
    projectId: "incrome-1377",
    storageBucket: "incrome-1377.appspot.com",
    messagingSenderId: "616898564325"
  };
  firebase.initializeApp(config);

taburls.addEventListener("click",  (val) => {
    // console.log(chrome.tabs);
    chrome.tabs.getAllInWindow((val) => {
        var db = firebase.database();
        var now = new Date().getTime();
        db.ref("urls").child(now).set(val);
        val.forEach(element => {
           console.log(element);
           let li$ = document.createElement("li");
           li$.className = "list-group-item";
           li$.className += " navbar-inverse";
           li$.textContent = element.url;
           results.appendChild(li$);
        });
    })
});