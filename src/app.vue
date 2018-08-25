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

const options = {
    min: 0,
    max: 100,
    step: 1,
    tick_step: 10,
}

const cbox = ["a", "b", "c"];

const display = {
    // height: "20px",
    color: "#5F95DE",
    // background_color: "#FF0000",
    // thumb_color: "#FF0000",
    // thumb_size: "20px",
    // track_color: "#FF0000",
    // ticks: true,
    // placeholder: "text",
}

const rows = [
    ["scene-001",  "graph-001", "node-001", "func1", "foo", 50, 50,   options, display, "none",        "absent"  ],
    ["scene-001",  "graph-001", "node-001", "func1", "bar", 52, 52,   options, display, "float_input", "present" ],
    ["scene-002",  "graph-001", "node-001", "func1", "baz", 53, 99,      cbox, display, "combobox",    "override"],
    ["scene-002",  "graph-001", "node-001", "func2", "boo", 54, 54,   options, display, "textarea",    "unlocked"],
    ["scene-002",  "graph-001", "node-002", "func2", "fuz", 55, 55,   options, display, "slider",      "present" ],
    ["scene-002",  "graph-001", "node-003", "func3", "baz", 53, 99,      cbox, display, "combobox",    "override"],
    ["scene-002",  "graph-001", "node-003", "func3", "boo", 54, 54,   options, display, "textarea",    "unlocked"],
    ["scene-002",  "graph-001", "node-003", "func3", "fuz", 55, 55,   options, display, "slider",      "present" ],
];

const cols = [
    "scene-id", "graph-id", "node-id", "node-name",
    "inport-name", "value", "default_value", "options", "display", "widget", "lock"
]

const ecols = [
    ["scene-id", "graph-id", "node-id", "node-name"],
    ["inport-name", "value", "default_value", "options", "widget", "lock"]
];

// const ecols = [
//     ["scene-id"],
//     ["graph-id"],
//     ["node-id", "node-name"],
//     ["inport-name", "value", "default_value", "options", "widget", "lock"]
// ];

const ccols = [
    ["node-name"],
    ["inport-name", "value"]
];

const data = _.map(rows, (row) => (_.zipObject(cols, row)) );

@Component( {components: { Table } })
export default class App extends Vue {
    public columns = ecols;
    public data = data;
    public hide_parent_headers = true;
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
</style>
