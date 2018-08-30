<template>
    <v-textarea
        class="aspect-textarea"
        v-model="value"
        color="aspect_cyan_1"
        background-color="transparent"
        placeholder="placeholder text"
        :row-height="0.5"
        :hide-details="true"
        :auto-grow="true"
        :box="true"
        :clearable="true"
    />
</template>

<script lang="ts">
    import Vue from "vue";
    import { Component, Prop } from "vue-property-decorator";

    @Component({})
    export default class TextArea extends Vue {
        @Prop()
        public value;

        @Prop()
        public default_value;

        @Prop()
        public options;

        @Prop()
        public display;
    }
</script>

<style scoped lang="less">
    .aspect-textarea textarea {
        margin-top: 0px;
        font-size: 13px !important;
        padding-left: 6px !important;
        padding-bottom: 2px !important;
        background-color: transparent;
    }

    .aspect-textarea .v-input__slot {
        min-height: 20px;
    }

    .v-text-field > .v-input__control > .v-input__slot {
        display: none;
    }

    .v-datatable__expand-col.v-datatable__expand-col--expanded {
        display: none !important;
    }
</style>
