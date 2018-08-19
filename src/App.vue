<template>
    <v-app dark id="app">
        <Table :data="data" :columns="columns" :groups="groups" />
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
        ["scene-001",  "graph-001", "node-001", "func1", "foo", 0, 0, [0, 1, 2, 3], "slider",        "absent"],
        ["scene-001",  "graph-001", "node-001", "func1", "bar", 2, 2, [0, 1, 2, 3], "float_input",   "present"],
        ["scene-002",  "graph-001", "node-002", "func2", "baz", 3, 3, [0, 1, 2, 3], "multidropdown", "override"],
        ["scene-002",  "graph-001", "node-002", "func2", "boo", 4, 4, [0, 1, 2, 3], "textarea",      "unlocked"],
        ["scene-002",  "graph-001", "node-002", "func2", "fuz", 5, 5, [0, 1, 2, 3], "slider",        "present"],
    ];

const columns = [
    "scene-id", "graph-id", "node-id", "node-name", "inport-name",
    "value", "default_value", "options", "widget", "lock"
];

const data = _.map(rows, (row) => (_.zipObject(columns, row)) );

const index = [
    {   parent_column: "node-id", child_columns: ["inport-name", "value", "default_value", "options", "widget", "lock"] },
];

@Component( {components: { Table } })
export default class App extends Vue {
    public columns = columns;
    public rows = rows;
    public data = data;
    public groups = ["node-id", "inport-name"];
}
</script>
