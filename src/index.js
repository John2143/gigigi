require('source-map-support').install();
import "./global.js";

import {parseStash} from "./parser.js";
import {emit, runServer} from "./server.js";
import {runIndexer} from "./indexer.js";
import "./currencyRates.js";

export async function runAll(){
    runIndexer();
    runServer();
}

if(require.main === module){
    runServer();
};
