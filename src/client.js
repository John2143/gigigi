
let alerts = [];
angular.module("main", []).controller("same", function($scope){
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

var socket = io();
socket.on("youconnected", () => {
    console.log("Connected...");
});
socket.on("connected", () => {
    console.log("someone connected...");
});
socket.on("log", x => {
    console.log(x);
});

let sounds;
socket.on("alertSoundList", dat => {
    sounds = {};
    for(let file of dat){
        sounds[file] = new Audio("/" + file);
    }
    console.log("new sounds", sounds);
});

const playSound = sound => {
    if(sound && sounds[sound]) sounds[sound].play();
};

const addAlert = dat => {
    console.log(dat);
    playSound(dat.sound);
    dat.time = new Date();
    alerts.push(dat);
    $scope.$apply();
};
socket.on("alert", addAlert);

socket.on("reqdata", dat => {
    console.log(dat);
    let perf = $scope.perf = {};
    perf.times = dat.times;
    perf.curStashes = dat.numStashes;
    perf.rateLimit = dat.rateLimit;
    $scope.perfHist.push(perf);

    $scope.nextID = dat.nextID;
    $scope.totalStashes += dat.numStashes;
    $scope.$apply();
    setChart();
});

socket.on("currency", dat => {
    $scope.currency = dat;
    $scope.$apply();
    console.log("done");
});

socket.on("requestdata", dat => {
    console.log("got data", dat);
    $scope.constData = dat;

    $scope.baseCurrencies = [4, 6]; //chaos and exalt
    $scope.candy = [];
    for(let i = 0; i < dat.currencyAbbrList.length; i++){
        if(dat.currencyAbbrList[i][0] === 1) $scope.candy.push(i);
    }
    $scope.$apply();
});

window.onAngular = () => {

$scope.setBase = i => $scope.currentBase = i;
$scope.setCandy = i => $scope.currentCandy = i;
$scope.updateCurr = () => {
    $scope.currency = {};
    let a = $scope.currentBase;
    let b = $scope.currentCandy;
    socket.emit("updatecurr", [a, b]);
    console.log("updatecurr", [a, b]);
};

socket.emit("requestdata");
$scope.cnfa = id => $scope.constData.currencyAbbrList[id][1];
$scope.cnfas = id => $scope.constData.currencyAbbrList[id][2][0];



};

//todo add ring buffer to represnt data

//let ctx = document.getElementById("perfchart").getContext("2d");
//let myChart = new Chart(ctx, {
    //type: "line",
    //data: {
        //labels: ["1", "2", "3", "4", "5", "6", "7"],
        //datasets: [
            //{
                //label: "downloads",
                //fill: false,
                //lineTension: 0.1,
                //backgroundColor: "rgba(75,192,192,0.4)",
                //borderColor: "rgba(75,192,192,1)",
                //borderCapStyle: 'butt',
                //borderDash: [],
                //borderDashOffset: 0.0,
                //borderJoinStyle: 'miter',
                //pointBorderColor: "rgba(75,192,192,1)",
                //pointBackgroundColor: "#fff",
                //pointBorderWidth: 1,
                //pointHoverRadius: 5,
                //pointHoverBackgroundColor: "rgba(75,192,192,1)",
                //pointHoverBorderColor: "rgba(220,220,220,1)",
                //pointHoverBorderWidth: 2,
                //pointRadius: 1,
                //pointHitRadius: 10,
                //data: [7,6,3,2,0,2,3,6,8],
                //spanGaps: false,
            //},
        //],
    //},
    //options: {
        //scales: {
            //yAxes: [{
                //ticks: {
                    //beginAtZero: true,
                //}
            //}]
        //}
    //}
//});

//var setChart = () => {
    //myChart.data.datasets[0].data = [65, 59, 80, 81, 56, 55, 40].map(x => x * Math.random());
    //myChart.update();
//};
