<template>
    <div id="app" class="container col-sm-12 col-md-8 col-md-offset-2">
        <button-list :buttons="['Items', 'Currency']" :change="setCurrentTab"></button-list>

        <currency-tab v-show="currentTab=='Currency'"></currency-tab>
        <items-tab v-show="currentTab=='Items'"></items-tab>
    </div>
</template>

<script>
import buttonList from "./buttonList.vue";
import currencyTab from "./currencyTab.vue";
import itemsTab from "./itemsTab.vue";

export default {
    components: {buttonList, itemsTab, currencyTab},
    data(){
        return {
            currentTab: null,
        };
    },
    methods: {
        setCurrentTab(id, val){
            this.currentTab = val;
        }
    },
}
</script>

<style>
</style>
