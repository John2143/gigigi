global.Promise = require("bluebird");

global.http = require("http");
global.https = require("https");
global.fs = Promise.promisifyAll(require("fs"));
global.chalk = require("chalk");

global.CLIENT = false;
global.SERVER = true;

global.GET = url => {
    return new Promise((resolve, reject) => {
        (url.startsWith("https") ? https : http).get(url, res => {
            let rawdata = "";
            res.on("data", chunk => rawdata += chunk);
            res.on("end", () => resolve(rawdata));
        }).on("error", err => reject(err));
    });
};

import {dateToString as d2s} from "./misc.js";

global.log = (...args) => {
    console.log(chalk`[{grey ${d2s("r")}}]`, ...args);
};

global.millis = () => new Date().getTime();
global.LEAGUE = "Harbinger";

+function(){
    let flagName = null;
    let flags = {};

    for(let x = 2; x < process.argv.length; x++){
        let cur = process.argv[x];

        if(cur[0] == "-"){
            if(flagName) flags[flagName] = true;
            flagName = cur.slice(1);
        }else{
            if(flagName){
                flags[flagName] = cur;
            }
            flagName = null;
        }
    }
    if(flagName) flags[flagName] = true;

    global.processFlags = flags;
}();
