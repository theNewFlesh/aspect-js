<template>
    <div class="textarea-container">
        <textarea class="textarea" v-model="value"></textarea>
    </div>
</template>

<script lang="ts">
    import Vue from "vue";
    import { Component, Prop } from "vue-property-decorator";

    @Component({})
    export default class TextArea extends Vue {
        public value;
        public default_value;
    }
</script>

<style scoped lang="less">
    .textarea-container {
        display: flex;
    }
    .textarea {
        flex-grow: 10;
    }
</style>
