<template>
    <!-- for item in items -->
    <v-combobox
        id="aspect-dropdown"
        v-model="selection"
        :filter="filter"
        :hide-no-data="!query"
        :items="items"
        :search-input.sync="query"
        color="aspect_cyan_1"
        label="select or type an option"
        single-line
        hide-selected
        small-chips
        dark
    >
        <template
            slot="selection"
            slot-scope="{ item, parent, selected }"
        >
            <span v-if="item.text"
                class="pr-1">
                {{ item.text }}
            </span>
            <span v-else
                class="pr-1">
                {{ item }}
            </span>
        </template>
    </v-combobox>
</template>

<script lang="ts">
    import { Component, Prop, Watch, Vue } from "vue-property-decorator";

    @Component({})
    export default class DropDown extends Vue {
        @Prop()
        public value;

        @Prop()
        public default_value;

        @Prop()
        public display: object;

        public query = null;

        public selection;

        public created() {
            if (this.value !== undefined) {
                this.selection = this.value;
            }
            this.selection = this.default_value;
        }

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
            return "aspect_cyan_1";
        }

        @Watch("selection")
        public update_selection(item, previous_item) {
            if (item !== previous_item) {
                if (typeof item === "string") {
                    this.display.options.values.push(item);
                    item = {
                        text: item,
                        value: item,
                        color: this.default_color,
                    };
                }
                this.selection = item;
            }
        }

        public filter(item, query): boolean {
            if (item.text === undefined) {
                item = {text: item};
            }
            return item.text.match(query) !== null;
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
        font-size: 13px;
    }
</style>
