
window.socket = io();

let app = new Vue({
    el: "#app",
    data: {
        tabButtons: ["Items", "Currency"],
        currentTab: "Currency",
    },
    methods: {
        t: function(tab){
            console.log("asdf", tab);
        },
        updateCurr: (a, b) => {
            socket.emit("updatecurr", [a, b]);
            console.log("updatecurr", [a, b]);
        },
    },
});


setBase = i => $scope.currentBase = i;
setCandy = i => $scope.currentCandy = i;

$scope.baseCurrencies = [4, 6]; //chaos and exalt
$scope.candy = [];
for(let i = 0; i < constData.currencyAbbrList.length; i++){
    if(constData.currencyAbbrList[i][0] === 1) $scope.candy.push(i);
}
