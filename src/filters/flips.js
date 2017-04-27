import {whoop, quiet, alert} from "../decorators.js";
import PriceTag from "../PriceTag.js";

const maxBO = new PriceTag(12, "chaos", true);
export default class{
    @whoop six_link_to_divine(stash, it){
        return it.sockets.maxlink === 6 &&
            it.priceTag.compareBO(maxBO);
    }

    @quiet es_shield_spell_crit(stash, it){
        return false;
    }
}
