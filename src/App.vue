<template>
    <div id="app">
        <!-- <DevContainer /> -->
        <Table :data="data" :columns="columns"/>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import DevContainer from "./components/DevContainer.vue";
    import Table from "./components/table.vue";
    import * as _ from "lodash";

    // @Component( {components: { DevContainer } })
    // export default class App extends Vue {
    //     public selected;
    // }
    @Component( {components: { Table } })
    export default class App extends Vue {
        public rows = [
            ["scene-001",  "graph-001", "node-001", "func2", 0, 0, "slider", "always"],
            ["scene-001",  "graph-001", "node-001", "func2", 1, 0, "slider", "always"],
            ["scene-001",  "graph-001", "node-002", "func3", 2, 0, "slider", "always"],
            ["scene-002",  "graph-001", "node-001", "func2", 3, 0, "slider", "always"],
            ["scene-002",  "graph-001", "node-001", "func2", 4, 0, "slider", "always"],
            ["scene-002",  "graph-001", "node-002", "func3", 5, 0, "slider", "always"],
        ]
        public columns = [
            "scene-id", "graph-id", "node-id",
            "node-name", "value", "default", "widget", "pattern"
        ];
        public data = _.map(this.rows, (item) => (_.zipObject(this.columns, item)) );
    }
</script>

<style lang="less">
body {
    background: #242424;
}
</style>
