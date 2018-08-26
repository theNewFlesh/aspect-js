<template>
    <v-app dark id="app" class="app" >
        <Table
            :data="data"
            :columns="columns"
            :header_masks="masks"
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
        secondary: "#242424",
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
        min: 10,
        max: 60,
        step: 5,
        tick_step: 10,
        values: [
            // "----------------------------------------------------------------------------------------------------",
            "a", "b", "c", "d", "e",
        ],
        default_color: "success",
    }
}

const text = "texty mctest test";

let rows = [
    ["scene_001",  "graph_001", "node_001", "func1", "foo", 50,   50,   display, "none",        "absent"  ],
    ["scene_001",  "graph_001", "node_001", "func1", "bar", 52,   52,   display, "float_input", "present" ],
    ["scene_002",  "graph_001", "node_001", "func1", "baz", 53,   99,   display, "combobox",    "override"],
    ["scene_002",  "graph_001", "node_001", "func2", "boo", text, text, display, "textarea",    "unlocked"],
    ["scene_002",  "graph_001", "node_002", "func2", "fuz", 55,   55,   display, "slider",      "present" ],
    ["scene_002",  "graph_001", "node_003", "func3", "baz", 53,   99,   display, "combobox",    "override"],
    ["scene_002",  "graph_001", "node_003", "func3", "boo", text, text, display, "textarea",    "unlocked"],
    ["scene_002",  "graph_001", "node_003", "func3", "fuz", 55,   55,   display, "none",        "present" ],
    ["scene_001",  "graph_001", "node_004", "func4", "foo", 50,   50,   display, "none",        "absent"  ],
    ["scene_001",  "graph_001", "node_004", "func4", "bar", 52,   52,   display, "float_input", "present" ],
    ["scene_002",  "graph_001", "node_004", "func4", "baz", 53,   99,   display, "combobox",    "override"],
    ["scene_002",  "graph_001", "node_004", "func4", "boo", text, text, display, "textarea",    "unlocked"],
    ["scene_002",  "graph_001", "node_004", "func4", "fuz", 55,   55,   display, "slider",      "present" ],
    ["scene_002",  "graph_001", "node_005", "func5", "baz", 53,   99,   display, "combobox",    "override"],
    ["scene_002",  "graph_001", "node_005", "func5", "boo", text, text, display, "textarea",    "unlocked"],
    ["scene_002",  "graph_001", "node_005", "func5", "fuz", 55,   55,   display, "none",        "present" ],
    ["scene_001",  "graph_001", "node_005", "func5", "foo", 50,   50,   display, "none",        "absent"  ],
    ["scene_001",  "graph_001", "node_005", "func5", "bar", 52,   52,   display, "float_input", "present" ],
    ["scene_002",  "graph_001", "node_005", "func5", "baz", 53,   99,   display, "combobox",    "override"],
    ["scene_002",  "graph_001", "node_005", "func5", "boo", text, text, display, "textarea",    "unlocked"],
    ["scene_002",  "graph_001", "node_005", "func5", "fuz", 55,   55,   display, "slider",      "present" ],
    ["scene_002",  "graph_001", "node_005", "func5", "baz", 53,   99,   display, "combobox",    "override"],
    ["scene_002",  "graph_001", "node_006", "func6", "boo", text, text, display, "textarea",    "unlocked"],
    ["scene_002",  "graph_001", "node_006", "func6", "fuz", 55,   55,   display, "none",        "present" ],
    ["scene_001",  "graph_001", "node_006", "func6", "foo", 50,   50,   display, "none",        "absent"  ],
    ["scene_001",  "graph_001", "node_006", "func6", "bar", 52,   52,   display, "float_input", "present" ],
    ["scene_002",  "graph_001", "node_006", "func6", "baz", 53,   99,   display, "combobox",    "override"],
    ["scene_002",  "graph_001", "node_006", "func6", "boo", text, text, display, "textarea",    "unlocked"],
    ["scene_002",  "graph_001", "node_006", "func6", "fuz", 55,   55,   display, "slider",      "present" ],
    ["scene_002",  "graph_001", "node_007", "func7", "baz", 53,   99,   display, "combobox",    "override"],
    ["scene_002",  "graph_001", "node_007", "func7", "boo", text, text, display, "textarea",    "unlocked"],
    ["scene_002",  "graph_001", "node_007", "func7", "fuz", 55,   55,   display, "none",        "present" ],
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

const masks = [false, true, true, false];

@Component( {components: { Table } })
export default class App extends Vue {
    public columns = ccols;
    public data = data;
    public masks = masks;
    public indent = true;
}
</script>

<style lang="less">
    .aspect-testarea textarea {
        margin-top: 0px !important;
        font-size: 12px;
        padding-left: 6px !important;
        padding-bottom: 2px !important;
    }

    * {
        box-shadow: unset !important;
    }

    .application.theme--dark {
        background-color: #141414;
        color: #F4F4F4;
    }

    .v-messages {
        display: none;
    }

    button, input, optgroup, select, textarea {
        font-size: 13px;
    }

    @import "./static/css/style.css";
</style>
