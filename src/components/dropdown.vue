<template>
    <v-select :value="value">
        <!-- <option v-for="option in default_value">{{ option }}</option> -->
    </v-select>
</template>

<script lang="ts">
    import Vue from "vue";
    import { Component, Prop } from "vue-property-decorator";
    import vSelect from "vue-select";

    @Component( {components: { vSelect }} )
    export default class DropDown extends Vue {
        public value;
        public default_value = [];
    }
</script>

<style scoped lang="less">
</style>
