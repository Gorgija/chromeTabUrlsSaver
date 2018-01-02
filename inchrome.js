//https://content.googleapis.com/youtube/v3/search?type=video&q=surf&locationRadius=10mi&location=21.5922529%2C-158.1147114&part=snippet&key=AIzaSyAMkHWnLNAvpKte-XA9nh3RheX7lFn_dNM
var yc = {
    key: "AIzaSyDy3fLPh8t6v5cdQM8WFY4WNXaTec5X4j0",  //"AIzaSyAMkHWnLNAvpKte-XA9nh3RheX7lFn_dNM",
    url: "https://content.googleapis.com/youtube/v3/search",
    latitude: "",
    longitude: "",
    location: "", //"21.5922529%2C-158.1147114",
    type: "video",
    q: "", // "funny",
    radius: "", // "10mi",
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
var resultData = {}
const db = firebase.database();


taburls.addEventListener("click", (key) => {
    results.textContent = "";
    chrome.tabs.getAllInWindow((val) => {
        val.forEach(item => {
            setResultsList(item);
        });
        save.hidden = false;
        resultData = val;
    })
});

search.addEventListener("keydown", key => {
    save.hidden = true;
    if (key.keyCode === 13) {
        results.textContent = "";
        yc.q = search.value;
        //var all = `${yc.url}?type=${yc.type}&q=${yc.q}&locationRadius=${yc.radius}&location=${yc.location}&part=${yc.part}&key=${yc.key}`
        let all = `${yc.url}?type=${yc.type}&q=${yc.q}&part=${yc.part}&key=${yc.key}`
        fetch(all)
            .then(data => {
                return data.json();
            })
            .then(result => {
                result.items.forEach(item => {
                    setResultsList(item);
                });
            });
    }
});

function setResultsList(item) {
    // List wrapper for video search result
    let li$ = document.createElement("li");
    li$.className = "list-result";
    // video thumbnail image
    if (item.snippet) {
        // return `
        //     <li>
        //         <img src=${item.snippet.thumbnails.default.url} class='video-thumb' />
        //         <div class='video-desc'>
        //             <h6 style='margin-bottom: 5px;margin-top:10px;text-transform:uppercase;'>${item.snippet.title}</h6>
        //             <a href='www.youtube.com/watch?v=${item.id.videoId}' class='video-link' style='color:'#76bd69'>${item.snippet.description}</a>
        //         </div>
        //     </li>
        // `
        results.style.minWidth = '45pc';
        let img$ = document.createElement("img");
        img$.src = item.snippet.thumbnails.default.url;
        img$.className = "video-thumb";
        // appending image to list element
        li$.appendChild(img$);
        //div wrapper for video header and description
        let divText$ = document.createElement("div");
        divText$.className = "video-desc";
        // Header for Video search result
        let header$ = document.createElement("h6");
        header$.textContent = item.snippet.title;
        header$.className = "video-header";
        header$.style.marginBottom = "5px";
        header$.style.marginTop = "10px";
        header$.style.textTransform = "uppercase";
        // appending video header to div wrapper element
        divText$.appendChild(header$);
        // Anchor element for video url link
        let a$ = document.createElement("a");
        a$.href = "www.youtube.com/watch?v=" + item.id.videoId;
        a$.textContent = item.snippet.description
        a$.className = "video-link";
        a$.style.color = "#76bd69";
        // appending archor element to div wrapper
        divText$.appendChild(a$);
        // appending div wrapper to list element
        li$.appendChild(divText$);
        // appending list element to results list element
        results.appendChild(li$);
    } else if (item.url) {
        // results.style.minWidth = '55pc';
        li$.style.margin = '2px';
        let radio$ = document.createElement("input");
        radio$.id = "urlcheck";
        radio$.type = "checkbox";
        radio$.checked = true;
        radio$.addEventListener("click", evt => {
            let hrefUrl = evt.srcElement.parentElement.children[1].href;
            resultData = resultData.filter((el, indx) => {
                return (el.url !== hrefUrl);
            });
        });
        let divText$ = document.createElement("div");
        divText$.className = "url-desc";
        let img$ = document.createElement("img");
        img$.src = item.favIconUrl;
        img$.className = "url-thumb";
        // appending image to list element
        li$.appendChild(img$);
        let a$ = document.createElement("a");
        a$.href = item.url;
        a$.textContent = item.url;
        a$.className = "url-link";
        a$.style.color = "#76bd69";
        divText$.appendChild(radio$);
        divText$.appendChild(a$);
        li$.appendChild(divText$);
        results.appendChild(li$);
    } else {
        li$.style.margin = '2px';

        let btnCheckUrls$ = document.createElement("button");
        btnCheckUrls$.textContent = "Check";
        btnCheckUrls$.className = "taburls " + item;
        btnCheckUrls$.addEventListener("click", evt => {
            let timestamp = evt.srcElement.className.split(" ")[1];
            db.ref("urls/"+timestamp).once("value",snapshot => {
                let data = snapshot.val();
                results.textContent = '';
                data.forEach(value => {
                    setResultsList(value);
                });
            });
        });

        let divText$ = document.createElement("div");
        divText$.className = "url-desc";
        divText$.textContent = new Date(parseInt(item));

        li$.appendChild(btnCheckUrls$);
        li$.appendChild(divText$);
        results.appendChild(li$);

    }
}

save.addEventListener("click", (key) => {
    db.ref("urls").child(new Date().getTime()).set(resultData);
});

checkurls.addEventListener("click", (evt) => {
    results.textContent = '';
    db.ref("urls").once("value").then( (snapshot) => {
        let data = snapshot.val();
        Object.keys(data).forEach(key => {
            setResultsList(key);
        })
    })
});