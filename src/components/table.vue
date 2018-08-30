<template>
    <!-- for row in rows -->
    <v-data-table
        class="aspect-table"
        :headers="headers"
        :items="_rows"
        :hide-headers="_header_masks[0]"
        item-key="__index"
        hide-actions
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
        <template v-if="_has_data(row.item)"
            slot="expand" slot-scope="row"
        >
            <td id="indent" v-if="indent"></td>
            <td id="child-table-container">
                <Table
                    :data="_child_data.get(row.item[_group_column])"
                    :columns="columns.slice(1)"
                    :header_masks="_header_masks.slice(1)"
                    :indent="indent"
                />
            </td>
        </template>
    </v-data-table>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";
    import Cell from "./cell.vue";
    import { OrderedDict, omit, conform_name } from "../tools";
    import * as _ from "lodash";
    import uuidv4 from "uuid/v4";

    interface IHeader {
        text: string;
        value: string;
        align: string; // "left", "center", "right"
        sortable: boolean;
        class: string[];
        width?: number;
        index: number;
    }

    @Component({components: { Cell }})
    export default class Table extends Vue {
        @Prop()
        public data: object[];

        @Prop()
        public columns: string[][];

        @Prop({default: []})
        public header_masks: boolean[];

        @Prop({default: true})
        public indent: boolean;

        public _group_column: string;
        public _rows: object[];
        public _child_data: object;

        public get _header_masks(): boolean[] {
            if (this.header_masks.length > 0) {
                return this.header_masks;
            }
            return _.map(this.columns, (x) => (true));
        }

        public created() {
            this.initialize_rows()
        }

        public _has_data(row): boolean {
            const data = this._child_data.get(row[this._group_column]);
            if (data === undefined) {
                return false;
            }
            return data.length !> 0;
        }

        public initialize_rows() {
            if (this.columns === undefined) {
                this.columns = this._generate_columns();
            }

            if (this.groups.length > 0) {
                const col = this.groups[0];
                const group = this.group_by(col);
                this._child_data = group;
                this._group_column = col;

                const rows = [];
                for (const key of group.keys) {
                    const row = group.get(key)[0];
                    // needed by v-data-table
                    row["__index"] = uuidv4();
                    rows.push(row);
                }
                this._rows = rows;
            } else {
                this._rows = this.data;
            }
        }

        public _generate_columns(): string[][] {
            let cols: any = _.map(this.data, (row) => (Object.keys(row)));
            cols = _.reduce(cols, (a, b) => (_.concat(a, b)));
            cols = _.uniq(cols);
            return [ cols ];
        }

        public get groups(): string[] {
            if (this.columns === undefined) {
                return [];
            }
            return _.map(this.columns, (col) => (col[0]));
        }

        public group_by(column: string): OrderedDict {
            const group = new OrderedDict({}, []);
            for (const row of this.data) {
                group.get( row[column] ).push(row);
            }
            return group;
        }

        public get headers(): IHeader[] {
            let headers = [];
            let i: number = 0;
            for (const col of this.columns[0]) {
                headers.push({
                    text: conform_name(col),
                    value: col,
                    align: "left",
                    sortable: true,
                    class: [col + "-column"],
                    // width: "100%",
                    index: i++,
                });
            }

            headers = _.filter(headers, (item) => (item.value !== "__index"));
            return headers;
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
        padding: 0px 0px 0px 15px;
        background-color: #141414;
    }
</style>
