<template>
    <v-flex
        v-if="widget_type === 'slider'"
        class="widget-container pad-4"
    >
        <Slider class="widget"
            :value="value"
            :default_value="default_value"
            :display="display"
        />
    </v-flex>
    <v-flex
        v-else-if="widget_type === 'spinbox'"
        class="widget-container pad-2"
    >
        <SpinBox class="widget"
            :value="value"
            :default_value="default_value"
            :display="display"
        />
    </v-flex>
    <v-flex
        v-else-if="widget_type === 'combobox'"
        class="widget-container"
    >
        <ComboBox class="widget"
            :value="value"
            :default_value="default_value"
            :display="display"
        />
    </v-flex>
    <v-flex
        v-else-if="widget_type === 'dropdown'"
        class="widget-container pad-l"
    >
        <DropDown class="widget"
            :value="value"
            :default_value="default_value"
            :display="display"
        />
    </v-flex>
    <v-flex
        v-else-if="widget_type === 'textarea'"
        class="widget-container pad-l"
    >
        <TextArea class="widget"
            :value="value"
            :default_value="default_value"
            :display="display"
        />
    </v-flex>
    <v-flex
        v-else-if="widget_type === 'widget'"
        class="widget-container widget"
    >
        <DropDown class="widget pad-l"
            :value="widget"
            :default_value="widget"
            :display="widget_options"
        />
    </v-flex>
    <v-flex
        v-else-if="widget_type === 'lock'"
        class="widget-container lock"
    >
        <DropDown class="widget pad-l"
            :value="lock"
            default_value="present"
            :display="lock_options"
        />
    </v-flex>
    <v-flex
        v-else-if="widget_type === 'display'"
        class="widget-container display"
    >
        <TextArea class="widget"
            :value="JSON.stringify(display)"
            :default_value="default_value"
        />
    </v-flex>
    <v-flex
        v-else
        class="widget-container inert"
    >
        {{ value }}
    </v-flex>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";
    import Slider from "./slider.vue";
    import SpinBox from "./spinbox.vue";
    import ComboBox from "./combobox.vue";
    import DropDown from "./dropdown.vue";
    import TextArea from "./textarea.vue";

    @Component( {components: { Slider, SpinBox, ComboBox, DropDown, TextArea }} )
    export default class Cell extends Vue {
        @Prop()
        public row: any;

        @Prop()
        public column: string;

        public get value(): any {
            return this.row[this.column];
        }

        public get default_value(): any {
            return this.row.default_value;
        }

        public get display(): object {
            return this.row.display;
        }

        public get widget(): string {
            return this.row.widget;
        }

        public get lock(): string {
            return this.row.lock;
        }

        public get widget_type(): string {
            if (this.column === "value") {
                return this.row.widget;
            }
            if (this.column === "default_value") {
                return this.row.widget;
            }
            if (this.column === "display") {
                return "display";
            }
            if (this.column === "widget") {
                return "widget";
            }
            if (this.column === "lock") {
                return "lock";
            }
            return "inert";
        }

        public lock_options: object = {
            options: {
                values: [
                    "absent",
                    "present",
                    "unlocked",
                    "override",
                ]
            }
        }

        public widget_options: object = {
            options: {
                values: [
                    "combobox",
                    "dropdown",
                    "slider",
                    "spinbox",
                    "textarea",
                ]
            }
        }
    }
</script>

<style lang="less">
    .widget-container.pad-2, th {
        padding: 2px 6px 2px 6px;
    }

    .widget-container.pad-4 {
        padding: 4px 6px 4px 6px;
    }

    .widget-container.pad-l {
        padding: 0px 0px 0px 6px;
    }

    .value-cell,
    .default_value-cell {
        min-width: 250px;
    }

    .widget-cell {
        max-width: 90px;
        padding: 0px 0px 0px 6px;
    }

    .lock-cell {
        max-width: 90px;
        padding: 0px 0px 0px 6px;
    }

    .display-cell {
        max-width: 250px;
        padding: 0px 0px 0px 6px;
    }
</style>
