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

    /**
     * Slider component with two handles, one for the lower bound, one for the
     * upper bound
     */
    @Component
    export default class RangeSlider extends Vue {
        /**
         * Value of component
         */
        @Prop({default: 0})
        public value;

        /**
         * Default value of component
         */
        @Prop({default: 0})
        public default_value;


        /**
         * Default options of component.
         * <pre>
         * min: 0
         * max: 100
         * step: 1
         * </pre>
         */
        @Prop({default: {
            min: 0,
            max: 100,
            step: 1,
        }})
        public options;
    }
</script>

<style scoped lang="stylus">
</style>
