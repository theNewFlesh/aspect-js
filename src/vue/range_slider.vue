<template>
    <v-flex>
        <v-range-slider
            v-model="value"
            :min="options.min"
            :max="options.max"
            :step="options.step"
        ></v-range-slider>
    </v-flex>
</template>

<script lang="ts">
    import Vue from "vue";
    import { Component, Prop } from "vue-property-decorator";

    @Component
    export default class RangeSlider extends Vue {
        @Prop({default: 0})
        public value;

        @Prop({default: 0})
        public default_value;

        @Prop({default: {
            min: 0,
            max: 100,
            step: 1,
        }})
        public options;
    }
</script>

<style scoped lang="less">
</style>
