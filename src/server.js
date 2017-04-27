let url = require("url");

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

server.listen(6001);

io.on("connection", socket => {
    console.log("socket connection");
    emit("connected");
    socket.emit("alertSoundList", listOfSounds);
    socket.emit("youconnected");
    socket.on("disconnect", () => {
        emit("disconnected");
    });
});
