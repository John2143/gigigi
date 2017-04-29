import {whoop, quiet, alert, ding} from "../decorators.js";
import PriceTag from "../PriceTag.js";

const maxBO = new PriceTag(12, "chaos", true);
export default class{
    @ding six_link_to_divine(stash, it){
        return it.sockets.maxlink === 6 &&
            it.priceTag.compareBO(maxBO);
    }
}
