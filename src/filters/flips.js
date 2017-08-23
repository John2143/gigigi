import {whoop, quiet, alert, ding} from "../decorators.js";
import PriceTag from "../PriceTag.js";

const maxBO = new PriceTag(5, "chaos", true);
export default class{
    @ding six_link_to_divine(stash, it){
        return it.sockets.maxlink === 6 &&
            it.priceTag.compareBO(maxBO);
    }

    //An ilvl83- belt is around 15c, ilvl84 is about 10 ex, so its an easy flip
    @whoop i84_crystal_belt(stash, it){
        return it.typeLine.toLowerCase() === "Crystal Belt" && it.ilvl >= 84;
    }
}
