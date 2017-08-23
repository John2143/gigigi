import {currencyAbbrList} from "./data.js";
import {emit, addSocketHook} from "./server.js";

const cnfa = id => currencyAbbrList[id][1];

const baseCurrencies = [4, 6]; //chaos and exalt
const candy = [];
for(let i = 0; i < currencyAbbrList.length; i++){
    if(currencyAbbrList[i][0] === 1) candy.push(i);
}

const url = (want, have) => `http://currency.poe.trade/search?league=${LEAGUE}&online=x&want=${want}&have=${have}`;

const getCurrencyTrades = async (want, have) => {
    let poetrade = await GET(url(want, have));

    //capture all divs
    let trade = /<div class="displayoffer\s?"([^>]*?)>/gim;
    let result;
    let objs = [];
    while(result = trade.exec(poetrade)){
        let trade = {};
        //Capture all 'data-xxxx="yyyy"' attribs
        let fields = /data\-(\w+)="([^"]+?)"/gi;
        let dataResult;
        while(dataResult = fields.exec(result[1])){
            trade[dataResult[1]] = Number(dataResult[2]) || dataResult[2];
        }
        trade.ratiobuy = trade.buyvalue / trade.sellvalue;
        trade.ratiosell = trade.sellvalue / trade.buyvalue;
        trade.dispratio = Math.max(trade.ratiobuy, trade.ratiosell).toFixed(2);
        objs.push(trade);
    }
    return objs;
}

const currencyMarket = async (a, b) => {
    //TODO make actually async
    let btoa = await getCurrencyTrades(a, b);
    let atob = await getCurrencyTrades(b, a);
    //log(`buying ${cnfa(b)} for ${cnfa(a)}`, btoa.map(x => x.dispratio));
    //log(`selling ${cnfa(b)} for ${cnfa(a)}`, atob.map(x => x.dispratio));

    return {a, b, btoa, atob};
}

addSocketHook("updatecurr", async (sock, data) => {
    sock.emit("log", "ok");
    let curr = await currencyMarket(data[0], data[1]);
    sock.emit("currency", curr);
});
