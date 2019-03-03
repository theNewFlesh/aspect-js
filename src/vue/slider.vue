<template>
    <v-slider
        class="aspect-slider"
        v-model="value"
        :min="display.options.min"
        :max="display.options.max"
        :step="display.options.step"
        :tick-labels="tick_labels"
        height="20px"
        color="aspect_cyan_1"
        thumb-color="aspect_cyan_1"
        thumb-size="18px"
        track-color="aspect_light_1"
        :thumb-label="true"
        :ticks="true"
        :tick-size="1"
        always-dirty
        dark
        v-on:change="on_change"
    />
</template>

<script lang="ts">
    import Vue from "vue";
    import { Component, Prop } from "vue-property-decorator";
    import * as _ from "lodash";
    import { ISubEvent } from "./event_manager";

    interface IOptions {
        min: number;
        max: number;
        step: number;
        tick_step: number;
    }

    interface IDisplay {
        options?: IOptions;
    }

    @Component({})
    export default class Slider extends Vue {
        /**
         * Value of component
         */
        @Prop()
        public value: number;

        /**
         * Default value of component
         */
        @Prop()
        public default_value: number;

        /**
         * Default options of component.
         * <pre>
         * color: "#5F95DE",
         * options: {
         *     min: 0,
         *     max: 100,
         *     step: 1,
         *     tick_step: 10,
         * }
         * </pre>
         */
        @Prop({
            default: {
                color: "#5F95DE",
                options: {
                    min: 0,
                    max: 100,
                    step: 1,
                    tick_step: 10
                }
            }
        })
        public display: IDisplay;

        /**
         * Return an Array of numbers and "" for v-slider to render as ticks
         */
        public get tick_labels(): number[] {
            let ticks: any[] = _.range(
                this.display.options.min,
                this.display.options.max + 1,
                this.display.options.step
            );
            ticks = _.map(ticks, x => {
                if (x % this.display.options.tick_step === 0) {
                    return x;
                }
                return "";
            });
            return ticks;
        }

        /**
         * Event handler for change events
         * @param value Value of dropdown selection.
         */
        public on_change(value: number): void {
            const event: ISubEvent = {
                name: "node_pane-widget-value-update",
                value: value
            };
            this.$emit(event.name, event);
        }
    }
</script>

<style lang="stylus">
@import '../static/css/vuetify.css';
@import '../static/css/config.styl';

.aspect-slider {
    padding-right: 5px;
}

.v-input {
    font-size: 12px;
}

.aspect-textarea .v-input__control .v-input__slot {
    margin-bottom: 0px;
}

.v-slider__thumb-label {
    color: aspect_bg;
}

.theme--dark .v-input--slider .v-slider__ticks, .application .theme--dark.v-input--slider .v-slider__ticks {
    border-color: aspect_grey_3;
    color: aspect_light_1;
    height: 10px;
}
</style>
