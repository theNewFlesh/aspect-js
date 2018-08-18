<template>
    <dx-grid :rows="rows" :columns="dx_columns" >
        <!-- <dx-sorting-state :sorting.sync="sorting" /> -->
        <!-- <dx-integrated-sorting /> -->
        <!-- <dx-integrated-paging /> -->
        <dx-table />
        <dx-table-header-row />
        <!-- <dx-paging-panel :pageSizes="pageSizes"/> -->
    </dx-grid>
</template>

<script lang="ts">
    import * as _ from "lodash";
    import { Component, Prop, Vue } from "vue-property-decorator";
    import { DxGrid, DxTable, DxTableHeaderRow } from "@devexpress/dx-vue-grid-bootstrap4";

    @Component( {components: { DxGrid, DxTable, DxTableHeaderRow } })
    export default class TableDx extends Vue {
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
