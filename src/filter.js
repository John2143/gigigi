let funcs = [];
export const register = func => {
    funcs.push(func);
};

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
};
