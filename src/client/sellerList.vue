<template>
    <div class="col-xs-6 container">
      {{cnfa(type)}} Sellers
      <order v-for="order of orderList" :order="order"></order>
    </div>
</template>
<script>
import order from "./order.vue";

export default {
    components: {order},
    props: ["type", "orders"],
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
}
</script>
