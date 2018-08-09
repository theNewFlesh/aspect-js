<template>
    <div>
    <!-- <VueNumberInput /> -->
    <v-select multiple :options="options">
        <option></option>
        <option selected>A</option>
        <option>B</option>
        <option>C</option>
    </v-select>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import { Component, Prop } from "vue-property-decorator";
    // import VueNumberInput from  "@chenfengyuan/vue-number-input";
    import vSelect from "vue-select";

    @Component( {components: { vSelect }} )
    export default class HelloWorld extends Vue {
        public options: string[] = [
            "bagel",
            "creame cheese",
            "muffin"
        ];
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
</style>
