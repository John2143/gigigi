export const cache = (target, key, desc) => {
    let cachedVal;

    let oldget = desc.get;
    desc.get = function(){
        if(cachedVal) return cachedVal;
        return cachedVal = oldget.call(this);
    };
    desc.set = function(val){
        cachedVal = val;
    };
};

global.filterFuncs = [];
global.listOfSounds = [];

export const alert = (sound = "whoop.mp3") => (target, key, desc) => {
    console.log(`adding ${key} func`);
    filterFuncs.push({func: desc.value, desc: key, sound: sound === "none" ? null : sound});
    if(listOfSounds.indexOf(sound) === -1 && sound !== "none") listOfSounds.push(sound);
};

export const whoop = (...r) => alert()(...r);
export const ding = (...r) => alert("alert.mp3")(...r);
export const quiet = (...r) => alert("none")(...r);