<template>
    <v-textarea
        class="aspect-testarea"
        v-model="value"
        :color="display.color"
        background-color="'#343434'"
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
    // .aspect-testarea textarea {
    //     font-size: 12px;
    //     padding-bottom: 2px;
    // }

    // .aspect-testarea .v-input__slot {
    //     min-height: 20px;
    // }
</style>
