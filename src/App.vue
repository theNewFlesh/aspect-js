<template>
    <v-app dark id="app">
        <Table
            :data="data"
            :columns="columns"
            :groups="groups"
            :hide_parent_headers="hide_parent_headers"
            :hide_child_headers="hide_child_headers"
        />
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
        primary: "#A4A4A4",
        secondary: "#F4F4F4",
        accent: "#7EC4CF",
        error: "#F77E70",
        info: "#5F95DE",
        success: "#8BD155",
        warning: "#EB9E58"
    }
});

const options = {
    min: 0,
    max: 100,
    step: 10,
}

const display = {
    height: "20px",
    color: "#5F95DE",
    background_color: "#FF0000",
    thumb_color: "#FF0000",
    thumb_size: "20px",
    track_color: "#FF0000",
    ticks: true,
    placeholder: "text",
}

const rows = [
    ["scene-001",  "graph-001", "node-001", "func1", "foo", 50, 50, options, display, "slider",        "absent"],
    ["scene-001",  "graph-001", "node-001", "func1", "bar", 52, 52, options, display, "float_input",   "present"],
    ["scene-002",  "graph-001", "node-002", "func2", "baz", 53, 53, options, display, "multidropdown", "override"],
    ["scene-002",  "graph-001", "node-002", "func2", "boo", 54, 54, options, display, "textarea",      "unlocked"],
    ["scene-002",  "graph-001", "node-002", "func2", "fuz", 55, 55, options, display, "slider",        "present"],
];

const cols = [
    "scene-id", "graph-id", "node-id", "node-name",
    "inport-name", "value", "default_value", "options", "display", "widget", "lock"
]

const ecols = [
    ["scene-id", "graph-id", "node-id", "node-name"],
    ["inport-name", "value", "default_value", "options", "widget", "lock"]
];

const ccols = [
    ["node-name"],
    ["inport-name", "value"]
];

const data = _.map(rows, (row) => (_.zipObject(cols, row)) );

@Component( {components: { Table } })
export default class App extends Vue {
    public columns = ecols;
    public rows = rows;
    public data = data;
    public groups = ["node-name"];
    public hide_parent_headers = false;
    public hide_child_headers = true;
}
</script>
