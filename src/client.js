let socket = io();

let LEAGUE = "Harbinger";

Vue.mixin({
    methods: {
        //Currency translate
        cnfa: id => constData.currencyAbbrList[id][1],
        //Currency translate abbriv.
        cnfas: id => constData.currencyAbbrList[id][2][0]
    },
});

Vue.component("order", {
    props: ["order"],
    template: `
    <div class="row">
      <hr>

      <div class="col-xs-2">
        <button class="btn btn-primary" @click="open = !open">{{open ? "Close" : "Buy"}}</button>
      </div>
      <div class="col-xs-5">
        {{order.ratiosell.toFixed(3)}} &rArr;
        1 &rArr;
        {{order.ratiobuy.toFixed(3)}}
        <br>
        {{order.ign}}
      </div>
      <div class="col-xs-5">
        {{order.buyvalue}}{{cnfas(order.buycurrency)}} &rArr;
        {{order.sellvalue}}{{cnfas(order.sellcurrency)}}
        <br>
        <span v-if="order.stock">
          {{order.stock}} {{cnfas(order.sellcurrency)}}
        </span>
      </div>
      <div v-if="open" class="col-xs-12">
        <div class="col-xs-2">
          <input type="text" v-model="buyAmount" class="form-control" 
            v-on:keyup.13="$event.target.blur()"
            v-on:blur="sanatizeMultiplier()"
            v-on:focus="$event.target.select()">
        </div>
        <div class="col-xs-5">
          <button class="btn btn-primary" @click="buyAmount += order.buyvalue; sanatizeMultiplier()">+{{order.buyvalue}}</button>
          <button class="btn btn-primary" @click="buyAmount -= order.buyvalue; sanatizeMultiplier()">-{{order.buyvalue}}</button>
        </div>
        <div class="col-xs-5">
          <span>{{buyTextShort}}</span>
        </div>
        <div class="col-xs-12">
          <input type="text" v-model="buyTextMsg" class="form-control" readonly
            v-on:focus="$event.target.select()">
        </div>
        <div class="col-xs-12">
          <h4 v-if="warnings.tax"   class="trade-warning">Non-even trade: recieving amount rounded down.</h4>
          <h4 v-if="warnings.bm"    class="trade-warning">Trading for less than the offered amount is bad manners, even if the ratio is the same.</h4>
          <h4 v-if="warnings.stock" class="trade-warning">This user may not have enough stock to complete the trade.</h4>
        </div>
      </div>
    </div>
    `,
    data(){
        return{
            multiplier: 1,
            buyAmount: this.order.buyvalue,
            warnings: {},
            open: false,
        };
    },
    computed: {
        computedSellValue(){
            return Math.floor(this.multiplier * this.order.sellvalue);
        },
        computedBuyValue(){
            return this.multiplier * this.order.buyvalue;
        },
        buyTextShort(){
            return `${this.computedBuyValue} => ${this.computedSellValue}`;
        },
        buyTextMsg(){
            return `@${this.order.ign} Hi, I would like to buy your ${this.computedSellValue} ${this.cnfa(this.order.sellcurrency)} for my ${this.computedBuyValue} ${this.cnfa(this.order.buycurrency)} in ${LEAGUE}`;
        },
    },
    methods: {
        sanatizeMultiplier(){
            this.buyAmount = Number(this.buyAmount);
            if(!this.buyAmount || this.buyAmount == NaN) this.multiplier = 1;
            if(this.buyAmount < 1) this.buyAmount = 1;
            this.buyAmount = Math.floor(this.buyAmount);

            this.multiplier = Number(this.buyAmount / this.order.buyvalue);

            this.warnings.bm = this.multiplier < 1;
            this.warnings.stock = (this.order.stock && this.multiplier * this.order.sellvalue > this.order.stock);
            this.warnings.tax = !Number.isInteger(this.multiplier * this.order.buyvalue);
        },
    }
});

Vue.component("sellerList", {
    props: ["type", "orders"],
    template: `
    <div class="col-xs-6 container">
      {{cnfa(type)}} Sellers
      <order v-for="order of orderList" :order="order"></order>
    </div>
    `,
    computed: {
        orderList(){
            //slice because sort is in-place ((?TODO test this))
            let orders = this.orders.slice();

            if(this.$parent.showStockOnly){
                orders = orders.filter(x => Number(x.stock) > 1);
            }

            orders.sort((a, b) => b.ratiosell - a.ratiosell);
            return orders.slice(0, 20);
        },
    },
});

