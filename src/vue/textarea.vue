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

<style scoped lang="stylus">
    @import "../static/css/vuetify.css"
    @import "../static/css/config.styl"

    .v-textarea textarea
        flex: unset
        line-height: unset
        max-width: unset
        min-height: unset
        outline: unset
        padding: unset
        width: unset

    textarea
        overflow: auto
        resize: none
        padding-top: 6px

    .v-textarea
        textarea
            min-height: 20px

    .v-icon
        align-items: center
        display: inline-flex
        -webkit-font-feature-settings: "liga"
        font-feature-settings: "liga"
        font-size: 16px
        justify-content: center
        line-height: 1
        transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1)
        vertical-align: text-bottom

    .theme--dark .v-text-field--solo .v-input__slot,
    .application .theme--dark.v-text-field--solo .v-input__slot
        border-radius: 0px
        background: aspect_bg

    .v-text-field input
        flex: 1 1 auto
        line-height: 20px
        max-width: 100%
        min-width: 0px
        width: 100%

    .v-textarea.v-text-field--enclosed .v-text-field__slot
        margin-right: unset
</style>
