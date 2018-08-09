<template>
    <div id="app">
        <DevContainer />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import DevContainer from "./components/DevContainer.vue";

    @Component( {components: { DevContainer } })
    export default class App extends Vue {
        public selected;
    }
</script>

<style lang="less">
// body {
//     background: #242424;
// }

#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
