<template>
    <v-slider
        class="widget"
        ref="slider"
        :v-model="value"
        :min="options.min"
        :max="options.max"
        :step="options.step"
        :tick-labels="tick_labels"
        thumb-color="accent"
        color="accent"
        thumb-size="18px"
        thumb-label="true"
        ticks="true"
        always-dirty
        dark
    />
</template>

<script lang="ts">
    import Vue from "vue";
    import { Component, Prop } from "vue-property-decorator";
    import * as _ from "lodash";

    @Component
    export default class Slider extends Vue {
        public value: number;

        public default_value: number;

        public options = {
            min: 0,
            max: 100,
            step: 10,
        };

        public display: object = {
            color: "#5F95DE"
        }

        public get tick_size(): number {
            const delta = this.options.max - this.options.min;
            return delta / this.options.step;
        }

        public get tick_labels(): number[] {
            return _.range(
                this.options.min, this.options.max, this.options.step
            );
        }
    }
</script>

<style scoped lang="less">
</style>
