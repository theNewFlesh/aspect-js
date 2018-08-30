<template>
    <v-layout row>
        <v-flex class="aspect-spinbox" >
            <v-text-field
                ref="input"
                @keyup.enter.native="onSetValue"
                @keyup.up.native="onIncrementValue"
                @keyup.down.native="onDecrementValue"
                color="aspect_cyan_1"
                :value="value"
                dark
                hide-details
                align-center
            ></v-text-field>
        </v-flex>
        <v-flex justify-end class="aspect-spinbox-button-up">
            <v-btn
                @click="onIncrementValue"
                depressed
                small
                color="aspect_cyan_1"
            >
                <i class="material-icons aspect-up-arrow-icon">arrow_upward</i>
            </v-btn>
        </v-flex>
        <v-flex justify-end class="aspect-spinbox-button-down">
            <v-btn
                @click="onDecrementValue"
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
        @Prop()
        public value: number;

        @Prop()
        public default_value;

        @Prop()
        public options;

        @Prop({default: {
            options: {
                step: 1,
                round: 3,
            }
        }})
        public display;

        @Watch("value")
        public round() {
            // if (this.display.options.round !== undefined) {
            //     this.value = new Number(this.value).toFixed(this.display.options.round);
            // }
        }

        public onSetValue(event) {
            this.value = parseFloat(this.$refs.input.internalValue);
        }

        public onIncrementValue() {
            this.value += this.display.options.step;
        }

        public onDecrementValue() {
            this.value -= this.display.options.step;
        }
    }
</script>

<style scoped lang="less">
    .v-input {
        margin-top: 0px;
        flex-grow: 10;
    }

    .aspect-spinbox {
        flex-grow: 100;
        flex-shrink: 0;
    }

    .v-text-field {
        padding-top: 6px;
    }

    .v-btn {
        padding: 2px 2px 2px 2px;
        margin: 0px 0px 0px 0px;
        min-width: 24px;
        flex-shrink: 10;
    }

    .aspect-up-arrow-icon,
    .aspect-down-arrow-icon {
        color: #343434;
        font-size: 20px;
    }

    .aspect-spinbox-button-up {
        padding-top: 2px;
        padding-bottom: 2px;
        padding-left: 6px;
        padding-right: 3px;
    }

    .aspect-spinbox-button-down {
        padding-top: 2px;
        padding-bottom: 2px;
        padding-left: 3px;
        padding-right: 6px;
    }
</style>
