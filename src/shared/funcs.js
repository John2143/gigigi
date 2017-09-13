
//WS serialize and deserialize
export function wserialize(name, data){
    return JSON.stringify({name, data});
}

export function wdeserialize(raw){
    let parsed = JSON.parse(raw);
    return [parsed.name, parsed.data];
}

let hooks = {};
export function addSocketHook(name, hook){
    hooks[name] = hook;
}

export function applySocketHook(sock, raw){
    try{
        let [hook, data] = wdeserialize(raw);
        if(hooks[hook]){
            if(SERVER){
                hooks[hook].call(null, sock, data);
            }else{
                hooks[hook].call(null, data);
            }
        }else{
            if(SERVER){
                log(chalk`Tried to call invalid hook {cyan ${hook}} with data {magenta ${data}}`);
            }else{
                console.log(`Tried to call invalid hook ${hook} with data ${data}`);
            }
        }
    }catch(e){
        if(e instanceof SyntaxError){
            if(SERVER){
                log(chalk`Invalid json passed via ws {grey ${raw}}`);
            }else{
                console.log("Invalid json passed via ws", raw);
            }
        }
    }
}
