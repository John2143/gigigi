<template>
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
                <input type="text"
                       v-model="buyAmount"
                       class="form-control"
                       v-on:keyup.13="$event.target.blur()"
                       v-on:blur="sanatizeMultiplier()"
                       v-on:focus="$event.target.select()">
            </div>
            <div class="col-xs-5">
                <button class="btn btn-primary" @click="buyAmount += order.sellvalue; sanatizeMultiplier()">+{{order.sellvalue}}</button>
                <button class="btn btn-primary" @click="buyAmount -= order.sellvalue; sanatizeMultiplier()">-{{order.sellvalue}}</button>
            </div>
            <div class="col-xs-5">
                <span>{{buyTextShort}}</span>
            </div>
            <div class="col-xs-12">
                <input type="text" v-model="buyTextMsg" class="form-control" readonly
                                                        v-on:focus="$event.target.select()">
            </div>
            <div class="col-xs-12">
                <h4 v-if="warnings.tax"   class="text-warning">Non-even trade: recieving amount rounded down.</h4>
                <h4 v-if="warnings.bm"    class="text-warning">Trading for less than the offered amount is bad manners, even if the ratio is the same.</h4>
                <h4 v-if="warnings.stock" class="text-warning">This user may not have enough stock to complete the trade.</h4>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: ["order"],
    data(){
        return{
            multiplier: 1,
            buyAmount: this.order.sellvalue,
            warnings: {},
            open: false,
        };
    },
    computed: {
        computedSellValue(){
            return this.multiplier * this.order.sellvalue;
        },
        computedBuyValue(){
            return Math.floor(this.multiplier * this.order.buyvalue);
        },
        buyTextShort(){
            return `${this.computedBuyValue} => ${this.computedSellValue}`;
        },
        buyTextMsg(){
            return `@${this.order.ign} Hi, I would like to buy your ${this.computedSellValue} ${this.cnfa(this.order.sellcurrency)} for my ${this.computedBuyValue} ${this.cnfa(this.order.buycurrency)} in ${this.$LEAGUE}`;
        },
    },
    methods: {
        sanatizeMultiplier(){
            this.buyAmount = Number(this.buyAmount);
            if(!this.buyAmount || this.buyAmount == NaN) this.multiplier = 1;
            if(this.buyAmount < 1) this.buyAmount = 1;
            this.buyAmount = Math.floor(this.buyAmount);

            this.multiplier = Number(this.buyAmount / this.order.sellvalue);

            this.warnings.bm = this.multiplier < 1;
            this.warnings.stock = (this.order.stock && this.multiplier * this.order.sellvalue > this.order.stock);
            this.warnings.tax = !Number.isInteger(this.multiplier * this.order.sellvalue);
        },
    },
    created(){
        //Make sure to apply warnings
        this.sanatizeMultiplier();
    },
}
</script>
