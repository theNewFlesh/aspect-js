<template>
    <v-app dark id="app">
        <!-- <TableAg :columns="columns" :rows="rows" :data="data" width /> -->
        <TableVu />
    </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DevContainer from "./components/DevC ontainer.vue";
import TableAg from "./components/table_ag.vue";
import TableVu from "./components/table_vu.vue";
// import * as pf from "vue-patternfly-ts";
import * as _ from "lodash";

import Vuetify from "vuetify";
Vue.use(Vuetify, {
    // theme: {
    //     primary: "#F4F4F4",
    //     secondary: "#242424",
    //     accent: "#A4A4A4",
    //     error: "#F77E70",
    //     info: "#5F95DE",
    //     success: "#8BD155",
    //     warning: "#EB9E58"
    // }
    theme: {
        primary: "#FF0000",
        secondary: "#FF0000",
        accent: "#FF0000",
        error: "#FF0000",
        info: "#FF0000",
        success: "#FF0000",
        warning: "#FF0000"
    }
});

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

@Component( {components: { TableAg, TableVu } })
export default class App extends Vue {
    public columns = columns;
    public rows = rows;
    public data = data;
}
</script>
