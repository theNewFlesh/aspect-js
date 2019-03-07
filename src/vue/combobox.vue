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
        <template slot="selection" slot-scope="{ item, parent, selected }">
            <v-chip
                class="combobox-chip"
                id="v-chip"
                :color="`${item.color}`"
                :selected="selected"
                label
                small
            >
                <span v-if="item.text" class="pr-1">{{ item.text }}</span>
                <span v-else class="pr-1">{{ item }}</span>
                <v-icon @click="parent.selectItem(item)" class="chip-x-icon" small>close</v-icon>
            </v-chip>
        </template>
    </v-combobox>
</template>

<script lang="ts">
    import * as _ from "lodash";
    import { ISubEvent } from "../core/event_manager";
    import { Component, Prop, Watch, Vue } from "vue-property-decorator";

    interface IOptions {
        values?: string[];
        default_color?: string;
    }

    interface IDisplay {
        options?: IOptions;
    }

    /**
     * A dropdown box that allows for multiple selections
     */
    @Component({})
    export default class ComboBox extends Vue {
        /**
         * Value of component
         */
        @Prop()
        public value;

        /**
         * Default value of component
         */
        @Prop()
        public default_value;

        /**
         * Display options of component
         */
        @Prop()
        public display: IDisplay;

        /**
         * Query string used for searching combobox
         */
        public query = null;

        /**
         * Selected items
         */
        public selection = [];

        /**
         * Creat widget with value if it exists, else use default value
         */
        public created() {
            if (this.value !== undefined) {
                if (this.value instanceof Array) {
                    this.selection = this.value;
                } else {
                    this.selection.push(this.value);
                }
            } else {
                this.selection.push(this.default_value);
            }
        }

        /**
         * Returns Array of objects with value, text and color keys
         */
        public get items(): object[] {
            const output: object[] = [];

            for (const option of this.display.options.values) {
                output.push({
                    value: option,
                    text: option.toString(),
                    color: this.default_color
                });
            }
            return output;
        }

        /**
         * Returns the default color of the widget
         */
        public get default_color(): string {
            if (this.display.options.default_color) {
                return this.display.options.default_color;
            }
            return "aspect_cyan_1";
        }

        /**
         * Update selection and display.options.values with items if they differ
         * from previous_items
         * @param items Item to select
         * @param previous_items Previously selected items
         */
        @Watch("selection")
        public update_selection(items: any[], previous_items: any[]) {
            if (items.length !== previous_items.length) {
                this.selection = [];
                for (let item of items) {
                    if (typeof item === "string") {
                        this.display.options.values.push(item);
                        item = {
                            text: item,
                            value: item,
                            color: this.default_color
                        };
                    }
                    this.selection.push(item);
                }

                const event: ISubEvent = {
                    name: "node_pane-widget-value-update",
                    value: _.map(this.selection, x => x.value)
                };
                this.$emit(event.name, event);
            }
        }

        /**
         * Determine whether query matchs item
         * @param item Item to query
         * @param query Query string
         */
        public filter(item: any, query: string): boolean {
            if (item.text === undefined) {
                item = { text: item };
            }
            return item.text.match(query) !== null;
        }
    }
</script>

<style lang="stylus">
    @import '../static/css/vuetify.css';
    @import '../static/css/config.styl';

    .theme--dark .v-chip, .application .theme--dark.v-chip {
        background: aspect_cyan_1;
        color: aspect_bg;
    }

    .v-input {
        margin-top: 0px;
    }

    .v-chip--small {
        height: unset;
    }

    .v-chip .v-chip__content {
        height: 15px;
    }
</style>
