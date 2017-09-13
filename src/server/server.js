
import {svPort, wsPort} from "./data.js";
import {applySocketHook, wserialize} from "./funcs.js";
import url from "url";
import uws from "uws";

export let server = http.createServer((req, res) => {
    let path = url.parse(req.url).pathname;

    //Default to index.html
    if(path === "/") path = "/index.html";
    if(!path.startsWith("/")) path = "/" + path;
    path = "./client" + path;

    try{
        //check if it exists
        fs.statSync(path);

        res.writeHead(200);
        fs.createReadStream(path).pipe(res);
    }catch(e){
        res.writeHead(404);
        res.end();
    }
});

export let wss = new uws.Server({port: wsPort});

export function emitOne(socket, ...r){
    socket.send(wserialize(...r));
}

export function emit(...r){
    for(let client of wss.clients){
        if(client.readyState === uws.OPEN){
            emitOne(client, ...r);
        }
    }
}

export async function runServer(){
    server.listen(svPort);
}

export async function stopServer(){
    server.close();
}

export {addSocketHook} from "./funcs.js";

let globalID = 0;
wss.on("connection", socket => {
    socket.gID = globalID++;

    log(chalk`Socket connection {green opened} {cyan ${socket.gID}}`);

    socket.on("close", function(raw){
        log(chalk`Socket connection {red closed} {cyan ${socket.gID}}`);
    });
    socket.on("message", function(raw){
        log(chalk`Socket message {cyan ${socket.gID}}`);
        applySocketHook(socket, raw);
    });
    socket.emit = function(...r){
        emitOne(socket, ...r);
    };
});
