const fs = require("fs");
let parseItem = module.exports.item = (stash, it) => {
    if(stash.accountName.toLowerCase() !== "john2143658709") return;
    if(it.ilvl != 80) return;
    console.log(it);
};

let parseStash = module.exports.stash = stash => {
    //idk what this means
    if(stash.accountName == null) return;

    for(let item of stash.items){
        parseItem(stash, item);
    }
};
