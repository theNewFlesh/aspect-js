<template>
    <!-- for row in rows -->
    <v-data-table
        :headers="headers"
        :items="_rows"
        hide-actions
        item-key="__index"
        class="elevation-1"
    >
        <!-- for col in row -->
        <template slot="items" slot-scope="row">
            <tr @click="row.expanded = !row.expanded" >
                <td v-for="header in headers" :key="header.__index">
                    <Cell
                        :column="header.value"
                        :row="row.item"
                    />
                </td>
            </tr>
        </template>
        <!-- child data row -->
        <template v-if="_child_data.get(row.item[_group_column]).length > 0" slot="expand" slot-scope="row" >
            <td>
                <Table
                    :data="_child_data.get(row.item[_group_column])"
                    :groups="groups.slice(1)"
                    :columns="columns"
                />
            </td>
        </template>
    </v-data-table>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";
    import Cell from "./cell.vue";
    import { OrderedDict, omit } from "../tools";
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

    interface ILevel {
        parent_column: string;
        child_columns: string[];
    }

    interface IRow {
        index: number;
    }

    interface IGroupRow {
        group: string;
        index: any;
        parent: IRow;
        child: IRow[];
    }

    @Component({components: { Cell }})
    export default class Table extends Vue {
        @Prop()
        public data: object[];

        @Prop()
        public columns: string[][];

        @Prop({default: []})
        public groups: string[];

        public _group_column: string;
        public _rows: object[];
        public _child_data: object;

        public log(item) {
            console.log(item);
            return item;
        }

        public get stuff() {
            return {
                rows: this._rows,
                child_data: this._child_data,
                group_column: this._group_column
            };
        }

        public created() {
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
            for (const col of this.columns) {
                headers.push({
                    text: col,
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
