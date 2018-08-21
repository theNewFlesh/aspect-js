<template>
    <v-textarea
        class="aspect-testarea"
        v-model="value"
        :color="options.color"
        :background-color="options.background_color"
        :placeholder="options.placeholder"
        hide-details="true"
        autogrow="true"
        box="true"
        clearable="true"
    />
</template>

<script lang="ts">
    import Vue from "vue";
    import { Component, Prop } from "vue-property-decorator";

    @Component({})
    export default class TextArea extends Vue {
        public value;
        public default_value;
        public options: object = {
            color: "#FF0000",
            background_color: "#FF0000",
            plaveholder: "text,"
        };

        public display: object = {
        }
    }
</script>

<style scoped lang="less">
    .aspect-testarea {
        border: 1px solid #A4A4A4;
    }
</style>
