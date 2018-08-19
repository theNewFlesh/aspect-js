<template>
    <v-data-table
        :headers="vcolumns"
        :items="vdata"
        hide-actions
        item-key="index"
        class="elevation-1"
    >
        <!-- for row in vdata -->
        <template slot="items" slot-scope="row">
            <tr @click="row.expanded = !row.expanded">
                <td v-for="header in vcolumns" :key="header.index">
                    <Cell
                        :column="header.value"
                        :row="row.item.parent_data"
                    />
                </td>
            </tr>
            <template v-if="index.length > 0" slot="expand" slot-scope="row">
                <Table
                    :data="row.item.child_data"
                    :columns="index[0].child_columns"
                    :index="index.slice(1)"
                    show_index="true"
                />
            </template>
        </template>
    </v-data-table>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";
    import Cell from "./cell.vue";
    import * as _ from "lodash";

    interface IHeader {
        text: string;
        value: string;
        align: string; // "left", "center", "right"
        sortable: boolean;
        class: string[];
        width?: number;
        index?: number;
    }

    interface ILevel {
        parent_column: string;
        child_columns: string[];
    }

    interface IRow {
        index: number;
    }

    class OrderedDict {
        constructor(items: object = undefined, default_value = undefined) {
            this.default = default_value;
            if (items !== undefined) {
                this._keys = Object.keys(items);
                this._items = items;
            }
        }

        public _keys = [];
        public _items = {};
        public default;

        public get(key) {
            if (this._items[key] === undefined) {
                if (this.default !== undefined) {
                    this._items[key] = _.clone(this.default);
                    this._keys.push(key);
                }
            }
            return this._items[key];
        };

        public set(key, value) {
            if (this._items[key] === undefined) {
                this._keys.push(key);
            }
            this._items[key] = value;
        }

        public insert(position, key, value) {
            if (this._items[key] !== undefined) {
                this._keys.splice(position, 0, key);
                this._items[key] = value;
            }
        }

        public get items() {
            return _.map(this._keys, (key) => ( [key, this.get(key)] ));
        }

        public get keys(): any[] {
            return this._keys;
        }

        public get values(): any[] {
            const output = [];
            for (const key of this._keys) {
                output.push(this._items[key]);
            }
            return output;
        }

        public get length(): number {
            return this._keys.length;
        };

        public as_object(): object {
            return this._items;
        }
    }

    @Component({components: { Cell }})
    export default class Table extends Vue {
        @Prop()
        public data: object[];

        @Prop()
        public columns: string[];

        @Prop({default: []})
        public index: ILevel[];

        @Prop({default: false})
        public show_index: boolean;

        public get shape(): number[] {
            return [this.columns.length, this.data.length];
        }

        public render_cell(value: any, widget: string) {
            return `value = ${value}, widget = ${widget}`;
        }

        public _group(column: string) {
            const groups = new OrderedDict({}, []);
            for (const row of this.data) {
                groups.get( row[column] ).push(row);
            }

            return _.map(
                groups.items,
                (item) => ({
                    column: item[0],
                    data: item[1],
                })
            );
        }

        public get vdata(): IRow[] {
            let output = [];
            if (this.index.length > 0) {
                const idx = this.index[0];
                const groups = this._group(idx.parent_column);

                const omit_cols = _.omit(idx.child_columns, "filter");
                const pick_cols = idx.child_columns;
                pick_cols.push("index");

                for (const i in groups) {
                    const col = groups[i].column;
                    const rows = groups[i].data;
                    const parent = _.omit(rows[0], omit_cols);
                    const child  = _.map(
                        rows,
                        (row) => ( _.pick(row, pick_cols) )
                    );

                    output.push({
                        parent_data: parent,
                        child_data: child,
                    });
                }
            } else {
                for (const i in this.data) {
                    output.push({
                        parent_data: this.data[i],
                        child_data: [],
                    });
                }
            }
            return output;
        }

        public get vcolumns() {
            let vcolumns: IHeader[] = [];
            let i: number = 0;
            for (const col of this.columns) {
                vcolumns.push({
                    text: col,
                    value: col,
                    align: "left",
                    sortable: true,
                    class: [col + "-column"],
                    // width: "100%",
                    index: i++,
                });
            }
            if (this.show_index === false) {
                vcolumns = _.filter(vcolumns, (item) => (item.value !== "index"));
            }

            // if (this.index.length > 0) {
            //     vcolumns = _.omit(vcolumns, this.index[0].child_columns);
            // }
            return vcolumns;
        }
    }
</script>
