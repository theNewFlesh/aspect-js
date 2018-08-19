<template>
    <div class="widget-container" v-if="widget === 'slider'">
        <Slider class="widget"
            :value="value"
            :default_value="default_value"
        />
    </div>
    <!-- <div class="widget-container" v-else-if="widget === 'float_input'">
        <FloatInput class="widget"
            :value="value"
            :default_value="default_value"
        />
    </div> -->
    <!-- <div class="widget-container" v-else-if="widget === 'multidropdown'">
        <MultiDropDown class="widget"
            :value="value"
            :default_value="default_value"
        />
    </div> -->
    <!-- <div class="widget-container" v-else-if="widget === 'dropdown'">
        <DropDown class="widget"
            :value="value"
            :default_value="default_value"
        />
    </div> -->
    <div class="widget-container" v-else-if="widget === 'textarea'">
        <TextArea class="widget"
            :value="value"
            :default_value="default_value"
        />
    </div>
    <!-- <div class="widget-container" v-else-if="widget === 'lock_options'">
        <DropDown class="widget"
            :value="value"
            :default_value="present"
            :options="['present', 'absent', 'unlocked', 'override']"
        />
    </div> -->
    <div class="widget-container" v-else-if="widget === 'none'">
        {{ value }}
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from "vue-property-decorator";
    import Slider from "./slider.vue";
    import FloatInput from "./float_input.vue";
    import MultiDropDown from "./multidropdown.vue";
    import DropDown from "./dropdown.vue";
    import TextArea from "./textarea.vue";

    @Component( {components: { Slider, FloatInput, MultiDropDown, DropDown, TextArea }} )
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

        public get options(): any {
            return this.row.options;
        }

        public get lock(): any {
            return this.row.lock;
        }

        public get widget(): string {
            if (this.column === "value") {
                return this.row.widget;
            }
            if (this.column === "default_value") {
                return this.row.widget;
            }
            if (this.column === "options") {
                return "multidropdown";
            }
            if (this.column === "widget") {
                return "dropdown";
            }
            if (this.column === "lock") {
                return "lock_options";
            }
            return "none";
        }
    }
</script>
