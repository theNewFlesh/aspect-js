<template>
    <!-- for row in rows -->
    <v-data-table
        id="aspect-table"
        :headers="headers"
        :items="_rows"
        :hide-headers="hide_parent_headers"
        item-key="__index"
        hide-actions
    >
        <!-- for col in row -->
        <template slot="items" slot-scope="row">
            <tr @click="row.expanded = !row.expanded" >
                <td v-for="header in headers"
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
        <template v-if="_child_data.get(row.item[_group_column]).length > 0"
            slot="expand" slot-scope="row"
        >
            <td id="indent" v-if="indent"></td>
            <td id="child-table-container">
                <Table
                    :data="_child_data.get(row.item[_group_column])"
                    :columns="columns.slice(1)"
                    :hide_parent_headers="hide_child_headers"
                    :hide_child_headers="hide_child_headers"
                    :indent="indent"
                />
            </td>
        </template>
    </v-data-table>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";
    import Cell from "./cell.vue";
    import { OrderedDict, omit, to_kebab_case } from "../tools";
    import * as _ from "lodash";

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

        @Prop({default: true})
        public hide_parent_headers: boolean;

        @Prop({default: true})
        public hide_child_headers: boolean;

        @Prop({default: true})
        public indent: boolean;

        public columns: string[][];

        public _group_column: string;
        public _rows: object[];
        public _child_data: object;

        public created() {
            if (this.columns === undefined) {
                this.columns = this._generate_columns();
            }

            if (this.groups.length > 0) {
                const col = this.groups[0];
                const group = this.group_by(col);
                this._child_data = group;
                this._group_column = col;

                const rows = [];
                for (const i in group.keys) {
                    const key = group.keys[i];
                    const row = group.get(key)[0];
                    // needed by v-data-table
                    row["__index"] = i;
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
                    text: to_kebab_case(col),
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
    #aspect-table thead tr th,
    #aspect-table table.v-table tbody td,
    #aspect-table table.v-table tbody th,
    #aspect-table thead, #aspect-table thead tr {
        height: unset;
        line-height: unset;
        font-size: 12px;
        font-weight: 1;
        border-left: 1px solid #343434;
        border-bottom: 1px solid #343434;
        padding: 8px 8px 8px 8px;
    }

    .application .theme--dark.v-table, .theme--dark .v-table {
        background-color: #242424;
    }

    #cell {
        padding: 8px 8px 8px 8px;
        height: unset;
        line-height: unset;
    }

    .value-cell , .default_value-cell {
        min-width: 300px;
        border-right: 1px solid #343434;
    }

    #aspect-table #child-table-container {
        padding: 0px 0px 0px 0px;
        width: 100%;
    }

    #aspect-table #indent {
        padding: 0px 0px 0px 30px;
        border-right: 0px;
        background-color: #343434;
    }

    .v-textarea.v-text-field--enclosed .v-text-field__slot textarea {
        margin-top: 0px;
        padding-top: 4px;
        padding-bottom: 4px;
    }

    .v-text-field.v-text-field--enclosed .v-input__slot,
    .v-text-field.v-text-field--enclosed .v-text-field__details {
        padding-left: 4px;
    }

    .v-text-field>.v-input__control>.v-input__slot:before,
    .v-text-field>.v-input__control>.v-input__slot:after {
        display: none;
    }

    .v-text-field.v-text-field--enclosed .v-input__append-inner,
    .v-text-field.v-text-field--enclosed .v-input__append-outer,
    .v-text-field.v-text-field--enclosed .v-input__prepend-inner,
    .v-text-field.v-text-field--enclosed .v-input__prepend-outer {
        margin-top: 0px;
    }

    .v-text-field.v-text-field--enclosed .v-input__slot,
    .v-text-field.v-text-field--enclosed .v-text-field__details {
        padding-right: 0px;
        background-color: #343434;
    }

    #aspect-table thead tr th,
    #aspect-table table.v-table tbody td,
    #aspect-table table.v-table tbody th,
    #aspect-table thead,
    #aspect-table thead tr {
        border-left: 0px;
        border-bottom: 0px;
    }

    .application .theme--dark.v-table tbody tr:not(:last-child),
    .theme--dark .v-table tbody tr:not(:last-child) {
        border-color: #343434;
    }

    .application .theme--dark.v-table tbody tr:hover:not(.v-datatable__expand-row),
    .theme--dark .v-table tbody tr:hover:not(.v-datatable__expand-row) {
        background-color: rgba(126, 196, 207, 0.25);
    }
</style>
