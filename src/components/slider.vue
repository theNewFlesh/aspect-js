<template>
    <vue-slider ref="slider" v-model="value">
    </vue-slider>
</template>

<script lang="ts">
    import Vue from "vue";
    import { Component, Prop } from "vue-property-decorator";
    import vueSlider from "vue-slider-component";

    @Component( {components: { vueSlider }} )
    export default class Slider extends Vue {
        public value;
        public options_;
    }
</script>

<style scoped lang="less">
</style>
