
import Vue from "vue";
import index from "./index.vue";
import * as constData from "../shared/data.js";
import {startSocket} from "./socket.js";

startSocket();
Vue.prototype.$constData = constData;
Vue.prototype.$LEAGUE = "Harbinger";
Vue.prototype.$isDev = !PRODUCTION;

Vue.mixin({
    methods: {
        //Currency translate
        cnfa: id => constData.currencyAbbrList[id][1],
        //Currency translate abbriv.
        cnfas: id => constData.currencyAbbrList[id][2][0]
    },
});

new Vue({
    el: "#app",
    render: h => h(index),
});
