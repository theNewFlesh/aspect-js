<template>
    <v-textarea
          v-model="value"
          :color="options.color"
          :background-color="options.background_color"
          :placeholder="options.placeholder"
          autogrow="true"
          box="true"
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
</style>
