import {register} from "./filter.js";
import PriceTag from "./PriceTag.js";

const maxBO = new PriceTag(12, "chaos", true);
register((stash, it) => {
    return it.sockets.maxlink === 6 && it.priceTag.compareBO(maxBO);
});
