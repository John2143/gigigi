
let alerts = [];
let app = angular.module("main", []);
app.controller("same", function($scope){
    window.$scope = $scope;
    $scope.alerts = alerts;
    $scope.totalStashes = 0;
    $scope.timesNames = ["download", "json parse", "item parse"];
    $scope.perfHist = [];
    $scope.perfCur = {};

    const dateDistance = $scope.dateDistance = d => {
        let time = (Date.now() - d.getTime()) / 1000;
        const plural = () => time == 1 ? " ago" : "s ago";
        time = Math.floor(time);
        if(time < 60) return time + " second" + plural();
        time /= 60;
        time = Math.floor(time);
        if(time < 60) return time + " minute" + plural();
        time /= 60;
        time = Math.floor(time);
        if(time < 24) return time + " hour" + plural();;
        if(time < 48) return "Yesterday";
        time /= 24;
        time = Math.floor(time);
        if(time < 31) return time + " day" + plural();
        time /= 30;
        time = Math.floor(time);
        if(time < 12) return time + " month" + plural();
        time /= 12;
        time = Math.floor(time);
        return time + " year" + plural();
    };

    window.onAngular();

});

window.socket = io();
socket.on("youconnected", () => {
    console.log("Connected...");
});
socket.on("connected", () => {
    console.log("someone connected...");
});
socket.on("log", x => {
    console.log(x);
});

//Download required sounds
let sounds = ["whoop.mp3", "alert.mp3"];
for(let file of sounds){
    sounds[file] = new Audio("/" + file);
    sounds[file].volume = .1;
}

const playSound = sound => {
    if(sound && sounds[sound]) sounds[sound].play();
};

const addAlert = dat => {
    console.log(dat);
    if(dat.sounds && !$scope.isMuted) playSound(dat.sound);
    dat.time = new Date();
    alerts.push(dat);
    $scope.$apply();
};
socket.on("alert", addAlert);

socket.on("currency", dat => {
    $scope.currency = dat;
    $scope.$apply();
    console.log("done", dat);
});

socket.on("indexerProfile", dat => {
    console.log(dat);
    let perf = $scope.perf = {};
    perf.times = dat.times;
    perf.curStashes = dat.numStashes;
    perf.rateLimit = dat.rateLimit;
    $scope.perfHist.push(perf);

    $scope.nextID = dat.nextID;
    $scope.totalStashes += dat.numStashes;
    $scope.$apply();
});

window.onAngular = () => {

    $scope.currentBase = 4;
    $scope.currentCandy = 6;

    $scope.setBase = i => $scope.currentBase = i;
    $scope.setCandy = i => $scope.currentCandy = i;
    $scope.updateCurr = () => {
        let a = $scope.currentBase;
        let b = $scope.currentCandy;
        socket.emit("updatecurr", [a, b]);
        console.log("updatecurr", [a, b]);
    };

    $scope.baseCurrencies = [4, 6]; //chaos and exalt
    $scope.candy = [];
    for(let i = 0; i < constData.currencyAbbrList.length; i++){
        if(constData.currencyAbbrList[i][0] === 1) $scope.candy.push(i);
    }

    $scope.cnfa = id => constData.currencyAbbrList[id][1];
    $scope.cnfas = id => constData.currencyAbbrList[id][2][0];

    $scope.tabbuttons = ["Items", "Currency"];
    $scope.currentTab = $scope.tabbuttons[0];
    $scope.updateTab = tab => $scope.currentTab = tab;

};
