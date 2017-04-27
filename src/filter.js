import "./filters/flips.js";
import {emit} from "./server.js";

export const itemToWhisper = (stash, it) => {
    // stashtypes: PremiumStash, EssenceStash, CurrencyStash, DivinationCardStash, QuadStash
    if(stash.stashType !== "PremiumStash" && stash.stashType !== "QuadStash"){
        return `@${stash.lastCharacterName} Hi, I would like to buy your ${it.fullName} for ${it.priceTag.string} in ${it.league} (stash tab "${stash.stash}")`;
    }else{
        return `@${stash.lastCharacterName} Hi, I would like to buy your ${it.fullName} for ${it.priceTag.string} in ${it.league} (stash tab "${stash.stash}"; position: left ${it.x + 1}, top ${it.y + 1})`;
    }
};

export default (stash, it) => {
    if(it.league !== "Legacy") return;
    for(let filter of filterFuncs){
        if(filter.func(stash, it)){
            emit("alert", {
                desc: filter.desc,
                whisper: itemToWhisper(stash, it),
                sound: filter.sound,
                it, stash,
            });
            break;
        }
    }
};
