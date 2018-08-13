<template>
    <div class="widget-container">
        <vue-slider ref="slider" v-model="value">
        </vue-slider>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import { Component, Prop } from "vue-property-decorator";
    import vueSlider from "vue-slider-component";

    @Component( {components: { vueSlider }} )
    export default class Slider extends Vue {
        @Prop({default: 0})
        public value: number;
    }
</script>

<style scoped lang="less">
</style>
