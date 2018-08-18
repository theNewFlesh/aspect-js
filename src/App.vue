<template>
    <div id="app">
        <!-- <Table :data="data" :columns="columns"/> -->
        <TreeGrid :columns="columns" :rows="rows" />
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DevContainer from "./components/DevContainer.vue";
import Table from "./components/table.vue";
import TreeGrid from "./components/treegrid.vue";
import * as _ from "lodash";
import * as pf from "vue-patternfly-ts";

const rows = [
        [0, "scene-001",  "graph-001", "node-001", "func2", 0, 0, "slider",        "always"],
        [1, "scene-001",  "graph-001", "node-002", "func3", 2, 0, "float_input",   "always"],
        [2, "scene-002",  "graph-001", "node-001", "func2", 3, 0, "multidropdown", "always"],
        [3, "scene-002",  "graph-001", "node-001", "func2", 4, 0, "textarea",      "always"],
        [4, "scene-002",  "graph-001", "node-002", "func3", 5, 0, "slider",        "always"],
    ];

const columns = [
    "scene-id", "graph-id", "node-id",
    "node-name", "value", "options_", "widget", "pattern"
];

const data = _.map(rows, (row) => (_.zipObject(columns, row)) );

@Component( {components: { TreeGrid } })
export default class App extends Vue {
    public columns = columns;
    public rows = data;
}
</script>

<style lang="less">
body {
    background: #242424;
}
</style>
