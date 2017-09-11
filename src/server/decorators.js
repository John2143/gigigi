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

export const alert = sound => (target, key, desc) => {
    console.log(`adding ${key} filter`);
    global.filterFuncs.push({func: desc.value, desc: key, sound});
};

export const whoop = (...r) => alert("whoop.mp3")(...r);
export const ding = (...r) => alert("alert.mp3")(...r);
export const quiet = (...r) => alert(undefined)(...r);
