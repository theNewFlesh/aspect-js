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
    import { conform_name } from "../tools";
    import FancyFrame from "./fancy_frame";
    import * as _ from "lodash";
    import { DataFrame, Series, Index } from "data-forge";
    import * as dataforge from "data-forge";
    // -------------------------------------------------------------------------

    interface IHeader {
        text: string;
        value: string;
        align: string; // "left", "center", "right"
        sortable: boolean;
        class: string[];
        width?: number;
        index: number;
    }

    interface IIndexRow {
        columns: string[];
        group?: string;
        indent?: boolean;
        hide_headers?: boolean;
    }

    class IndexRow {
        public constructor(params: IIndexRow) {
            if (params.group === undefined) {
                params.group = null;
            }
            if (params.indent === undefined) {
                params.indent = true;
            }
            if (params.hide_headers === undefined) {
                params.hide_headers = false;
            }
            this._params["columns"] = params.columns;
            this._params["group"] = params.group;
            this._params["indent"] = params.indent;
            this._params["hide_headers"] = params.hide_headers;
        }

        public _params: object = {};

        public to_object(): object {
            return this._params;
        }
    }

    interface IRow {
        __index: number;
    }
    // -------------------------------------------------------------------------

    @Component({components: { Cell }})
    export default class Table extends Vue {
        public _data: DataFrame;
        public _index: DataFrame;

        @Prop()
        public index: IIndexRow[];

        /**
         * array of dicts
         */
        @Prop()
        public data: IRow[];

        public created() {
            let index: any = _.map( this.index, x => new IndexRow(x).to_object() );
            index = new DataFrame(index);
            // index = new FancyFrame()
            //     .from_dataframe(index)
            //     .coerce()
            //     .to_dataframe();
            this._index = index;

            const data: DataFrame = new DataFrame(this.data);
            // const data: DataFrame = new FancyFrame()
            //     .from_array(this.data)
            //     .coerce()
            //     .to_dataframe();
            this._data = data;
        }

        public print() {
            let output: any = [
                "INDEX",
                this._index.toString(),
                "",
                "DATA",
                this._data.toString(),
            ];
            output = output.join("\n");
            console.log(output);
        }

        public get headers(): IHeader[] {
            let cols = this._index.at(0).columns;
            cols = _.filter(cols, (x) => (x !== "__index"));

            const headers = [];
            for (const i in cols) {
                const col = cols[i];
                headers.push({
                    text: conform_name(col),
                    value: col,
                    align: "left",
                    sortable: true,
                    class: [col + "-column"],
                    // width: "100%",
                    index: i,
                });
            }
            return headers;
        }

        public get rows() {
            const column = this._index.at(0).group;
            const group = this._data.groupBy(x => x[column]);

            // convert grouped DataFrame to list of dicts
            // with just the first row per group
            let rows = group.select( x => x.head(1).toArray()[0] ).toArray();

            // sort rows by column
            rows = new DataFrame(rows).orderBy(x => x[column]).toArray();
            return rows;
        }

        public get hide_headers(): boolean {
            return this._index.getSeries("hide_headers").head(1).toArray()[0];
        }

        public get indent(): boolean {
            return this._index.getSeries("indent").head(1).toArray()[0];
        }

        public get group_column(): string {
            return this._index.at(0).group;
        }

        public get groups() {
            return new FancyFrame()
                .from_dataframe(this._data)
                .to_lut(this.group_column);
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
