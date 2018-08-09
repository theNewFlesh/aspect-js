<template>
    <div class="components">
    <!-- <VueNumberInput /> -->
    <vue-slider ref="slider" v-model="value">
    </vue-slider>
    <v-select multiple :options="options">
        <option></option>
        <option selected>A</option>
        <option>B</option>
        <option>C</option>
    </v-select>
    <sketch v-model="colors">
    </sketch>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import { Component, Prop } from "vue-property-decorator";
    // import VueNumberInput from  "@chenfengyuan/vue-number-input";
    import vueSlider from "vue-slider-component";
    import { Sketch } from "vue-color";
    import vSelect from "vue-select";

    @Component( {components: { vSelect, vueSlider, Sketch }} )
    export default class DevContainer extends Vue {
        public options: string[] = [
            "bagel",
            "creame cheese",
            "muffin"
        ];

        public value: number = 1;

        public colors: string[] = [
            "#D0021B", "#F5A623", "#F8E71C", "#8B572A", "#7ED321",
            "#417505", "#BD10E0", "#9013FE", "#4A90E2", "#50E3C2",
            "#B8E986", "#000000", "#4A4A4A", "#9B9B9B", "#FFFFFF",
            "rgba(0,0,0,0)"
        ];
    }
</script>

<style scoped lang="less">
</style>
