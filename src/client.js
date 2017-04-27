
let alerts = [];
angular.module("main", []).controller("same", function($scope){
    window.$scope = $scope;
    $scope.alerts = alerts;
    $scope.totalStashes = 0;
});

var socket = io();
socket.on("youconnected", () => {
    console.log("Connected...");
});
socket.on("connected", () => {
    console.log("someone connected...");
});
socket.on("disconnected", () => {
    console.log("someone dcd...");
});

let sounds;
socket.on("alertSoundList", dat => {
    sounds = {};
    for(let file of dat){
        sounds[file] = new Audio("/" + file);
    }
    console.log("new sounds", sounds);
});

socket.on("alert", dat => {
    console.log(dat);
    //if(!dat.sound || !sounds[dat.sound]) sounds[dat.sound].play();
    alerts.push(dat);
});
socket.on("reqdata", dat => {
    console.log(dat);
    let times = dat.times;
    $scope.times = `download ${times[0]}s, json ${times[1]}s, parse ${times[2]}s`;
    $scope.totalStashes += dat.numStashes;
    $scope.curStashes = dat.numStashes;
    $scope.rateLimit = dat.rateLimit;
    $scope.nextID = dat.nextID;
    $scope.$apply();
});
