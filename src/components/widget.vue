<template>
    <div class="widget-container" v-if="widget == 'slider'">
        <Slider class="widget"
        :value="value"
        :options_="options_"
    />
    </div>
    <div class="widget-container" v-else-if="widget == 'float_input'">
        <FloatInput class="widget"
        :value="value"
        :options_="options_"
    />
    </div>
    <div class="widget-container" v-else-if="widget == 'multidropdown'">
        <MultiDropDown class="widget"
        :value="value"
        :options_="options_"
    />
    </div>
    <div class="widget-container" v-else-if="widget == 'dropdown'">
        <DropDown class="widget"
        :value="value"
        :options_="options_"
    />
    </div>
    <div class="widget-container" v-else-if="widget == 'textarea'">
        <TextArea class="widget"
        :value="value"
        :options_="options_"
    />
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import { Component, Prop } from "vue-property-decorator";
    import Slider from "./slider.vue";
    import FloatInput from "./float_input.vue";
    import MultiDropDown from "./multidropdown.vue";
    import DropDown from "./dropdown.vue";
    import TextArea from "./textarea.vue";

    @Component( {components: { Slider, FloatInput, MultiDropDown, DropDown, TextArea }} )
    export default class Widget extends Vue {
        public value;
        public options_ = null;
        public widget: string;

        public create() {
            if (this.value === undefined) {
                this.value = this.options_;
            }
        }
    }
</script>

<style scoped lang="less">
    .widget-container {
        display: flex;
    }

    .widget {
        flex-grow: 10;
    }
</style>
