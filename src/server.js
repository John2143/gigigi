
import * as constData from "./data.js"
import * as url from "url";

let server = http.createServer((req, res) => {
    let path = url.parse(req.url).pathname;

    //Default to index.html
    if(path === "/") path = "/index.html";

    try{
        path = (path.endsWith(".js") ? "./c/" : "./src/") + path;
        //check if it exists
        fs.statSync(path);

        res.writeHead(200);
        fs.createReadStream(path).pipe(res);
    }catch(e){
        res.writeHead(404);
        res.end();
    }
});

let io = require("socket.io")(server);

export const emit = (...r) => io.emit(...r);

export async function runServer(){
    server.listen(6001);
}

export async function stopServer(){
    server.close();
}

let extraHooks = {};
export function addSocketHook(name, hook){
    extraHooks[name] = hook;
}

io.on("connection", socket => {
    console.log("socket connection");
    emit("connected");
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
