//https://content.googleapis.com/youtube/v3/search?type=video&q=surf&locationRadius=10mi&location=21.5922529%2C-158.1147114&part=snippet&key=AIzaSyAMkHWnLNAvpKte-XA9nh3RheX7lFn_dNM
var yc = {
    key: "AIzaSyDy3fLPh8t6v5cdQM8WFY4WNXaTec5X4j0",  //"AIzaSyAMkHWnLNAvpKte-XA9nh3RheX7lFn_dNM",
    url: "https://content.googleapis.com/youtube/v3/search",
    latitude:"",
    longitude: "",
    location: "" , //"21.5922529%2C-158.1147114",
    type: "video",
    q: "" , // "funny",
    radius: "" , // "10mi",
    part: "snippet" //"snippet" //contentDetails,,statistics,status
}



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

search.addEventListener("keydown", key => {
    if(key.keyCode===13) {
        results.textContent = "";
        yc.q = search.value;
        
        //var all = `${yc.url}?type=${yc.type}&q=${yc.q}&locationRadius=${yc.radius}&location=${yc.location}&part=${yc.part}&key=${yc.key}`
        let all = `${yc.url}?type=${yc.type}&q=${yc.q}&part=${yc.part}&key=${yc.key}`
        fetch(all)
        .then(data => {
            return data.json();
        })
        .then(result => {
            console.log(result)
            result.items.forEach(item => {
                results.style.minWidth = '700px';
                let li$ = document.createElement("li");
                li$.className = "list-group-item row";
                let img$ = document.createElement("img");
                img$.src = item.snippet.thumbnails.default.url;
                img$.className = "col-sm-4 col-md-4 col-lg-4 pull-left";
                li$.appendChild(img$);
                let divText$ = document.createElement("div");
                divText$.className = "col-sm-8 col-md-8 col-lg-8";
                let header$ = document.createElement("h6");
                header$.textContent = item.snippet.title;
                header$.className = "col-sm-12 col-md-12 col-lg-12";
                header$.style.marginBottom = "5px";
                header$.style.marginTop = "10px";
                divText$.appendChild(header$);
                let a$ = document.createElement("a");
                a$.href = "www.youtube.com/watch?v=" + item.id.videoId;
                a$.textContent = item.snippet.description
                a$.className = "col-sm-12 col-md-12 col-lg-12";
                a$.style.color = "green";
                divText$.appendChild(a$);
                li$.appendChild(divText$);
                results.appendChild(li$);
            });
        });
    }
});