<template>
    <v-select multiple :value="value">
        <option></option>
        <option selected>A</option>
        <option>B</option>
        <option>C</option>
    </v-select>
</template>

<script lang="ts">
    import Vue from "vue";
    import { Component, Prop } from "vue-property-decorator";
    import vSelect from "vue-select";

    @Component( {components: { vSelect }} )
    export default class MultiDropDown extends Vue {
        public value;
        public options_;
    }
</script>

<style scoped lang="less">
</style>
