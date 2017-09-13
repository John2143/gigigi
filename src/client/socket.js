
import {addSocketHook, applySocketHook, wserialize} from "../shared/funcs.js";
import {wsPort} from "../shared/data.js";
export {addSocketHook} from "../shared/funcs.js";

export let socket;

export function emit(name, data){
    if(!socket){
        console.log("Socket is not open right now");
        return false;
    }
    socket.send(wserialize(name, data));
    return true;
}

export function startSocket(){
    socket = new WebSocket(`ws://${document.domain}:${wsPort}`);
    socket.onopen = function(_ev){
        console.log("connected to server");
    };
    socket.onmessage = function(raw){
        applySocketHook(this, raw.data);
    };
    socket.onclose = function(ev){
        console.log("websocket closing: " + ev.reason, ev.code, ev.wasClean);
        socket = null;
    };
}

addSocketHook("log", data => {
    if(!PRODUCTION){
        console.log("SV MSG", data);
    }
});
