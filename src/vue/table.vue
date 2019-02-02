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
    import * as _ from "lodash";
    import { Component, Prop, Vue } from "vue-property-decorator";
    import { DataFrame } from "data-forge";
    import { Scaffold } from "../core/scaffold";
    import { FancyIndex, IHeader, IIndexRow } from "../core/fancy_index";
    import Cell from "./cell.vue";
    // -------------------------------------------------------------------------

    /**
     * Interface for the row of a table. Must have __index member.
     */
    export interface IRow {
        __index: number;
    }

    /**
     * The Table class recursively wraps the contents of a tabular data
     * structure with a hierarchical index with v-data-tables
     */
    @Component({components: { Cell }})
    export default class Table extends Vue {

        /**
         * Internal tabular data structure
         */
        public _data: Scaffold;

        /**
         * Index to internal tabular data structure
         */
        public _index: FancyIndex;

        /**
         * Index to be passed in as prop
         */
        @Prop()
        public index: IIndexRow[];

        /**
         * Array of dicts depicting a tabular data structure
         */
        @Prop()
        public data: IRow[];

        /**
         * Create FancyIndex and Scaffold data structures
         */
        public created() {
            this._index = new FancyIndex(this.index);
            this._data = new Scaffold().from_array(this.data);
        }

        /**
         * Print content of index and data to console
         */
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

        /**
         * Headers to be passed to a v-data-table
         */
        public get headers(): IHeader[] {
            return this._index.to_headers();
        }

        /**
         * Data rows as grouped by the first header
         */
        public get rows() {
            return this._data
                .group_by(
                    x => x.head(1).to_array()[0],
                    this.group_column,
                )
                .to_array();
        }

        /**
         * Whether to display headers of each table
         */
        public get hide_headers(): boolean {
            return this._index.hide_headers;
        }

        /**
         * Whether each successive table is indented
         */
        public get indent(): boolean {
            return this._index.indent;
        }

        /**
         * Column upon which the outmost table is grouped
         */
        public get group_column(): string {
            return this._index.group_column;
        }

        /**
         * Returns a lut with the group_column values as its keys
         */
        public get groups() {
            return this._data.to_lut(this.group_column);
        }

        /**
         * Determines if given key is in groups
         */
        public in_groups(key: string): boolean {
            return this.groups.hasOwnProperty(key);
        }
    }
</script>

<style lang="stylus">
    @import "../static/css/vuetify.css"
    @import "../static/css/config.styl"

    .v-datatable__expand-content
        display: flex !important

    #child-table-container
        flex-grow: 10

    #aspect-table-row
        margin-bottom: 0px

    #aspect-table th:first-child,
    #cell:first-child
        border-left: 0px

    .v-table__overflow
        overflow-x: hidden

    table.v-table thead tr
        height: unset

    .v-datatable thead th.column.sortable
        padding-left: 6px

    table.v-table thead td:not(:nth-child(1)),
    table.v-table tbody td:not(:nth-child(1)),
    table.v-table thead th:not(:nth-child(1)),
    table.v-table tbody th:not(:nth-child(1)),
    table.v-table thead td:first-child,
    table.v-table tbody td:first-child,
    table.v-table thead th:first-child,
    table.v-table tbody th:first-child
        padding: unset
        border-left: 1px solid aspect_dark_2

    .theme--dark .v-datatable .v-datatable__actions,
    .application .theme--dark.v-datatable .v-datatable__actions
        background-color: aspect_bg
        color: aspect_white_alpha

    .theme--dark .v-table,
    .application .theme--dark.v-table
        background-color: aspect_bg
        color: aspect_light_2

    .theme--dark .v-datatable .v-datatable__actions,
    .application .theme--dark.v-datatable .v-datatable__actions
        background-color: aspect_bg
        color: aspect_white_alpha

    .v-datatable__expand-col--expanded
        border-bottom: 0px solid aspect_dark_2

    table.v-table tbody td,
    table.v-table tbody th
        height: unset

    table.v-table tbody td
        font-weight: 400
        font-size: 13px

    table.v-table thead th
        background-color: aspect_grey_1
        font-weight: 500
        font-size: 13px
        transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1)
        white-space: nowrap
        -webkit-user-select: none
        -moz-user-select: none
        -ms-user-select: none
        user-select: none

    .theme--dark .v-table tbody tr:not(:last-child),
    .application .theme--dark.v-table tbody tr:not(:last-child)
        border-bottom: 1px solid aspect_dark_2

    .theme--dark .v-table thead tr:first-child,
    .application .theme--dark.v-table thead tr:first-child
        border-bottom: 1px solid aspect_dark_2

    .theme--dark .v-table tbody tr:hover:not(.v-datatable__expand-row),
    .application .theme--dark.v-table tbody tr:hover:not(.v-datatable__expand-row)
        background: aspect_highlight_alpha

    .aspect-table #indent
        padding: 0px 0px 0px 8px
        background-color: aspect_dark_2
</style>
