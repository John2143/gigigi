
import * as constData from "./data.js"
import * as url from "url";

let server = http.createServer((req, res) => {
    let path = url.parse(req.url).pathname;

    if(path === "/"){
        path = "/index.html";
    }

    res.writeHead(200);
    //res.end("lol");
    try{
        path = "./src/" + path;
        fs.statSync(path);
        fs.createReadStream(path).pipe(res);
    }catch(e){
    }
});

let io = require("socket.io")(server);

export const emit = (...r) => io.emit(...r);

export async function runServer(){
    server.listen(6001);
}

let extraHooks = {};
export function addSocketHook(name, hook){
    extraHooks[name] = hook;
}

io.on("connection", socket => {
    console.log("socket connection");
    emit("connected");
    socket.emit("alertSoundList", listOfSounds);
    socket.emit("youconnected");
    for(let hook in extraHooks){
        socket.on(hook, function(data){
            extraHooks[hook].call(null, this, data);
        });
    }
});

addSocketHook("requestdata", sock => {
    sock.emit("requestdata", constData);
});
