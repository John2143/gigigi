require("source-map-support").install();
import "./global.js";

import {runServer} from "./server.js";
import {runIndexer} from "./indexer.js";
import "./currencyRates.js";

export async function runAll(){
    runIndexer();
    runServer();
}

//If included by node process
if(require.main === module){
    //Indexer is not started by default, its a big resource hog
    runServer();
    if(global.processFlags.i) runIndexer();
}
