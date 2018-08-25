<template>
    <v-combobox
        id="aspect-combobox"
        v-model="model"
        :filter="filter"
        :hide-no-data="!search"
        :items="items"
        :search-input.sync="search"
        label="search for an option"
        hide-selected
        multiple
        small-chips
        solo
        dark
    >
        <template slot="no-data">
            <v-list-tile>
                <span class="subheading">create</span>
                <v-chip
                    id="v-chip"
                    :color="`${colors[nonce - 1]} lighten-3`"
                    label
                    small
                >
                    {{ search }}
                </v-chip>
            </v-list-tile>
        </template>
        <template
            v-if="item === Object(item)"
            slot="selection"
            slot-scope="{ item, parent, selected }"
        >
            <v-chip
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
                    small
                    @click="parent.selectItem(item)"
                >close</v-icon>
            </v-chip>
        </template>
        <template
            slot="item"
            slot-scope="{ index, item, parent }"
        >
            <v-list-tile-content>
                <v-text-field
                    v-if="editing === item"
                    v-model="editing.text"
                    autofocus
                    flat
                    background-color="transparent"
                    hide-details
                    solo
                    @keyup.enter="edit(index, item)"
                ></v-text-field>
                <v-chip
                    id="v-chip"
                    v-else
                    :color="`${item.color} lighten-3`"
                    dark
                    label
                    small
                >
                    {{ item.text }}
                </v-chip>
            </v-list-tile-content>
            <v-spacer></v-spacer>
            <v-list-tile-action @click.stop>
                <v-btn
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
        public options;

        @Prop()
        public display;

        public activator = null;
        public attach = null;
        public colors = ["green", "purple", "indigo", "cyan", "teal", "orange"];
        public editing = null;
        public index = -1;
        public items = [
            { header: "select an option or create one" },
            {
                text: "foo",
                color: "blue"
            },
            {
                text: "bar",
                color: "red"
            }
        ];
        public nonce = 1;
        public menu = false;
        public model = [
            {
                text: "foo",
                color: "blue"
            }
        ];
        public x = 0;
        public search = null;
        public y = 0;

        @Watch()
        public model(val, prev) {
            if (val.length === prev.length) {
                return;
            }

            this.model = val.map(v => {
                if (typeof v === "string") {
                    v = {
                        text: v,
                        color: this.colors[this.nonce - 1]
                    }

                    this.items.push(v)

                    this.nonce++
                }

                return v
            })
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

    .v-chip--small {
        height: 15px;
    }

    .v-text-field.v-text-field--enclosed .v-text-field__details,
    .v-text-field.v-text-field--enclosed .v-input__slot {
        padding: 0 6px;
    }

    .v-select__slot {
        height: 15px !important;
    }
</style>
