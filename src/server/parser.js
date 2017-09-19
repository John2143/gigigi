import itemFilter from "./filter.js";
import PriceTag from "./PriceTag.js";

const refineName = name => name.replace(/<<.+>>/g, "");

function refineSocketData(sockets){
    //The longest link in the item
    let maxlink = 0;

    //The string representing the item (example: R-G-B-B + R-G)
    let linkstr = "";

    //current link length
    let curlink = 0;

    let group = -1;

    //Map from api socket type to socket color
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
}

function compactProperties(props){
    if(!props) return;

    let newProps = {};
    for(let prop of props){
        let key = prop.name.toLowerCase().replace(" ", "_");
        if(prop.values && prop.values[0]) newProps[key] = prop.values[0][0];
    }
}

export function parseItem(stash, it){
    it.fullName = (it.name ? it.name + " " : "") + it.typeLine;

    //remove localization tags
    if(it.fullName.startsWith("<<")) it.fullName = refineName(it.fullName);

    //create price tag
    it.priceTag = new PriceTag(it.note, stash.stash);
    it.sockets = refineSocketData(it.sockets);
    it.newProps = compactProperties(it.properties);
    it.newReqs = compactProperties(it.requirements);

    itemFilter(stash, it);
}

export function parseStash(stash){
    //idk what this means
    if(stash.accountName == null) return;

    //fs.writeFileSync("stash.json", JSON.stringify(stash, null, 2));

    for(let item of stash.items){
        parseItem(stash, item);
    }
}
