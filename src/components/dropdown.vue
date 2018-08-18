<template>
    <v-select :value="value">
        <option v-for="opt in options_">{{ opt }}</option>
    </v-select>
</template>

<script lang="ts">
    import Vue from "vue";
    import { Component, Prop } from "vue-property-decorator";
    import vSelect from "vue-select";

    @Component( {components: { vSelect }} )
    export default class DropDown extends Vue {
        public value;
        public options_ = [];
    }
</script>

<style scoped lang="less">
</style>
