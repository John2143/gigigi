import itemFilter from "./filter.js";
import PriceTag from "./PriceTag.js";

const refineName = name => {
    return name.replace(/<<.+>>/g, "");
};

const socketData = sockets => {
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

export const parseItem = (stash, it) => {
    it.fullName = (it.name ? it.name + " " : "") + it.typeLine;

    //remove localization tags
    if(it.fullName.startsWith("<<")) it.fullName = refineName(it.fullName);

    //create price tag
    it.priceTag = new PriceTag(it.note, stash.stash);
    it.sockets = socketData(it.sockets);

    itemFilter(stash, it);
};

export const parseStash = stash => {
    //idk what this means
    if(stash.accountName == null) return;

    //fs.writeFileSync("stash.json", JSON.stringify(stash, null, 2));

    for(let item of stash.items){
        parseItem(stash, item);
    }
};
