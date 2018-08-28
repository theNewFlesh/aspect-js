<template>
    <!-- for item in items -->
    <v-combobox
        id="aspect-combobox"
        v-model="selection"
        :filter="filter"
        :hide-no-data="!query"
        :items="items"
        :search-input.sync="query"
        color="aspect_cyan_1"
        label="select or type an option"
        multiLine
        single-line
        hide-selected
        multiple
        small-chips
        dark
    >
        <template
            slot="selection"
            slot-scope="{ item, parent, selected }"
        >
            <v-chip
                class="combobox-chip"
                id="v-chip"
                :color="`${item.color}`"
                :selected="selected"
                label
                small
            >
                <span v-if="item.text"
                    class="pr-2">
                    {{ item.text }}
                </span>
                <span v-else
                    class="pr-2">
                    {{ item }}
                </span>
                <v-icon
                    @click="parent.selectItem(item)"
                    class="chip-x-icon"
                    small
                >
                    close
                </v-icon>
            </v-chip>
        </template>
    </v-combobox>
</template>

<script lang="ts">
    import { Component, Prop, Watch, Vue } from "vue-property-decorator";

    @Component({})
    export default class ComboBox extends Vue {
        @Prop()
        public value;

        @Prop()
        public default_value;

        @Prop()
        public display: object;

        public query = null;

        public selection = [];

        public get items(): object[] {
            const output: object[] = [];

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

        @Watch("selection")
        public update_selection(items, previous_items) {
            if (items.length !== previous_items.length) {
                this.selection = [];
                for (let item of items) {
                    if (typeof item === "string") {
                        this.display.options.values.push(item)
                        item = {
                            text: item,
                            value: item,
                            color: this.default_color,
                        }
                    }
                    this.selection.push(item);
                };
            }
        }

        public filter(item, query): boolean {
            if (item.text === undefined) {
                item = {text: item};
            }
            return item.text.match(query) !== null
        }
    }
</script>

<style scoped lang="less">
    .theme--dark .v-chip,
    .application .theme--dark.v-chip {
        background: #7EC4CF;
        color: #242424;
    }
    .v-input {
        margin-top: 0px;
    }
</style>
