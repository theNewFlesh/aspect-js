<template>
    <div class="table-container">
        <ag-grid-vue
            style="width: 500px; height: 500px;"
            class="ag-theme-balham-dark"
            :columnDefs="_column_defs"
            :rowData="data"
            animateRows="true"
            enableColResize="true"
            enableFilter="true"
            enableSorting="true"
            groupMultiAutoColumn="true"
            groupUseEntireRow="false"
            singleClickEdit="true"
            stopEditingWhenGridLosesFocus="true"
        >
        </ag-grid-vue>
    </div>
</template>

<script lang="ts">
    import "../../node_modules/ag-grid/dist/styles/ag-grid.css";
    import "../../node_modules/ag-grid/dist/styles/ag-theme-balham-dark.css";

    import Vue from "vue";
    import { Component, Prop } from "vue-property-decorator";
    import { AgGridVue } from "ag-grid-vue";
    import Slider from "./slider.vue";
    import * as _ from "lodash";

    @Component( {components: { AgGridVue }} )
    export default class TableAg extends Vue {
        @Prop()
        public columns: string[];

        @Prop()
        public rows: string[];

        @Prop()
        public data: object[];

        public get _column_defs() {
            let cols = _.map(
                this.columns, (item) => ({
                    headerName: item,
                    field: item,
                    width: item.length * 13,
                })
            );
            for (const col of cols) {
                if (col.field.match(/scene|graph/)) {
                    // only available in enterprise version
                    // col["rowGroup"] = true;
                    col["hide"] = true;
                }
                if (col.field.match(/name/)) {
                    col["editable"] = true;
                }
                if (col.field == "value") {
                    col["cellRenderer"] = this._render_widget;
                }
            }
            return cols;
        }

        public _render_widget(params) {
            const widget = new Slider({propsData: params});
            widget.$mount();
            return widget.$el;
        }
    }
</script>

<style scoped lang="less">
</style>
