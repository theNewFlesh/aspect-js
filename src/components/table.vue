<template>
    <!-- for row in rows -->
    <v-data-table
        class="aspect-table"
        id="aspect-table"
        :headers="headers"
        :items="rows"
        :hide-headers="hide_headers"
        item-key="__index"
        hide-actions
        expand
    >
        <!-- for col in row -->
        <template slot="items" slot-scope="row" >
            <tr id="aspect-table-row" @click="row.expanded = !row.expanded" >
                <td
                    v-for="header in headers"
                    :key="header.__index"
                    :class="header.value + '-cell'" id="cell"
                >
                    <Cell
                        :column="header.value"
                        :row="row.item"
                    />
                </td>
            </tr>
        </template>
        <!-- child data row -->
        <template v-if="in_groups(row.item[group_column])"
            slot="expand" slot-scope="row"
        >
            <td id="indent" v-if="indent"></td>
            <td id="child-table-container">
                <Table
                    :data="groups[row.item[group_column]]"
                    :index="index.slice(1)"
                />
            </td>
        </template>
    </v-data-table>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";
    import Cell from "./cell.vue";
    import { FancyFrame } from "../core/fancy_frame";
    import { FancyIndex, IHeader, IIndexRow } from "../core/fancy_index";
    import * as _ from "lodash";
    import { DataFrame } from "data-forge";
    // -------------------------------------------------------------------------

    export interface IRow {
        __index: number;
    }

    @Component({components: { Cell }})
    export default class Table extends Vue {
        public _data: FancyFrame;
        public _index: FancyIndex;

        @Prop()
        public index: IIndexRow[];

        /**
         * array of dicts
         */
        @Prop()
        public data: IRow[];

        public created() {
            this._index = new FancyIndex(this.index);
            this._data = new FancyFrame().from_array(this.data);
        }

        public print() {
            let output: any = [
                "INDEX",
                this._index.to_dataframe().toString(),
                "",
                "DATA",
                this._data.to_dataframe().toString(),
            ];
            output = output.join("\n");
            // tslint:disable-next-line:no-console
            console.log(output);
        }

        public get headers(): IHeader[] {
            return this._index.to_headers();
        }

        public get rows() {
            return this._data
                .group_by(
                    x => x.head(1).to_array()[0],
                    this.group_column,
                )
                .to_array();
        }

        public get hide_headers(): boolean {
            return this._index.hide_headers;
        }

        public get indent(): boolean {
            return this._index.indent;
        }

        public get group_column(): string {
            return this._index.group_column;
        }

        public get groups() {
            return this._data.to_lut(this.group_column);
        }

        public in_groups(key: string): boolean {
            return this.groups.hasOwnProperty(key);
        }
    }
</script>

<style lang="less">
    .v-datatable__expand-content {
        display: flex !important;
    }

    #child-table-container {
        flex-grow: 10;
    }

    #aspect-table th:first-child,
    #cell:first-child {
        border-left: 0px;
    }

    table.v-table thead td:not(:nth-child(1)),
    table.v-table tbody td:not(:nth-child(1)),
    table.v-table thead th:not(:nth-child(1)),
    table.v-table tbody th:not(:nth-child(1)),
    table.v-table thead td:first-child,
    table.v-table tbody td:first-child,
    table.v-table thead th:first-child,
    table.v-table tbody th:first-child {
        // padding: 0 6px;
        border-left: 1px solid #141414;
    }

    .theme--dark .v-datatable .v-datatable__actions,
    .application .theme--dark.v-datatable .v-datatable__actions {
        background-color: #242424;
        color: rgba(255,255,255,0.7);
        // border-top: 1px solid rgba(255,255,255,0.12);
    }

    .theme--dark .v-table,
    .application .theme--dark.v-table {
        background-color: #242424;
        color: #F4F4F4;
    }

    .theme--dark .v-datatable .v-datatable__actions,
    .application .theme--dark.v-datatable .v-datatable__actions {
        background-color: #242424;
        color: rgba(255,255,255,0.7);
        // border-top: 1px solid rgba(255,255,255,0.12);
    }

    .v-datatable__expand-col--expanded {
        border-bottom: 1px solid #141414;
    }

    table.v-table tbody td {
        font-weight: 400;
        font-size: 13px;
    }

    table.v-table thead th {
        background-color: #343434;
        font-weight: 500;
        font-size: 13px;
        transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
        white-space: nowrap;
        -webkit-user-select: none;
           -moz-user-select: none;
            -ms-user-select: none;
                user-select: none;
    }

    .theme--dark .v-table tbody tr:not(:last-child),
    .application .theme--dark.v-table tbody tr:not(:last-child) {
        border-bottom: 1px solid #141414;
    }

    .theme--dark .v-table thead tr:first-child,
    .application .theme--dark.v-table thead tr:first-child {
        border-bottom: 1px solid #141414;
    }

    .theme--dark .v-table tbody tr:hover:not(.v-datatable__expand-row),
    .application .theme--dark.v-table tbody tr:hover:not(.v-datatable__expand-row) {
        background: rgba(126, 196, 207, 0.25);
    }

    .aspect-table #indent {
        padding: 0px 0px 0px 8px;
        background-color: #141414;
    }
</style>
