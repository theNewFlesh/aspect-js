<template>
    <v-app dark id="app" class="app" >
        <Table
            :data="data"
            :columns="columns"
            :hide_parent_headers="hide_parent_headers"
            :hide_child_headers="hide_child_headers"
            :indent="indent"
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

const display = {
    color: "#5F95DE",
    options: {
        min: 0,
        max: 100,
        step: 10,
        tick_step: 10,
        values: [
            "----------------------------------------------------------------------------------------------------",
            "a", "b", "c", "d", "e",
        ],
        default_color: "red",
    }
}

const rows = [
    ["scene_001",  "graph_001", "node_001", "func1", "foo", 50, 50, display, "none",        "absent"  ],
    ["scene_001",  "graph_001", "node_001", "func1", "bar", 52, 52, display, "float_input", "present" ],
    ["scene_002",  "graph_001", "node_001", "func1", "baz", 53, 99, display, "combobox",    "override"],
    ["scene_002",  "graph_001", "node_001", "func2", "boo", 54, 54, display, "textarea",    "unlocked"],
    ["scene_002",  "graph_001", "node_002", "func2", "fuz", 55, 55, display, "slider",      "present" ],
    ["scene_002",  "graph_001", "node_003", "func3", "baz", 53, 99, display, "combobox",    "override"],
    ["scene_002",  "graph_001", "node_003", "func3", "boo", 54, 54, display, "textarea",    "unlocked"],
    ["scene_002",  "graph_001", "node_003", "func3", "fuz", 55, 55, display, "slider",      "present" ],
];

const cols = [
    "scene_id", "graph_id", "node_id", "node_name",
    "inport_name", "value", "default_value", "display", "widget", "lock"
]

const acols = [
    ["node_name"],
    ["inport_name", "value"]
];

const bcols = [
    ["scene_id", "graph_id", "node_id", "node_name"],
    ["inport_name", "value", "default_value", "display", "widget", "lock"]
];

const ccols = [
    ["scene_id"],
    ["graph_id"],
    ["node_id", "node_name"],
    ["inport_name", "value", "default_value", "options", "widget", "lock"]
];

const data = _.map(rows, (row) => (_.zipObject(cols, row)) );

@Component( {components: { Table } })
export default class App extends Vue {
    public columns = acols;
    public data = data;
    public hide_parent_headers = false;
    public hide_child_headers = false;
    public indent = true;
}
</script>

<style lang="less">
    @import "./static/css/style.css";
    * {
        box-shadow: unset !important;
    }

    .application.theme--dark {
        background-color: #343434;
        color: #F4F4F4;
    }

    .v-messages {
        display: none;
    }

    button, input, optgroup, select, textarea {
        font-size: 13px;
    }
</style>
