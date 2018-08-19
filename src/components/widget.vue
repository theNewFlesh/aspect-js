<template>
    <div class="widget-container" v-if="widget == 'slider'">
        <Slider class="widget"
        :value="value"
        :default_value="default_value"
    />
    </div>
    <div class="widget-container" v-else-if="widget == 'float_input'">
        <FloatInput class="widget"
        :value="value"
        :default_value="default_value"
    />
    </div>
    <div class="widget-container" v-else-if="widget == 'multidropdown'">
        <MultiDropDown class="widget"
        :value="value"
        :default_value="default_value"
    />
    </div>
    <div class="widget-container" v-else-if="widget == 'dropdown'">
        <DropDown class="widget"
        :value="value"
        :default_value="default_value"
    />
    </div>
    <div class="widget-container" v-else-if="widget == 'textarea'">
        <TextArea class="widget"
        :value="value"
        :default_value="default_value"
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
        public default_value = null;
        public widget: string;

        public create() {
            if (this.value === undefined) {
                this.value = this.default_value;
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
