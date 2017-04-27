export const cache = (target, key, desc) => {
    let cachedVal;

    let oldget = desc.get;
    desc.get = function(){
        if(cachedVal) return cachedVal;
        return cachedVal = oldget.call(this);
    };
    desc.set = function(val){
        cachedVal = val;
    }
}
