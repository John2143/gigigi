export function cache(target, key, desc){
    let cachedVal;

    let oldget = desc.get;
    desc.get = function(){
        if(cachedVal) return cachedVal;
        return cachedVal = oldget.call(this);
    };
    desc.set = function(val){
        cachedVal = val;
    };
}

export let filterFuncs = [];

export const alert = sound => (target, key, desc) => {
    log(chalk`adding {magenta ${key}} filter`);
    filterFuncs.push({func: desc.value, desc: key, sound});
};

export const whoop = (...r) => alert("whoop.mp3")(...r);
export const ding = (...r) => alert("alert.mp3")(...r);
export const quiet = (...r) => alert(undefined)(...r);
