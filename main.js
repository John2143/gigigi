let http = require("http");
let https = require("https");
let fs = require("fs");

global.GET = url => {
    return new Promise((resolve, reject) => {
        (url.startsWith("https") ? https : http).get(url, res => {
            let rawdata = "";
            res.on("data", chunk => rawdata += chunk);
            res.on("end", () => resolve(rawdata));
        }).on("error", err => reject(err));
    });
};

const rateLimit = 5000;

let nextID = "0";

let timerPromise;
const newTimerPromise = time => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time);
    });
};

let apiRequest;
const mainLoop = () => {
    timerPromise = newTimerPromise(rateLimit);
    apiRequest();
}

const parseRequest = rawjson => {
    let json;
    try{
        json = JSON.parse(rawjson);
    }catch(e){
        console.log("Bad data from poe api");
        return;
    }

    nextID = json.next_change_id;

    let stashes = json.stashes;
    console.log(stashes.length);

    timerPromise.then(mainLoop);
};

apiRequest = async () => {
    let rawjson = await GET("http://www.pathofexile.com/api/public-stash-tabs?id=" + nextID);
    parseRequest(rawjson);
};

GET("http://poe.ninja/api/Data/GetStats")
    .then(stats => {
        let key = JSON.parse(stats);
        if(!key) throw "couldnt find key on poe.ninja";
        nextID = key.nextChangeId;
        console.log("got key from poe.ninja, ", nextID);
    })
    .then(mainLoop)
    .catch(err => console.log("Failed to start:", err));
