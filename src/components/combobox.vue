<template>
    <!-- for item in items -->
    <v-combobox
        id="aspect-combobox"

        :filter="filter"
        :hide-no-data="!query"
        :items="items"
        :search-input.sync="query"
        label="search for an option"
        multiLine="true"
        hide-selected
        multiple
        small-chips
        solo
        dark
    >
        <!-- subheading appears when creating new item -->
        <template slot="no-data">
            <v-list-tile class="combox-subheading">
                <span class="subheading">create</span>
                <v-chip
                    id="v-chip"
                    :color="`${default_color} lighten-3`"
                    label
                    small
                >
                    {{ query }}
                </v-chip>
            </v-list-tile>
        </template>

        <template
            v-if="item === Object(item)"
            slot="selection"
            slot-scope="{ item, parent, selected }"
        >
            <v-chip
                class="combobox-chip"
                id="v-chip"
                :color="`${item.color} lighten-3`"
                :selected="selected"
                label
                small
            >
                <span class="pr-2">
                    {{ item.text }}
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

        <template
            slot="item"
            slot-scope="{ index, item, parent }"
        >
            <v-list-tile-content class="search-list">
                <v-text-field
                    v-if="editing === item"
                    @keyup.enter="edit(index, item)"
                    v-model="editing.text"
                    background-color="transparent"
                    autofocus
                    flat
                    hide-details
                    solo
                ></v-text-field>
                <v-chip
                    v-else
                    id="v-chip"
                    :color="`${item.color} lighten-3`"
                    dark
                    label
                    small
                >
                    {{ item.text }}
                </v-chip>
            </v-list-tile-content>
            <!-- <v-spacer></v-spacer>  -->

            <v-list-tile-action @click.stop>
                <v-btn
                    class="edit-button"
                    icon
                    @click.stop.prevent="edit(index, item)"
                >
                    <v-icon>{{ editing !== item ? "edit" : "check" }}</v-icon>
                </v-btn>
            </v-list-tile-action>
        </template>
    </v-combobox>
</template>

<script lang="ts">
    import { Component, Prop, Watch, Vue } from "vue-property-decorator";
    import * as _ from "lodash";

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

        public model = [];

        public get items(): object[] {
            const output: object[] = [
                { header: "select an option or create one" }
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
            return "cyan"
        }

        @Watch()
        public model(items, previous_items) {
            if (items.length !== previous_items.length) {

                this.model = [];
                for (let item of items) {
                    // if (typeof item === "string") {
                    //     const obj = {
                    //         text: item,
                    //         value: item,
                    //         color: this.default_color,
                    //     }
                    // }
                    this.display.options.values.push(item)
                    this.model.push(item);
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

        public filter(item, queryText, itemText) {
            if (item.header) {
                return false;
            }

            const hasValue = val => val != null ? val : "";

            const text = hasValue(itemText);
            const query = hasValue(queryText);

            const output = text.toString()
            .toLowerCase()
            .indexOf(query.toString().toLowerCase()) > -1;

            return output
        }
    }
</script>

<style scoped lang="less">
    .v-text-field.v-text-field--solo .v-input__control {
        min-height: 0px;
        padding: 0;
    }

    #aspect-combobox label .v-label.theme--dark {
        padding-left: 6px !important;
    }

    .v-chip--small {
        height: 15px;
    }

    .v-text-field.v-text-field--enclosed .v-text-field__details,
    .v-text-field.v-text-field--enclosed .v-input__slot {
        padding: 0 6px;
        border-radius: 0px;
    }

    .v-label.theme--dark {
        padding-left: 6px !important;
    }
</style>
