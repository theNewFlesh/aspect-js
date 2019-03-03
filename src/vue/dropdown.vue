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
        v-on:change="on_change"
    >
        <template slot="selection" slot-scope="{ item, parent, selected }">
            <span v-if="item.text" class="pr-1">{{ item.text }}</span>
            <span v-else class="pr-1">{{ item }}</span>
        </template>
    </v-combobox>
</template>

<script lang="ts">
import * as _ from "lodash";
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { ISubEvent } from "./event_manager";

interface IOptions {
    values?: string[];
    default_color?: string;
}

interface IDisplay {
    options?: IOptions;
}

/**
 * Similar to ComboBox component but only allows 1 item to be selected
 */
@Component({})
export default class DropDown extends Vue {
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
    public selection;

    /**
     * Creat widget with value if it exists, else use default value
     */
    public created() {
        if (this.value !== undefined) {
            this.selection = this.value;
        }
        this.selection = this.default_value;
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
     * Update selection and display.options.values with item differs from
     * previous_item
     * @param items New item
     * @param previous_items Previously selected item
     */
    @Watch("selection")
    public update_selection(item, previous_item) {
        if (item !== previous_item) {
            if (typeof item === "string") {
                this.display.options.values.push(item);
                item = {
                    text: item,
                    value: item,
                    color: this.default_color
                };
            }
            this.selection = item;
        }
    }

    /**
     * Event handler for change events
     * @param value Value of dropdown selection.
     */
    public on_change(value: any): void {
        const event: ISubEvent = {
            name: "node_pane-widget-value-update",
            value: value.value
        };
        this.$emit(event.name, event);
    }

    /**
     * Determine whether query matchs item
     * @param item Item to query
     * @param query Query string
     */
    public filter(item, query): boolean {
        if (item.text === undefined) {
            item = { text: item };
        }
        return item.text.match(query) !== null;
    }
}
</script>

<style scoped lang="stylus">
    @import '../static/css/config.styl';

    .theme--dark .v-chip, .application .theme--dark.v-chip {
        background: aspect_cyan_1;
        color: aspect_bg;
    }

    .v-input {
        margin-top: 0px;
        font-size: 13px;
    }

    #aspect-dropdown.v-text-field {
        padding-left: 4px;
    }
</style>
