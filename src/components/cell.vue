<template>
    <div class="widget-container" v-if="widget_type === 'slider'">
        <Slider class="widget"
            :value="value"
            :default_value="default_value"
            :display="display"
        />
    </div>
    <div class="widget-container" v-else-if="widget_type === 'spinbox'">
        <SpinBox class="widget"
            :value="value"
            :default_value="default_value"
            :display="display"
        />
    </div>
    <div class="widget-container-no-pad" v-else-if="widget_type === 'combobox'">
        <ComboBox class="widget"
            :value="value"
            :default_value="default_value"
            :display="display"
        />
    </div>
    <div class="widget-container" v-else-if="widget_type === 'dropdown'">
        <DropDown class="widget"
            :value="value"
            :default_value="default_value"
            :display="display"
        />
    </div>
    <div class="widget-container-no-pad" v-else-if="widget_type === 'textarea'">
        <TextArea class="widget"
            :value="value"
            :default_value="default_value"
            :display="display"
        />
    </div>
    <div class="widget-container" v-else-if="widget_type === 'widget'">
        <DropDown class="widget"
            :value="widget"
            :default_value="widget"
            :display="widget_options"
        />
    </div>
    <div class="widget-container" v-else-if="widget_type === 'lock'">
        <DropDown class="widget"
            :value="lock"
            default_value="present"
            :display="lock_options"
        />
    </div>
    <div class="widget-container" v-else>
        {{ value }}
    </div>
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
                return "combobox";
            }
            if (this.column === "widget") {
                return "widget";
            }
            if (this.column === "lock") {
                return "lock";
            }
            return "none";
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
    .widget-container, th {
        padding: 2px 6px 2px 6px;
    }

    .value-cell,
    .default_value-cell {
        min-width: 250px;
    }

    .inport_name-cell {
        min-width: 50px;
    }
</style>
