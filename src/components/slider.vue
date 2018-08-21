<template>
    <v-slider
        class="widget"
        :v-model="value"
        :min="options.min"
        :max="options.max"
        :step="options.step"
        :color="display.color"
        :background-color="display.background_color"
        :thumb-color="display.thumb_color"
        :track_color="display.track_color"
        :ticks="display.ticks"
        :tick-labels="tick_labels"
        thumb-size="10"
        range="true"
        thumb-label="always"
        always_dirty="true"
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
            color: "#5F95DE",
            background_color: "#FF0000",
            thumb_color: "#FF0000",
            thumb_size: "20px",
            track_color: "#FF0000",
            ticks: true,
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
