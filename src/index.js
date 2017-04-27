import http from "http";
import https from "https";
global.fs = require("fs");
import {parseStash} from "./parser.js";

const rateLimit = 2500;
const savePath = "./save.id";

global.GET = url => {
    return new Promise((resolve, reject) => {
        (url.startsWith("https") ? https : http).get(url, res => {
            let rawdata = "";
            res.on("data", chunk => rawdata += chunk);
            res.on("end", () => resolve(rawdata));
        }).on("error", err => reject(err));
    });
};

global.log = (...args) => {
    console.log(new Date(), ...args);
};

global.millis = () => new Date().getTime();

let nextID = "0";

let timerPromise;
const newTimerPromise = time => {
    return new Promise((resolve, _reject) => {
        setTimeout(resolve, time);
    });
};

let apiRequest;

const parseRequest = (rawjson, timearr) => {
    let json;
    try{
        json = JSON.parse(rawjson);
        timearr.push(millis());
    }catch(e){
        log("Bad data from poe api");
        return;
    }

    nextID = json.next_change_id;
    fs.writeFileSync(savePath, nextID);

    let stashes = json.stashes;

    for(let stash of stashes){
        parseStash(stash);
    }

    timearr.push(millis());

    //calculate and log time
    let times = [];
    for(let i = 0; i < timearr.length - 1; i++){
        times[i] = timearr[i + 1] - timearr[i];
        times[i] /= 1000;
        times[i] = times[i].toFixed(2);
    }

    log(`got ${stashes.length} stashes, download ${times[0]}s, json ${times[1]}s, parse ${times[2]}s`);

    timerPromise
        .then(apiRequest)
        .catch(err => {
            log("Unhandled Exception, continuing anyway", err);
        });
};

apiRequest = async () => {
    timerPromise = newTimerPromise(rateLimit);

    let timearr = [];
    timearr.push(millis());
    let rawjson = await GET("http://www.pathofexile.com/api/public-stash-tabs?id=" + nextID);
    timearr.push(millis());
    parseRequest(rawjson, timearr);
};

fs.readFile(savePath, "utf-8", (err, dat) => {
    let stat;
    try{stat = fs.statSync(savePath);}catch(e){err = true;}
    if(err || (new Date() - stat.mtime)/1000 > 60){
        GET("http://poe.ninja/api/Data/GetStats")
            .then(stats => {
                let key = JSON.parse(stats);
                if(!key) throw "couldnt find key on poe.ninja";
                nextID = key.nextChangeId;
                log("got key from poe.ninja, ", nextID);
            })
            .then(apiRequest)
            .catch(err => log("Failed to start:", err));
    }else{
        nextID = dat;
        log("got key from file", nextID);
        apiRequest();
    }
});
