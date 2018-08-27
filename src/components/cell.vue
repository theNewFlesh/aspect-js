<template>
    <v-flex class="widget-container" v-if="widget === 'slider'">
        <Slider class="widget"
            :value="value"
            :default_value="default_value"
            :display="display"
        />
    </v-flex>
    <!-- <v-flex class="widget-container" v-else-if="widget === 'float_input'">
        <FloatInput class="widget"
            :value="value"
            :default_value="default_value"
        />
    </v-flex> -->
    <v-flex class="widget-container-no-pad" v-else-if="widget === 'combobox'">
        <ComboBox class="widget"
            :value="value"
            :default_value="default_value"
            :display="display"
        />
    </v-flex>
    <!-- <v-flex class="widget-container" v-else-if="widget === 'dropdown'">
        <DropDown class="widget"
            :value="value"
            :default_value="default_value"
        />
    </v-flex> -->
    <v-flex class="widget-container-no-pad" v-else-if="widget === 'textarea'">
        <TextArea class="widget"
            :value="value"
            :default_value="default_value"
            :display="display"
        />
    </v-flex>
    <!-- <v-flex class="widget-container" v-else-if="widget === 'lock_options'">
        <DropDown class="widget"
            :value="value"
            :default_value="present"
            :options="['present', 'absent', 'unlocked', 'override']"
        />
    </v-flex> -->
    <v-flex class="widget-container" v-else>
        {{ value }}
    </v-flex>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";
    import Slider from "./slider.vue";
    import FloatInput from "./float_input.vue";
    import ComboBox from "./combobox.vue";
    import DropDown from "./dropdown.vue";
    import TextArea from "./textarea.vue";

    @Component( {components: { Slider, FloatInput, ComboBox, DropDown, TextArea }} )
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

        public get options(): object {
            return this.row.options;
        }

        public get lock(): string {
            return this.row.lock;
        }

        public get display(): object {
            return this.row.display;
        }

        public get widget(): string {
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
                return "widget_options";
            }
            if (this.column === "lock") {
                return "lock_options";
            }
            return "none";
        }
    }
</script>

<style lang="less">
    .widget-container, th {
        padding: 2px 6px 2px 6px;
    }

    .value-cell {
        min-width: 250px;
    }

    .inport_name-cell {
        min-width: 50px;
    }
</style>
