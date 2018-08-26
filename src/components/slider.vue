<template>
    <v-slider
        class="aspect-slider"
        :v-model="value"
        :min="display.options.min"
        :max="display.options.max"
        :step="display.options.step"
        :tick-labels="tick_labels"
        height="20px"
        color="accent"
        thumb-color="accent"
        thumb-size="18px"
        track-color="primary"
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
        @Prop()
        public value: number;

        @Prop()
        public default_value: number;

        @Prop({defualt: {
            color: "#5F95DE",
            options: {
                min: 0,
                max: 100,
                step: 1,
                tick_step: 10,
            }
        }})
        public display: object;

        public mounted() {
            // add_style_attribute(".v-messages", "display", "none");
            // add_style_attribute(
            //     ".v-slider__thumb-label__container", "transform", "translateY(6px)"
            // );
        }

        public get tick_labels(): number[] {
            let ticks: any[] = _.range(
                this.display.options.min, this.display.options.max + 1, this.display.options.step
            );
            ticks = _.map(ticks, (x) => {
                if (x % this.display.options.tick_step === 0) {
                    return x;
                }
                return "";
            });
            return ticks;
        }
    }
</script>

<style scoped lang="less">
    .v-input {
        font-size: 12px;
    }

    .aspect-textarea .v-input__control .v-input__slot {
        margin-bottom: 0px;
    }
</style>
