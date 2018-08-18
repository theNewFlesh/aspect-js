<template>
    <div>
        <link rel="stylesheet" type="text/css" href="https://cdn3.devexpress.com/jslib/18.1.5/css/dx.common.css" />
        <link rel="stylesheet" type="text/css" href="https://cdn3.devexpress.com/jslib/18.1.5/css/dx.dark.css" />
        <dx-grid :rows="rows" :columns="dx_columns" >
            <!-- <dx-sorting-state :sorting.sync="sorting" /> -->
            <!-- <dx-integrated-sorting /> -->
            <!-- <dx-integrated-paging /> -->
            <dx-table />
            <dx-table-header-row />
            <!-- <dx-paging-panel :pageSizes="pageSizes"/> -->
        </dx-grid>
    </div>
</template>

<script lang="ts">
    import * as _ from "lodash";
    import { Component, Prop, Vue } from "vue-property-decorator";
    import { DxGrid, DxTable, DxTableHeaderRow } from "@devexpress/dx-vue-grid-bootstrap4";

    @Component( {components: { DxGrid, DxTable, DxTableHeaderRow } })
    export default class TreeGrid extends Vue {
        @Prop()
        public columns;

        @Prop()
        public rows;

        public get dx_columns() {
            return _.map(this.columns, (key) => ({name: key, title: key}));
        }

        public sorting = [
            { columnName: "orderNo", direction: "asc" }
        ];

        public currentPage = 0;

        public pageSize = 10;

        public pageSizes = [5, 10, 15];
    }
</script>

<style lang="less">
</style>
