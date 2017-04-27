global.Promise = require("bluebird")

global.http = require("http");
global.https = require("https");
global.fs = require("fs");

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
