<template>
    <!-- for item in items -->
    <v-flex>
        <v-combobox
            id="aspect-combobox"
            v-model="selection"
            :filter="filter"
            :hide-no-data="!query"
            :items="items"
            :search-input.sync="query"
            color="aspect_cyan_1"
            label="search for an option"
            multiLine
            hide-selected
            multiple
            small-chips
            solo
            dark
        >
            <template
                slot="selection"
                slot-scope="row"
            >
                <v-chip
                    class="combobox-chip"
                    id="v-chip"
                    :color="`${row.item.color}`"
                    :selected="selected"
                    label
                    small
                >
                    <span>{{ row.item.text }}</span>
                </v-chip>
            </template>
        </v-combobox>
    </v-flex>
</template>

<script lang="ts">
    import { Component, Prop, Watch, Vue } from "vue-property-decorator";
    import * as _ from "lodash";
    import { add_style_attribute } from "../tools";

    @Component({})
    export default class ComboBox extends Vue {
        @Prop()
        public value;

        @Prop()
        public default_value;

        @Prop()
        public display: object;

        public editing = null;

        public index = -1;

        public query = null;

        public selection = [];

        public get items(): object[] {
            const output: object[] = [
                // { header: "select an option or create one" }
            ];

            for (const option of this.display.options.values) {
                output.push({
                    value: option,
                    text: option.toString(),
                    color: this.default_color,
                });
            }

            return output;
        }

        public get default_color(): string {
            if (this.display.options.default_color) {
                return this.display.options.default_color;
            }
            return "aspect_cyan_1"
        }

        @Watch()
        public selection(items, previous_items) {
            if (items.length !== previous_items.length) {

                this.selection = [];
                for (let item of items) {
                    if (typeof item === "string") {
                        const obj = {
                            text: item,
                            value: item,
                            color: this.default_color,
                        }
                    }
                    this.display.options.values.push(item)
                    this.selection.push(item);
                };
            }
        }

        public edit(index, item) {
            if (!this.editing) {
                this.editing = item
                this.index = index
            } else {
                this.editing = null
                this.index = -1
            }
        }

        public filter(item, query): boolean {
            if (item.header !== undefined) {
                return false;
            }
            query = query.toString().toLowerCase();
            return item.text.indexOf(query) > -1;
        }
    }
</script>

<style scoped lang="less">
</style>
