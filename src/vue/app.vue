<template>
    <Layout></Layout>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import Layout from "./layout.vue";

    /**
     * Contains the entire Aspect Vue application
     */
    @Component( {components: { Layout } })
    export default class App extends Vue {
    }
</script>

<style lang="stylus">
    @import "../static/css/config.styl"
    @import "../static/css/material-icons.css"

    html
        overflow-y: hidden

    body
        background: aspect_dark_2
</style>
