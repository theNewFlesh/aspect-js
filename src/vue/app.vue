<template>
    <Layout></Layout>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import Layout from "./layout.vue";

    @Component( {components: { Layout } })
    export default class App extends Vue {
    }
</script>

<style lang="less">
    html {
        overflow-y: hidden;
    }

    body {
        background: #141414;
    }
</style>
