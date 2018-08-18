<template>
    <VueNumberInput inline controls
        :value="value"
        size="'small'"
        id="float-input"
    />
</template>

<script lang="ts">
    import Vue from "vue";
    import { Component, Prop } from "vue-property-decorator";
    import VueNumberInput from "@chenfengyuan/vue-number-input";

    @Component( {components: { VueNumberInput }} )
    export default class FloatInput extends Vue {
        public value;
        public options_;
    }
</script>

<style scoped lang="less">
    #float-input .number-input__button {
        height: 20px;
    }

    #float-input .number-input__input {
        height: 20px;
        padding-top: 0px;
        padding-bottom: 0px;
    }
</style>
