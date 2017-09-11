import {parseStash} from "./parser.js";
import {emit} from "./server.js";

const rateLimit = 2500;
const savePath = "./save.id";

let nextID = "0";

let timerPromise;
const newTimerPromise = time => {
    return new Promise((resolve, _reject) => {
        setTimeout(resolve, time);
    });
};

let indexerRunning = false;
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
    emit("indexerProfile", {times, numStashes: stashes.length, rateLimit, nextID});

    if(indexerRunning) timerPromise
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

export async function runIndexer(){
    if(indexerRunning) return;

    indexerRunning = true;

    let badKey = true;
    let dat;
    try{
        let stat = await fs.statSync(savePath);
        dat = await fs.readFileAsync(savePath, "utf-8");
        badKey = (new Date() - stat.mtime)/1000 > 60;
    }catch(e){
        log("Key could not be read");
    }

    if(badKey){
        log("Getting new key from poe.ninja");
        let stats = await GET("http://poe.ninja/api/Data/GetStats");
        let key = JSON.parse(stats);
        if(!key) throw "couldnt find key on poe.ninja";
        nextID = key.nextChangeId;
        log("got key from poe.ninja, ", nextID);
        apiRequest();
    }else{
        nextID = dat;
        log("got key from file", nextID);
        apiRequest();
    }
}

export function stopIndexer(){
    indexerRunning = false;
}
