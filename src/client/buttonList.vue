<template>
    <div>
        <button class="btn btn-info"
                v-for="(val, id) of buttons"
                @click="setSelected(id, val)"
                :class="{active: id == currentlySelected}">
            {{val}}
        </button>
    </div>
</template>
<script>
export default {
    props: ["buttons", "change"],
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
}
</script>
