<template>
    <v-app dark id="app">
        <Table :data="data" :columns="columns" :index="index" show_index="true" />
    </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DevContainer from "./components/DevContainer.vue";
import Table from "./components/table.vue";
import * as _ from "lodash";

import Vuetify from "vuetify";
Vue.use(Vuetify, {
    theme: {
        primary: "#F4F4F4",
        secondary: "#242424",
        accent: "#A4A4A4",
        error: "#F77E70",
        info: "#5F95DE",
        success: "#8BD155",
        warning: "#EB9E58"
    }
});

const rows = [
        [0, "scene-001",  "graph-001", "node-001", "func2", 0, 0, [0, 1, 2, 3], "slider",        "absent"],
        [1, "scene-001",  "graph-001", "node-002", "func3", 2, 2, [0, 1, 2, 3], "float_input",   "present"],
        [2, "scene-002",  "graph-001", "node-001", "func2", 3, 3, [0, 1, 2, 3], "multidropdown", "override"],
        [3, "scene-002",  "graph-001", "node-001", "func2", 4, 4, [0, 1, 2, 3], "textarea",      "unlocked"],
        [4, "scene-002",  "graph-001", "node-002", "func3", 5, 5, [0, 1, 2, 3], "slider",        "present"],
    ];

const columns = [
    "index",
    "scene-id", "graph-id", "node-id", "node-name",
    "value", "default_value", "options", "widget", "lock"
];

const data = _.map(rows, (row) => (_.zipObject(columns, row)) );

const index = [
    {   parent_column: "node-id", child_columns: ["value", "default_value", "options", "widget", "lock"] },
];

@Component( {components: { Table } })
export default class App extends Vue {
    public columns = columns;
    public rows = rows;
    public data = data;
    public index = index;
}
</script>
