const fs = require("fs");
const PriceTag = require("./PriceTag.js");

const itemToWhisper = (stash, it) => {
    // stashtypes: PremiumStash, EssenceStash, CurrencyStash, DivinationCardStash, QuadStash
    if(stash.stashType !== "PremiumStash" && stash.stashType !== "QuadStash"){
        return `@${stash.lastCharacterName} Hi, I would like to buy your ${it.fullName} for ${it.priceTag.string} in ${it.league} (stash tab "${stash.stash}")`;
    }else{
        return `@${stash.lastCharacterName} Hi, I would like to buy your ${it.fullName} for ${it.priceTag.string} in ${it.league} (stash tab "${stash.stash}"; position: left ${it.x}, top ${it.y})`;
    }
};

const refineName = name => {
    return name.replace(/<<.+>>/g, "");
};

const socketsToLinks = sockets => {
    let maxlink = 0;
    let curlink = 0;

    let linkstr = "";

    let group = -1;
    const map = {
        D: "G", S: "R", I: "B", G: "W"
    };

    for(let socket of sockets){
        curlink++;
        if(socket.group != group && group != -1){
            curlink = 0;
            linkstr += " + ";
        }
        if(curlink > maxlink) maxlink = curlink;
        group = socket.group;
        linkstr += map[socket.attr];
    }

    return {sockets: sockets.length, linkstr, maxlink};
};

console.log(new PriceTag("~b/o 44/10 chaos"))

let testBO = new PriceTag(5, "chaos", true);
let parseItem = module.exports.item = (stash, it) => {
    if(it.league !== "Legacy") return;

    it.fullName = (it.name ? it.name + " " : "") + it.typeLine;
    //remove localization tags
    if(it.fullName.startsWith("<<")) it.fullName = refineName(it.fullName);

    //create price tag
    it.priceTag = new PriceTag(it.note, stash.stash);
    it.links = socketsToLinks(it.sockets);
    if(it.priceTag.compareBO(testBO)) console.log(it.priceTag.string, it.priceTag.note);
};

let parseStash = module.exports.stash = stash => {
    return;
    //idk what this means
    if(stash.accountName == null) return;

    //fs.writeFileSync("stash.json", JSON.stringify(stash, null, 2));

    for(let item of stash.items){
        parseItem(stash, item);
    }
};