Vue.component("currencyTab", {
    template: `
    <div>
      <button class="btn btn-primary" @click="updateCurr">update currency rates</button>
      <div class="checkbox">
        <label><input type="checkbox" v-model="hasAllCurrencies">all curr</label>
      </div>
      <div class="checkbox">
        <label><input type="checkbox" v-model="showStockOnly">show stock only</label>
      </div>
      <div class="checkbox">
        <label><input type="checkbox" v-model="devMode">client only</label>
      </div>
      <button-list :buttons="baseCurrencies.map(cnfa)" :change="setBase"></button-list>
      <button-list :buttons="hasAllCurrencies ? allOtherCurrencies.map(cnfa) : otherCurrencies.map(cnfa)" :change="setOther"></button-list>
      <div v-if="currency">
        <seller-list :type="currency.a" :orders="currency.btoa"></seller-list>
        <seller-list :type="currency.b" :orders="currency.atob"></seller-list>
      </div>
    </div>
    `,
    data(){
        return {
            currentBase: 4,
            currentOther: 6,
            baseCurrencies: [4, 6],
            otherCurrencies: [],
            allOtherCurrencies: [],
            currency: null,
            hasAllCurrencies: false,
            showStockOnly: false,
            devMode: true,
        };
    },
    methods: {
        updateCurr(){
            this.currency = null;

            if(this.devMode){
                let tmpRates = localStorage.tmpRates;
                tmpRates = JSON.parse(tmpRates);
                setTimeout(() => {
                    this.currency = {
                        a: tmpRates.a,
                        b: tmpRates.b,
                        atob: tmpRates.atob,
                        btoa: tmpRates.btoa,
                    };
                }, 0);

                return;
            }

            let a = this.currentBase;
            let b = this.currentOther;
            socket.emit("updatecurr", [a, b]);
            console.log("updatecurr", [a, b]);
        },
        setBase(id, val){
            this.currentBase = this.baseCurrencies[id];
        },
        setOther(id, val){
            if(this.hasAllCurrencies){
                this.currentOther = this.allOtherCurrencies[id];
            }else{
                this.currentOther = this.otherCurrencies[id];
            }
        },
    },
    created(){
        socket.on("currency", dat => {
            localStorage.tmpRates = JSON.stringify(dat);
            this.currency = dat;
            console.log("done", dat);
        });

        //Calculate the currencies that should be included based on whether
        //or not have have a 1 in the start of their data in data.js
        for(let i = 1; i < constData.currencyAbbrList.length; i++){
            if(constData.currencyAbbrList[i][0] === 1){
                this.otherCurrencies.push(i);
            }
            this.allOtherCurrencies.push(i);
        }
    },
});

Vue.component("itemsTab", {
    template: `
      <div>
        Todo: items
      </div>
    `,
    data(){
        return {
            sounds: {},
            soundNames: ["whoop.mp3", "alert.mp3"],
            isMuted: false,
            alerts: [],
        };
    },
    methods: {
        playSound(sound){
            if(sound && this.sounds[sound]) this.sounds[sound].play();
        },
        addAlert(dat){
            if(dat.sound && !this.isMuted) this.playSound(dat.sound);
            dat.time = new Date();
            alerts.push(dat);
        }
    },
    created(){
        //Download required sounds
        for(let file of this.soundNames){
            this.sounds[file] = new Audio("/" + file);
            this.sounds[file].volume = .1;
        }

        socket.on("alert", (...r) => this.addAlert(...r));
    }
});

Vue.component("buttonList", {
    props: ["buttons", "change"],
    template: `
    <div>
      <button class="btn btn-info"
        v-for="(val, id) of buttons"
        @click="setSelected(id, val)"
        :class="{active: id == currentlySelected}">
        {{val}}
      </button>
    </div>
    `,
    data(){
        return {
            currentlySelected: null,
        };
    },
    methods: {
        setSelected(id, val){
            this.currentlySelected = id;
            this.change(id, val);
        },
    },
});

let app = new Vue({
    el: "#app",
    data: {
        currentTab: null,
    },
    methods: {
        setCurrentTab(id, val){
            this.currentTab = val;
        }
    },
});
