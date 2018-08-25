<template>
    <v-slider
        class="aspect-slider"
        :v-model="value"
        :min="options.min"
        :max="options.max"
        :step="options.step"
        :tick-labels="tick_labels"
        height="35px"
        color="accent"
        thumb-color="accent"
        thumb-size="18px"
        :thumb-label="true"
        :ticks="true"
        :tick-size="1"
        always-dirty
        dark
    />
</template>

<script lang="ts">
    import Vue from "vue";
    import { Component, Prop } from "vue-property-decorator";
    import { add_style_attribute } from "../tools";
    import * as _ from "lodash";

    @Component
    export default class Slider extends Vue {
        public value: number;

        public default_value: number;

        @Prop({default: {
            min: 0,
            max: 100,
            step: 1,
            tick_step: 10,
        }})
        public options: object;

        public display: object = {
            color: "#5F95DE"
        }

        public mounted() {
            add_style_attribute(".v-messages", "display", "none");
            add_style_attribute(
                ".v-slider__thumb-label__container", "transform", "translateY(6px)"
            );
        }

        public get tick_labels(): number[] {
            let ticks: any[] = _.range(
                this.options.min, this.options.max + 1, this.options.step
            );
            ticks = _.map(ticks, (x) => {
                if (x % this.options.tick_step === 0) {
                    return x;
                }
                return "";
            });
            return ticks;
        }
    }
</script>

<style scoped lang="less">
    // .v-input {
    //     font-size: 12px;
    // }

    // .aspect-textarea .v-input__control .v-input__slot {
    //     margin-bottom: 0px;
    // }
</style>
