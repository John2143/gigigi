
import Vue from "vue";
import index from "./index.vue";
import * as constData from "../shared/data.js";
//import socketio from "socket.io";

//Vue.prototype.$socket = socketio();
Vue.prototype.$socket = {emit: () => {}, on: () => {}};
Vue.prototype.$constData = constData;
Vue.prototype.$LEAGUE = "Harbinger";
Vue.prototype.$isDev = true;

Vue.mixin({
    methods: {
        //Currency translate
        cnfa: id => constData.currencyAbbrList[id][1],
        //Currency translate abbriv.
        cnfas: id => constData.currencyAbbrList[id][2][0]
    },
});

let app = new Vue({
    el: "#app",
    render: h => h(index),
});
