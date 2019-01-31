<template>
    <v-layout row>
        <v-flex class="aspect-spinbox" >
            <v-text-field
                ref="input"
                @keyup.enter.native="on_set_value"
                @keyup.up.native="on_increment_value"
                @keyup.down.native="on_decrement_value"
                color="aspect_cyan_1"
                :value="value"
                dark
                hide-details
                align-center
            ></v-text-field>
        </v-flex>
        <v-flex justify-end class="aspect-spinbox-button-up">
            <v-btn
                @click="on_increment_value"
                depressed
                small
                color="aspect_cyan_1"
            >
                <i class="material-icons aspect-up-arrow-icon">arrow_upward</i>
            </v-btn>
        </v-flex>
        <v-flex justify-end class="aspect-spinbox-button-down">
            <v-btn
                @click="on_decrement_value"
                depressed
                small
                color="aspect_cyan_1"
            >
                <i class="material-icons aspect-down-arrow-icon">arrow_downward</i>
            </v-btn>
        </v-flex>
    </v-layout>
</template>

<script lang="ts">
    import Vue from "vue";
    import { Component, Prop, Watch } from "vue-property-decorator";

    @Component({})
    export default class SpinBox extends Vue {
        /**
         * Value of component
         */
        @Prop()
        public value: number;

        /**
         * Default value of component
         */
        @Prop()
        public default_value;

        /**
         * Component options
         */
        @Prop()
        public options;

        /**
         * Display options for component
         * <pre>
         * step: 1
         * round: 3
         * </pre>
         */
        @Prop({default: {
            options: {
                step: 1,
                round: 3,
            }
        }})
        public display;

        /**
         * Round value upon change. Currently disabled.
         */
        @Watch("value")
        public round() {
            // if (this.display.options.round !== undefined) {
            //     this.value = new Number(this.value).toFixed(this.display.options.round);
            // }
        }

        /**
         * Event handler that sets value given to input's internal value
         * @param event Ignore event object
         */
        public on_set_value(event: any) {
            this.value = parseFloat(this.$refs.input.internalValue);
        }

        /**
         * Event handler for the up arrow button press
         */
        public on_increment_value() {
            this.value += this.display.options.step;
        }

        /**
         * Event handler for the down arrow button press
         */
        public on_decrement_value() {
            this.value -= this.display.options.step;
        }
    }
</script>

<style scoped lang="stylus">
    @import "../static/css/config.styl"

    .v-input
        margin-top: 0px
        flex-grow: 1

    .aspect-spinbox
        flex-grow: 100
        flex-shrink: 100

    .v-text-field
        padding-top: 6px

    .v-btn
        padding: 2px 2px 2px 2px
        margin: 0px 0px 0px 0px
        min-width: 24px
        flex-shrink: 10

    .aspect-up-arrow-icon,
    .aspect-down-arrow-icon
        color: aspect_grey_1
        font-size: 20px

    .aspect-spinbox-button-up
        padding-top: 2px
        padding-bottom: 2px
        padding-left: 6px
        padding-right: 3px

    .aspect-spinbox-button-down
        padding-top: 2px
        padding-bottom: 2px
        padding-left: 3px
        padding-right: 6px
</style>
