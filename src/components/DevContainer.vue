<template>
    <div class="components">
        <VueNumberInput inline controls/>
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
        <tooltip placement="top" mode="hover">
            <div slot="outlet">hover me</div>
            <div slot="tooltip">tooltip</div>
        </tooltip>
        <ag-grid-vue style="width: 500px; height: 500px;"
                    class="ag-theme-balham"
                    :columnDefs="columnDefs"
                    :rowData="rowData">
        </ag-grid-vue>
    </div>
</template>

<script lang="ts">
    import "../../node_modules/ag-grid/dist/styles/ag-grid.css";
    import "../../node_modules/ag-grid/dist/styles/ag-theme-balham.css";

    import Vue from "vue";
    import { AgGridVue } from "ag-grid-vue";
    import { Component, Prop } from "vue-property-decorator";
    import VueNumberInput from  "@chenfengyuan/vue-number-input";
    import vueSlider from "vue-slider-component";
    import { Sketch } from "vue-color";
    import vSelect from "vue-select";
    import Tooltip from "hsy-vue-tooltip";
    Vue.use(Tooltip);

    @Component( {components: { AgGridVue, vSelect, vueSlider, Sketch, VueNumberInput }} )
    export default class DevContainer extends Vue {
        public columDefs = null;
        public rowData = null;

        public options: string[] = [
            "bagel",
            "creame cheese",
            "muffin"
        ];

        public tooltip: string = "I am a tooltip";

        public value: number = 1;

        public colors: string[] = [
            "#D0021B", "#F5A623", "#F8E71C", "#8B572A", "#7ED321",
            "#417505", "#BD10E0", "#9013FE", "#4A90E2", "#50E3C2",
            "#B8E986", "#000000", "#4A4A4A", "#9B9B9B", "#FFFFFF",
            "rgba(0,0,0,0)"
        ];

        beforeMount() {
            this.columnDefs = [
                {headerName: 'Make', field: 'make'},
                {headerName: 'Model', field: 'model'},
                {headerName: 'Price', field: 'price'}
            ];

            this.rowData = [
                {make: 'Toyota', model: 'Celica', price: 35000},
                {make: 'Ford', model: 'Mondeo', price: 32000},
                {make: 'Porsche', model: 'Boxter', price: 72000}
            ];
        }
    }
</script>

<style scoped lang="less">
</style>
