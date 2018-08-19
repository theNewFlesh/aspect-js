<template>
    <v-data-table
        :headers="vcolumns"
        :items="vdata"
        hide-actions
        item-key="index"
        class="elevation-1"
    >
        <template slot="items" slot-scope="props">
            <tr @click="props.expanded = !props.expanded">
                <td v-for="col in vcolumns" :key="col.index"
                    class="text-xs-right">{{ render_cell(props.item[col.value], col.value) }}
                </td>
            </tr>
        </template>
        <template v-if="index === undefined" slot="expand" slot-scope="props">
            <v-card flat>
                <v-card-text>Peek-a-boo!</v-card-text>
            </v-card>
        </template>
    </v-data-table>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";
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
        group: string;
        columns: string[];
    }

    interface IRow {
        index: number;
    }

    @Component
    export default class TableVu extends Vue {
        @Prop()
        public data: object[];

        @Prop()
        public columns: string[];

        @Prop()
        public index: ILevel[];

        @Prop({default: false})
        public show_index: boolean;

        public get shape(): number[] {
            return [this.columns.length, this.data.length];
        }

        public render_cell(value: any, widget: string) {
            return `value = ${value}, widget = ${widget}`;
        }

        public get vdata(): IRow[] {
            const data = [];
            for(let i in this.data) {
                const row = this.data[i];
                row["index"] = i;
                data.push(row);
            }
            return data;
        }

        public get vcolumns() {
            let vcolumns: IHeader[] = [];
            if (this.show_index) {
                vcolumns.push({
                    text: "index",
                    value: "index",
                    align: "left",
                    sortable: true,
                    class: ["index-column"],
                });
            }
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
            return vcolumns;
        }
    }
</script>
