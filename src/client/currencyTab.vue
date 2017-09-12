<template>
    <div>
        <button class="btn btn-primary" @click="updateCurr">update currency rates</button>
        <div class="checkbox">
            <label><input type="checkbox" v-model="hasAllCurrencies">all curr</label>
        </div>
        <div class="checkbox">
            <label><input type="checkbox" v-model="showStockOnly">show stock only</label>
        </div>
        <div class="checkbox" v-if="$isDev">
            <label><input type="checkbox" v-model="devMode">client only</label>
        </div>
        <button-list :buttons="baseCurrencies.map(cnfa)" :change="setBase"></button-list>
        <button-list :buttons="hasAllCurrencies ? allOtherCurrencies.map(cnfa) : otherCurrencies.map(cnfa)" :change="setOther"></button-list>
        <div v-if="currency">
            <seller-list :type="currency.a" :orders="currency.btoa"></seller-list>
            <seller-list :type="currency.b" :orders="currency.atob"></seller-list>
        </div>
    </div>
</template>
<script>
import buttonList from "./buttonList.vue";
import sellerList from "./sellerList.vue";
import {addSocketHook, emit} from "./socket.js";

export default {
    components: {buttonList, sellerList},
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
            devMode: this.$isDev,
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
            emit("updatecurr", [a, b]);
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
        addSocketHook("currency", dat => {
            if(this.$isDev) localStorage.tmpRates = JSON.stringify(dat);
            this.currency = dat;
        });

        //Calculate the currencies that should be included based on whether
        //or not have have a 1 in the start of their data in data.js
        for(let i = 1; i < this.$constData.currencyAbbrList.length; i++){
            if(this.$constData.currencyAbbrList[i][0] === 1){
                this.otherCurrencies.push(i);
            }
            this.allOtherCurrencies.push(i);
        }
    },
}
</script>
